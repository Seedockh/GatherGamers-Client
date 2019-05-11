import React from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import { Content, Card, CardItem, Body, Text, Button, Toast } from 'native-base';
import ENV from '../../../env'
import JWT from 'expo-jwt'

export default class InfoCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            eventAuthor: "",
        }
    }

    componentDidMount() {
        this.fetchAuthor()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    toastMessage(status, message) {
        Toast.show({
            text: `${message}`,
            buttonText: "Okay",
            type: `${status}`,
            duration: 3000
        })
    }

    subscribe = async () => {
        await this.getToken()
        const { token } = this.state
        let decodedToken = JWT.decode(token, ENV.JWT_KEY)
        const url = "https://gathergamers.herokuapp.com/api/participant/add"
        await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.token
                },
                body: JSON.stringify({
                    UserId: decodedToken.id,
                    EventId: this.props.navigation.state.params.event.id,
                })
            }
            )
            .then(async (response) => {
                if(response.status == 401) {
                    this.toastMessage("danger", "Unauthorized!")
                } else {
                    await response.json()
                    this.toastMessage("success", "See you at the event!")
                }
        })
    }

    fetchAuthor = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/user/" + this.props.navigation.state.params.event.user
        await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.token
                }
            }
            )
            .then(async (response) => {
                if(response.status == 401) {
                    this.toastMessage("danger", "Unauthorized!")
                } else {
                    let responseJSON = await response.json()
                    this.setState({eventAuthor: responseJSON.nickname})
                }
        })
    }

    render() {
        return (
          <>
            {this.state.eventAuthor==="" && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
              </View>
            )}
            {this.state.eventAuthor!=="" && (
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
                                <Text>Latitude : {this.props.navigation.state.params.event.place.coordinates[0]}</Text>
                                <Text>Longitude : {this.props.navigation.state.params.event.place.coordinates[1]}</Text>
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
                            <Button block success onPress={() => this.subscribe()}>
                                <Text>SUBSCRIBE</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            </View>
            )}
          </>
        )
    }
}
