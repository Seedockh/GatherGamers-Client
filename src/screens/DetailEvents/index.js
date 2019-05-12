import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { MapView } from 'expo';
import MapViewDirections from 'react-native-maps-directions';
import { Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import InfoCard from './InfoCard'
import ListCard from './ListCard'
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'

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
          fetchDone: false,
          participantsCount: 0,
          participates: false,
        }
    }

    componentDidMount() {
      this.props.navigation.setParams({ screenTitle: this.props.navigation.state.params.event.title })
      this.fetchParticipants().then(()=>this.setState({fetchDone: true}))
    }

    getParticipants = async() => {
      this.setState({ fetchDone: false });
      await this.fetchParticipants().then(async ()=>{
        this.setState({fetchDone: true})
      });
    }

    fetchParticipants = async () => {
        const token = await Func.getToken()
        const currentUser = await JWT.decode(token, ENV.JWT_KEY)
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/participant/event/${this.props.navigation.state.params.event.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            participants = [];
            await responseJSON.data.participants.Users.forEach(async function(participant,index) {
              this.setState({ token })
              const url = `https://gathergamers.herokuapp.com/api/user/${participant.id}`
              let id = ""
              let nickname = ""
              const response = await Func.fetch(url, "GET", null, auth)
              if(response.status == 401) {
                  Func.toaster("Unauthorized!", "Okay", "danger", 3000);
              } else {
                  let responseJSON = await response.json()
                  id = responseJSON.id
                  nickname = responseJSON.nickname
              }
              let participantToPush = { id, nickname }
              await participants.push(participantToPush)
              this.setState({participantsCount: participants.length, fetchDone: true})
              if (participant.id === currentUser.id) this.setState({participates: true});
              else if (participants.length===index+1) this.setState({participates: false});
            }.bind(this));
        }
    }

    render() {
      const { event, userLocation } = this.props.navigation.state.params;
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
                {userLocation.coordinates[0] && (
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
                    <InfoCard {...this.props}
                      getParticipants={this.getParticipants}
                      participants={participants}
                      fetchDone={this.state.fetchDone}
                      participates={this.state.participates}
                    />
                    <ListCard {...this.props}
                      getParticipants={this.getParticipants}
                      participants={participants}
                      fetchDone={this.state.fetchDone}
                    />
                </ScrollView>
                <FooterTabs {...this.props} />
            </>
        )
    }
}
