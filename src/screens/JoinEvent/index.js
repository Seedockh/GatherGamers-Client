import React from 'react';
import { View, Image, AsyncStorage, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Thumbnail, Left, Body, Right, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Location, Permissions } from 'expo';
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'

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
              coordinates: [37.78825,-122.4324]
            },
            locationResult: false
        }
        events.length = 0
    }

    async componentDidMount() {
        await this.checkGeolocation();
        this.fetchEvents();
        if (this.state.allowGeoloc) this.getUserLocation();
    }

    async checkGeolocation() {
      // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.setState({ allowGeoloc: true })
        return Location.getCurrentPositionAsync({enableHighAccuracy: true});
      } else {
        this.setState({ allowGeoloc: false })
        alert('Location permission not granted');
      }
    }

    fetchEvents = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/event/"
        await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.token
                },
            }
            )
            .then(async (response) => {
                if(response.status == 401) {
                    alert("Unauthorized!")
                } else {
                    let responseJSON = await response.json()
                    responseJSON.data.events.forEach(function(event) {
                        let eventToPush = {
                            id: event.id,
                            title: event.name,
                            date: event.date,
                            place: event.place,
                            gameid: event.GameId,
                            players: event.players,
                            price: event.price,
                            type: event.type,
                            user: event.UserId
                        }
                        events.push(eventToPush)
                    });
                }
                console.log(events);
        })
        this.setState({eventsCount: events.length})
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
      await this.getToken()
      const { token, id, location } = this.state
      let decodedToken = JWT.decode(token, ENV.JWT_KEY)
      const url = "https://gathergamers.herokuapp.com/api/user/updatelocation/"+decodedToken.id
      await fetch( url, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.state.token
        },
        body: JSON.stringify({
            latitude: location.coordinates[0],
            longitude: location.coordinates[1],
        })
      }).then(async (response) => {
        if (response.status == 401) {
          console.log(response);
          alert("Unauthorized!")
        } else {
          let responseJSON = await response.json();
        }
      });
    }

    handleMapRegionChange = mapRegion => {
      this.setState({ mapRegion });
    };

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    onDetails(index) {
        this.props.navigation.navigate('DetailEvents', {event: events[index]})
    }

    renderItem(item, index) {
        if (item.title.indexOf(this.state.searchText) !== -1 && this.props.navigation.state.params!==undefined) {
            if (item.gameid == this.props.navigation.state.params.gameid) {
                return(
                    <List key={index} >
                        <ListItem thumbnail>
                        <TouchableOpacity key={index} activeOpacity={0} style={{flexDirection : "row"}} onPress={() => this.onDetails(index)}>
                            <Left>
                                <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                            </Left>
                            <Body>
                                <Text>{item.title}</Text>
                                <Text note numberOfLines={1}>{item.date}</Text>
                                <Text note numberOfLines={1}>{item.place.coordinates}</Text>
                            </Body>
                        </TouchableOpacity>
                        </ListItem>
                    </List>)
            } else {
                return null
            }
        } else {
            return null
        }
    }

    render() {
        return (
            <>
              {this.state.allowGeoloc && !this.state.locationResult &&
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                  <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
                </View>
              }
              {this.state.allowGeoloc && this.state.locationResult &&
                <MapView style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: this.state.location.coordinates[0],
                      longitude: this.state.location.coordinates[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                  <MapView.Marker
                    coordinate={{
                      latitude: this.state.location.coordinates[0],
                      longitude: this.state.location.coordinates[1]
                    }}
                    title="Your position"
                    description="This where you are actually located."
                  />
                </MapView>
              }
                <View style={{ flex: 1 }}>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" onChangeText={(searchText) => this.setState({searchText})} />
                        </Item>
                    </Header>

                    <ScrollView>
                        {events.length > 0 ? events.map((item, index) => this.renderItem(item, index)) : null}
                    </ScrollView>
                </View>

                <FooterTabs {...this.props} />
            </>
        )
    }
}
