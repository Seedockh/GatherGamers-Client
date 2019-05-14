import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Body, Right } from 'native-base';
import FooterTabs from '../../components/FooterTabs'
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Location, Permissions } from 'expo';
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import Func from '../../functions.js';
import geolib from 'geolib';
import Style from '../../styles/joinevent'

const events = []

export default class JoinEvents extends React.Component {
  static navigationOptions = {
    headerTitle: "Join Event"
  }
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      eventsCount: 0,
      token: null,
      allowGeoloc: false,
      location: {
        type: 'Point',
        coordinates: [48, 2]
      },
      locationResult: false,
      fetchDone: false,
    }
    events.length = 0;
  }

  async componentDidMount() {
    const token = await Func.getToken()
    let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
    const location = await Func.checkGeolocation();

    this.setState({ token, decodedToken, location: location[0], allowGeoloc: location[1] });
    if (this.state.allowGeoloc) {
      const response = await Func.getUserLocation(token,decodedToken);
      this.setState({ location: response[1], locationResult: response[2] })
    }
    await this.fetchEvents();
  }

  fetchEvents = async () => {
    const token = await Func.getToken()
    this.setState({ token })
    const url = "https://gathergamers.herokuapp.com/api/event/game/" + this.props.navigation.state.params.gameid;
    const auth = `Bearer ${token}`
    const response = await Func.fetch(url, "GET", null, auth)
    if (response.status == 401) {
      Func.toaster("Unauthorized!", "Okay", "danger", 3000);
    } else {
      let responseJSON = await response.json()
      // When game's events are fetched
      if (responseJSON.length===0) { this.setState({ fetchDone: true }) }
      responseJSON.map(async (event) => {
        event.formatedDate = await Func.formatDate(event.date)
        // Get distance from current user
        const distFromUser = this.state.allowGeoloc ?
          await geolib.getDistanceSimple(
            { latitude: this.state.location.coordinates[0], longitude: this.state.location.coordinates[1] },
            { latitude: event.place.coordinates[0], longitude: event.place.coordinates[1] }
          ) / 1000 : null;
        // Get address string from event coordinates
        const address =
          await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.place.coordinates[0]},${event.place.coordinates[1]}&key=${KEY.MAPS_API_KEY}`)
            .then(res => res.json())
            .then((json) => {
              if (json.status !== 'OK') {
                throw new Error(`Geocode error: ${json.status}`);
              }
              return json.results[0].formatted_address;
            });
        // Push the event with all infos
        const eventToPush = {
          id: event.id,
          title: event.name,
          date: event.date,
          formatedDate: event.formatedDate.split(" ")[0],
          place: event.place,
          address: address,
          distance: distFromUser,
          gameid: event.GameId,
          players: event.players,
          price: event.price,
          type: event.type,
          userid: event.UserId
        }
        events.push(eventToPush)
        if (events.length === responseJSON.length) this.setState({ fetchDone: true });
      });
    }
  }

  getDetails(index) {
    this.props.navigation.navigate('DetailEvents', { event: events[index], userLocation: this.state.location, allowGeoloc: this.state.allowGeoloc })
  }

  renderMarker(item, index) {
    return (
      <MapView.Marker key={index}
        coordinate={{
          latitude: item.place.coordinates[0],
          longitude: item.place.coordinates[1]
        }}
        title={item.title}
        description={item.address}
        pinColor={'blue'}
      />
    )
  }

  renderItem(item, index) {
    if (item.title.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1) {
      return (
        <List key={index} >
          <ListItem >
            <TouchableOpacity key={index} activeOpacity={0.5} style={Style.touchable} onPress={() => this.getDetails(index)}>
              <Body>
                <Text>{item.title}</Text>
                <Text note numberOfLines={1}>{item.formatedDate}</Text>
                <Text note numberOfLines={1}>{item.address}</Text>
                <Text note numberOfLines={1}>Distance : {item.distance}km</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </TouchableOpacity>
          </ListItem>
        </List>)
    } else return null;
  }

  render() {
    return (
      <>
        {this.state.allowGeoloc && !this.state.locationResult &&
          <View style={Style.activityview}>
            <ActivityIndicator style={Style.activity} size="large" color="#000000" />
          </View>
        }
        {this.state.allowGeoloc && this.state.locationResult &&
          <MapView
            style={{flex:1}}
            style={Style.mapview}
            initialRegion={{
              latitude: this.state.location.coordinates[0],
              longitude: this.state.location.coordinates[1],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {this.state.locationResult &&
              <MapView.Marker
                coordinate={{
                  latitude: this.state.location.coordinates[0],
                  longitude: this.state.location.coordinates[1]
                }}
                title="Your position"
                description="This where you are actually located."
              />
            }
            {this.state.fetchDone ? events.map((item, index) => this.renderMarker(item, index)) : null}
          </MapView>
        }
        {!this.state.allowGeoloc && !this.state.locationResult &&
          <MapView
            style={{flex:1}}
            style={Style.mapview}
            initialRegion={{
              latitude: 48.856614,
              longitude: 2.3522219,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {this.state.fetchDone ? events.map((item, index) => this.renderMarker(item, index)) : null}
          </MapView>
        }
        <View style={Style.view}>
          <Header searchBar rounded style={Style.header}>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search" onChangeText={(searchText) => this.setState({ searchText })} />
            </Item>
          </Header>
          {!this.state.fetchDone && (
            <View style={Style.activityview}>
              <ActivityIndicator style={Style.activity} size="large" color="#000000" />
            </View>
          )}
          {this.state.fetchDone && events.length > 0 && (
            <ScrollView>
              {events.map((item, index) => this.renderItem(item, index))}
            </ScrollView>
          )}
          {this.state.fetchDone && events.length===0 && (
            <View style={Style.activityview}>
              <Text style={{fontSize:20, textAlign:'center', marginTop:20}}> No events created yet. </Text>
            </View>
          )}
        </View>
        <FooterTabs {...this.props} />
      </>
    )
  }
}
