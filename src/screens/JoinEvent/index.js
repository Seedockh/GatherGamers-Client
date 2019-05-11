import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Thumbnail, Left, Body } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Location, Permissions } from 'expo';
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import Func from '../../functions.js';
import geolib from 'geolib';

const events = []

export default class JoinEvents extends React.Component {
    static navigationOptions = {
        headerTitle: "Join Event"
    }
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            token: "",
            eventsCount: 0,
            token: null,
            allowGeoloc: false,
            location: {
              type: 'Point',
              coordinates: [48,2]
            },
            locationResult: false,
            fetchDone: false,
        }
        events.length = 0;
    }

    async componentDidMount() {
        await this.checkGeolocation();
        if (this.state.allowGeoloc) await this.getUserLocation();
        await this.fetchEvents();
    }

    async checkGeolocation() {
      // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.setState({ allowGeoloc: true })
        return Location.getCurrentPositionAsync({enableHighAccuracy: true});
      } else {
        this.setState({ allowGeoloc: false })
        Func.toaster("Location permission not granted!", "Okay", "danger", 3000);
      }
    }

    fetchEvents = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = "https://gathergamers.herokuapp.com/api/event/game/"+this.props.navigation.state.params.gameid ;
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
          Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            // When game's events are fetched
              responseJSON.map(async (event) => {
                // Get distance from current user
               const distFromUser = this.state.allowGeoloc ?
                  await geolib.getDistanceSimple(
                    {latitude: this.state.location.coordinates[0], longitude: this.state.location.coordinates[1]},
                    {latitude: event.place.coordinates[0], longitude: event.place.coordinates[1]}
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
                place: event.place,
                address: address,
                distance: distFromUser,
                gameid: event.GameId,
                players: event.players,
                price: event.price,
                type: event.type,
                user: event.UserId
              }
              events.push(eventToPush)
              if (events.length===responseJSON.length) this.setState({fetchDone: true});
            });
        }
    }

    // Checks if user has Accepted Geolocation and returns his position to DB
    async getUserLocation() {
      if (await Location.hasServicesEnabledAsync()) {
        let location = await Location.getCurrentPositionAsync({accuracy: 2});
        await this.setState({ location: {
          type: 'Point',
          coordinates: [location.coords.latitude,location.coords.longitude]
        }, locationResult: true })

        // Sending last User Location to DB
        this.updateUserLocation();
      } else {
        this.state({ locationResult: 'Location permission not enabled !'});
      }
    }

    async updateUserLocation() {
      const token = await Func.getToken()
      this.setState({ token })
      const { location } = this.state
      let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
      const url = `https://gathergamers.herokuapp.com/api/user/updatelocation/${decodedToken.id}`
      const body = JSON.stringify({
        latitude: location.coordinates[0],
        longitude: location.coordinates[1],
      })
      const auth = `Bearer ${token}`
      const response = await Func.fetch(url, 'PUT', body, auth)
      if (response.status == 401) {
        Func.toaster("Unauthorized!", "Okay", "danger", 3000);
      } else {
        let responseJSON = await response.json();
        return responseJSON;
      }
    }

    handleMapRegionChange = mapRegion => {
      this.setState({ mapRegion });
    };

    getDetails(index) {
        this.props.navigation.navigate('DetailEvents', {event: events[index], userLocation: this.state.location})
    }

    renderMarker(item,index) {
      return(
        <MapView.Marker key={index}
          coordinate={{
            latitude: item.place.coordinates[0],
            longitude: item.place.coordinates[1]
          }}
          title={item.title}
          description={item.address}
          pinColor={ 'blue' }
        />
      )
    }

    renderItem(item, index) {
      return(
          <List key={index} >
              <ListItem thumbnail>
              <TouchableOpacity key={index} activeOpacity={0} style={{flexDirection : "row"}} onPress={() => this.getDetails(index)}>
                  <Left>
                      <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                  </Left>
                  <Body>
                      <Text>{item.title}</Text>
                      <Text note numberOfLines={1}>{item.date}</Text>
                      <Text note numberOfLines={1}>{item.address}</Text>
                      <Text note numberOfLines={1}>Distance : {item.distance}km</Text>
                  </Body>
              </TouchableOpacity>
              </ListItem>
          </List>)
    }

    render() {
        return (
            <>
              {this.state.allowGeoloc && !this.state.locationResult &&
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                  <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
                </View>
              }
              {this.state.locationResult &&
                <MapView style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: this.state.location.coordinates[0],
                      longitude: this.state.location.coordinates[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                  {this.state.allowGeoloc &&
                    <MapView.Marker
                      coordinate={{
                        latitude: this.state.location.coordinates[0],
                        longitude: this.state.location.coordinates[1]
                      }}
                      title="Your position"
                      description="This where you are actually located."
                    />
                  }
                  {this.state.fetchDone ? events.map((item,index)=>this.renderMarker(item,index)) : null}
                </MapView>
              }
                <View style={{ flex: 1 }}>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" onChangeText={(searchText) => this.setState({searchText})} />
                        </Item>
                    </Header>
                    {!this.state.fetchDone && (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
                      </View>
                    )}
                    {this.state.fetchDone && (
                      <ScrollView>
                          {events.map((item, index) => this.renderItem(item, index))}
                      </ScrollView>
                    )}
                </View>
                <FooterTabs {...this.props} />
            </>
        )
    }
}
