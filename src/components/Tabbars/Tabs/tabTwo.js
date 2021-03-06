import React from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, CardItem,  List, ListItem, Body, Right, Icon } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import KEY from '../../../../secretenv.js'
import Style from '../../../styles/tabtwo'
import Func from '../../../functions.js';
import { withNavigationFocus } from "react-navigation";

let events = []

class TabTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            fetchDone: false,
            refreshing: false,
            allowGeoloc: false,
            location: {
              type: 'Point',
              coordinates: [48.856614, 2.3522219] // Paris by default
            },
        }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isFocused !== this.props.isFocused) {
        this.eventsFetch()
      }
    }

    async componentDidMount() {
      const location = await Func.checkGeolocation();
      this.setState({ location: location[0], allowGeoloc: location[1] });
      this.eventsFetch()
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true, fetchDone: false });
        await this.eventsFetch();
        this.setState({ refreshing: false });
    }

    eventsFetch = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/participant/user/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json();
            if (responseJSON.data.events.length===0) return this.setState({ fetchDone: true });
            events = [];
            responseJSON.data.events.map(async (event) => {
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
                  const url = `https://gathergamers.herokuapp.com/api/participant/event/${event.id}`
                  const response = await Func.fetch(url, "GET", null, auth)
                  let playersSubscribed = 0
                  if(response.status == 401) {
                      Func.toaster("Unauthorized!", "Okay", "danger", 3000);
                  } else {
                      let responseJSON = await response.json()
                      participants = [];
                      playersSubscribed = await responseJSON.data.participants.Users.length
                  }
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
                    userid: event.UserId,
                    playersSubscribed: playersSubscribed
                  }
                  events.push(eventToPush)
                  if (events.length === responseJSON.data.events.length ) this.setState({ fetchDone: true });
                });
        }
    }

    getDetails(index) {
      this.props.navigation.navigate('DetailEvents', { event: events[index], userLocation: this.state.location, allowGeoloc: this.state.allowGeoloc })
    }

    render() {
        const { fetchDone, refreshing } = this.state
        return (
            <ScrollView style={Style.scrollview} refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
            }>
                {!fetchDone && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000000" />
                    </View>
                )}
                {fetchDone && events.length > 0 && !refreshing &&  (
                    events.map((item, index) => (
                      <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this.getDetails(index)}>
                        <View key={index} style={{ marginHorizontal: 16, marginVertical: 4, marginTop: index === 0 ? 8 : 0 }}>
                          <CardItem style={Style.carditem}>
                              <View style={Style.container}>
                                  <Text style={Style.name}>{item.title}</Text>
                                  <View style={Style.view}>
                                      <Text>Players:</Text>
                                      <Text>{item.playersSubscribed} on {item.players}</Text>
                                  </View>
                                  <View style={Style.view}>
                                      <Text>Date:</Text>
                                      <Text>{item.formatedDate}</Text>
                                  </View>
                              </View>
                          </CardItem>
                        </View>
                      </TouchableOpacity>
                    ))
                )}
                {fetchDone && events.length === 0 && !refreshing && (
                    <Text style={Style.textnonotif}> You're not participating to any event yet. </Text>
                )}
            </ScrollView>
        );
    }
}

export default withNavigationFocus(TabTwo)