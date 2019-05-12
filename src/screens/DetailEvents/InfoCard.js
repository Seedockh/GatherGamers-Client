import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Card, CardItem, Body, Text, Button } from 'native-base';
import Func from '../../functions.js';
import ENV from '../../../env'
import JWT from 'expo-jwt'

export default class InfoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            eventAuthor: "",
            isParticipating: this.props.participates,
        }
    }

    async componentDidMount() {
       await this.fetchAuthor()
    }

    pushNotif = async (message, type) => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = "https://gathergamers.herokuapp.com/api/notification/add"
        const body = JSON.stringify({
            UserId: decodedToken.id,
            message: message,
            type: type
        })
        const auth = `Bearer ${token}`
        await Func.fetch(url, "POST", body, auth)
    }

    subscribe = async () => {
        const token = await Func.getToken()
        let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
        this.setState({ token })
        const url = "https://gathergamers.herokuapp.com/api/participant/add"
        const body = JSON.stringify({
            UserId: decodedToken.id,
            EventId: this.props.navigation.state.params.event.id,
        })
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "POST", body, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            this.setState({ participates: true });
            this.props.getParticipants();
            Func.toaster("See you at the event!", "Okay", "success", 1000);
            this.pushNotif(`You have joined the event ${this.props.navigation.state.params.event.id}`, 1)
        }
    }

    unsubscribe = async () => {
        const token = await Func.getToken()
        let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
        this.setState({ token });
        const url = "https://gathergamers.herokuapp.com/api/participant/delete/"+this.props.navigation.state.params.event.id+"/"+decodedToken.id
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "DELETE", null, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            this.setState({ participates: false });
            this.props.getParticipants();
            Func.toaster("Subscription cancelled", "Okay", "warning", 1000);
            this.pushNotif(`You left the event ${this.props.navigation.state.params.event.id}`, 0)
        }
    }

    fetchAuthor = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/user/${this.props.navigation.state.params.event.user}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth);
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({eventAuthor: responseJSON.nickname})
        }
    }

    render() {
        const { eventAuthor } = this.state;
        return (
          <>
            {!this.props.fetchDone && (
              <View style={{ flex: 1, justifyContent: 'center', marginVertical: 50, flexDirection: 'row'}}>
                <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
              </View>
            )}
            {this.props.fetchDone && (
            <View style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Informations</Text>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Titre</Text>
                                <Text>{this.props.navigation.state.params.event.title}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Auteur</Text>
                                <Text>{this.state.eventAuthor}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Date</Text>
                                <Text>{this.props.navigation.state.params.event.date}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Lieu</Text>
                                <Text>{this.props.navigation.state.params.event.address}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Distance</Text>
                                <Text>{this.props.navigation.state.params.event.distance}km</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Nombre de joueurs</Text>
                                <Text>{this.props.navigation.state.params.event.players}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Type</Text>
                                <Text>{this.props.navigation.state.params.event.type}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2, paddingBottom: 8 }}>
                                <Text>Prix en jeux</Text>
                                <Text>{this.props.navigation.state.params.event.price}€</Text>
                            </View>
                          {!this.props.fetchDone && (
                            <View style={{ flex: 1, justifyContent: 'center', marginVertical: 50, flexDirection: 'row'}}>
                              <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
                            </View>
                          )}
                           {this.props.fetchDone && !this.props.participates && (
                               <Button block success onPress={() => this.subscribe()}>
                                   <Text>SUBSCRIBE</Text>
                               </Button>
                            )}
                            {this.props.fetchDone && this.props.participates && (
                               <Button block danger onPress={() => this.unsubscribe()}>
                                   <Text>UNSUBSCRIBE</Text>
                               </Button>
                             )}

                        </Body>
                    </CardItem>
                </Card>
            </View>
            )}
          </>
        )
    }
}
