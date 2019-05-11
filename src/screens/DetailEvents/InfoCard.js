import React from 'react';
import { View } from 'react-native';
import { Card, CardItem, Body, Text, Button } from 'native-base';
import Func from '../../functions.js';

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

    subscribe = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = "https://gathergamers.herokuapp.com/api/participant/add"
        const body = JSON.stringify({
            UserId: this.props.navigation.state.params.event.user,
            EventId: this.props.navigation.state.params.event.id,
        })
        const auth = `Bearer ${token}`
        await Func.fetch(url, "POST", body, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            Func.toaster("See you at the event!", "Okay", "success", 3000);
        }        
    }

    fetchAuthor = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/user/${this.props.navigation.state.params.event.user}`
        const auth = `Bearer ${token}`
        await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({eventAuthor: responseJSON.nickname}) 
        }
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
