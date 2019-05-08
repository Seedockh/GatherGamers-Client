import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Content, Card, CardItem, Body, Text, Button } from 'native-base';

export default class InfoCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: ""
        }
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    subscribe = async () => {
        await this.getToken()
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
                    UserId: this.props.navigation.state.params.event.user,
                    EventId: this.props.navigation.state.params.event.id,
                })
            }
            )
            .then(async (response) => {
                if(response.status == 401) {
                    alert("Unauthorized!")
                } else {
                    await response.json()
                    alert("See you at the event!")
                }
        })
    }

    render() {
        return (
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
                                <Text>Author</Text>
                                <Text>{this.props.navigation.state.params.event.user}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Date</Text>
                                <Text>{this.props.navigation.state.params.event.date}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Lieu</Text>
                                <Text>{this.props.navigation.state.params.event.place}</Text>
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
        )
    }
}