import React from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { Content, Card, CardItem, Body, Text, Button, List, ListItem } from 'native-base';
import Func from '../../functions.js';
import { vmin } from 'react-native-expo-viewport-units';
import { MapView } from 'expo';
import FooterTabs from '../../components/FooterTabs'
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import StyleInfos from '../../styles/infocard'
import StyleListCards from '../../styles/listcard'

let participants = []

export default class DetailEvents extends React.Component {

    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('screenTitle')
      }
    }

    constructor(props) {
        super(props);
        this.state = {
          token: null,
          decodedToken: null,
          fetchDone: false,
          participantsCount: 0,
          participates: false,
          allowGeoloc: false,
          eventAuthor: "",
          switchSubscription: false
        }
    }

    async componentDidMount() {
      const token = await Func.getToken()
      await this.setState({ token: token });
      const decodedToken = await JWT.decode(token, ENV.JWT_KEY)
      const location = await Func.checkGeolocation();
      this.setState({ allowGeoloc: location[1], decodedToken: decodedToken });
      this.props.navigation.setParams({ screenTitle: this.props.navigation.state.params.event.title })
      this.fetchParticipants().then(async ()=>{
        await this.fetchAuthor()
        this.setState({fetchDone: true})
      });
      fetches = 0;
    }

    getParticipants = async() => {
      this.setState({ fetchDone: false });
      await this.fetchParticipants().then(async ()=>{
        this.setState({fetchDone: true})
      });
    }

    fetchParticipants = async () => {
        const url = `https://gathergamers.herokuapp.com/api/participant/event/${this.props.navigation.state.params.event.id}`
        const auth = `Bearer ${this.state.token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
            Func.toaster("Get Event details : Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            participants = [];
            if (responseJSON.data.participants.Users.length===0) return this.setState({ fetchDone: true })

            await responseJSON.data.participants.Users.forEach(async function(participant,index) {
              const url = `https://gathergamers.herokuapp.com/api/user/${participant.id}`
              let id = ""
              let nickname = ""
              const response = await Func.fetch(url, "GET", null, auth)
              if(response.status == 401) {
                  Func.toaster("Get Participants : Unauthorized!", "Okay", "danger", 3000);
              } else {
                  let responseJSON = await response.json()
                  id = responseJSON.id
                  nickname = responseJSON.nickname
              }
              let participantToPush = { id, nickname }
              await participants.push(participantToPush);
              this.setState({ participantsCount: participants.length })
              if (!this.state.switchSubscription) {
                if (participant.id === this.state.decodedToken.id) this.setState({participates: true});
              } else {
                this.setState({ switchSubscription: false })
              }
            }.bind(this));
        }
    }

    subscribe = async () => {
        const { token, decodedToken } = this.state;
        const url = "https://gathergamers.herokuapp.com/api/participant/add"
        const body = JSON.stringify({
            UserId: decodedToken.id,
            EventId: this.props.navigation.state.params.event.id,
        })
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "POST", body, auth)
        if (response.status == 401) {
            Func.toaster("Subscribe : Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            await this.setState({ participates: true, switchSubscription: true });
            this.getParticipants();
            Func.toaster("See you at the event!", "Okay", "success", 1000);
            Func.pushNotif(`You have joined the event ${this.props.navigation.state.params.event.title}`, 1, token, decodedToken)
        }
    }

    unsubscribe = async () => {
        const { token, decodedToken } = this.state;
        const url = "https://gathergamers.herokuapp.com/api/participant/delete/" + this.props.navigation.state.params.event.id + "/" + decodedToken.id
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "DELETE", null, auth)
        if (response.status == 401) {
            Func.toaster("Unsubscribe : Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            await this.setState({ participates: false, switchSubscription: true });
            this.getParticipants();
            Func.toaster("Subscription cancelled", "Okay", "warning", 1000);
            Func.pushNotif(`You left the event ${this.props.navigation.state.params.event.title}`, 0, token, decodedToken)
        }
    }

    fetchAuthor = async () => {
        const { token } = this.state;
        const url = `https://gathergamers.herokuapp.com/api/user/${this.props.navigation.state.params.event.userid}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth);
        if (response.status == 401) {
            Func.toaster("Get Author : Unauthorized", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({ eventAuthor: responseJSON.nickname })
        }
    }

    renderItem(item, index) {
        return (
            <List key={index}>
                <ListItem>
                    <Body>
                        <Text>{item.nickname}</Text>
                    </Body>
                </ListItem>
            </List>)
    }

    render() {
      const { event, userLocation } = this.props.navigation.state.params;
      const { eventAuthor, allowGeoloc, fetchDone, participates } = this.state;
        return (
            <>
              <MapView style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: event.place.coordinates[0],
                    longitude: event.place.coordinates[1],
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude: event.place.coordinates[0],
                      longitude: event.place.coordinates[1],
                    }}
                    title={event.title}
                    description={event.address}
                    pinColor={ 'blue' }
                  />
                {userLocation.coordinates[0] && allowGeoloc && (
                  <>
                    <MapView.Marker
                      coordinate={{
                        latitude: userLocation.coordinates[0],
                        longitude: userLocation.coordinates[1],
                      }}
                      title='Your position'
                    />
                    <MapViewDirections
                      origin={{
                        latitude: userLocation.coordinates[0],
                        longitude: userLocation.coordinates[1]
                      }}
                      destination={{
                        latitude: event.place.coordinates[0],
                        longitude: event.place.coordinates[1]
                      }}
                      apikey={KEY.MAPS_API_KEY}
                      strokeWidth={5}
                      strokeColor="#9b3737"
                    />
                  </>
                )}
              </MapView>
              <ScrollView style={{ flex: 1 }}>
                  {!fetchDone && (
                      <View style={StyleInfos.activityview}>
                          <ActivityIndicator style={StyleInfos.activity} size="large" color="#000000" />
                      </View>
                  )}
                  {fetchDone && (
                      <View style={StyleInfos.container}>
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Titre :</Text>
                              <Text>{this.props.navigation.state.params.event.title}</Text>
                          </View>
                          {this.state.eventAuthor!=="" && (
                            <View style={StyleInfos.view}>
                                <Text style={StyleInfos.text}>Auteur :</Text>
                                <Text>{this.state.eventAuthor}</Text>
                            </View>
                          )}
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Date :</Text>
                              <Text>{event.formatedDate}</Text>
                          </View>
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Lieu :</Text>
                              <View style={StyleInfos.adressview}>
                                  <Text style={StyleInfos.adresstext}>{event.address}</Text>
                              </View>

                          </View>
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Distance :</Text>
                              <Text>{event.distance}km</Text>
                          </View>
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Nombre de joueurs :</Text>
                              <Text>{event.players}</Text>
                          </View>
                          <View style={StyleInfos.view}>
                              <Text style={StyleInfos.text}>Type :</Text>
                              <Text>{event.type}</Text>
                          </View>
                          <View style={StyleInfos.priceview}>
                              <Text style={StyleInfos.text}>Prix en jeux :</Text>
                              <Text>{event.price} €</Text>
                          </View>

                          {fetchDone && !participates &&
                              <Button block success onPress={() => this.subscribe()}>
                                  <Text>SUBSCRIBE</Text>
                              </Button>
                          }
                          {fetchDone && participates &&
                              <Button block danger onPress={() => this.unsubscribe()}>
                                  <Text>UNSUBSCRIBE</Text>
                              </Button>
                          }
                      </View>
                  )}
                  <View style={StyleListCards.container}>
                      {!fetchDone && (
                        <View style={StyleInfos.activityview}>
                            <ActivityIndicator style={StyleInfos.activity} size="large" color="#000000" />
                        </View>
                      )}
                      {fetchDone && (
                        <Card>
                            <CardItem header bordered>
                                <View style={StyleListCards.view}>
                                    <Text style={StyleListCards.text}>Participants</Text>
                                </View>
                            </CardItem>
                            <CardItem bordered>
                                <Content>
                                    {participants.length > 0 ? participants.map((item, index) => this.renderItem(item, index)) : null}
                                </Content>
                            </CardItem>
                        </Card>
                      )}
                  </View>
                </ScrollView>
                <FooterTabs {...this.props} />
            </>
        )
    }
}
