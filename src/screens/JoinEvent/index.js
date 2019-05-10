import React from 'react';
import { View, Image, AsyncStorage, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Thumbnail, Left, Body, Right, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Location } from 'expo';

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
            mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            locationResult: false,
            location: { coords: {
                latitude: 37.78825,
                longitude: -122.4324
            } },
        }
        events.length = 0
    }

    componentDidMount() {
        this.fetchEvents();
        this.getUserLocation();
    }

    handleMapRegionChange = mapRegion => {
      this.setState({ mapRegion });
    };

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    async getUserLocation() {
      if (await Location.hasServicesEnabledAsync()) {
        let location = await Location.getCurrentPositionAsync({accuracy: 2});
        this.setState({ location: location, locationResult: true })
        //console.log(this.state.location);
      } else {
        this.state({ locationResult: 'Location permission not enabled !'});
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
        })
        this.setState({eventsCount: events.length})
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
                                <Text note numberOfLines={1}>{item.place}</Text>
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
              {!this.state.locationResult &&
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                  <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
                </View>
              }
              {this.state.locationResult &&
                <MapView style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: this.state.location.coords.latitude,
                      longitude: this.state.location.coords.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                  <MapView.Marker
                    coordinate={this.state.location.coords}
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
