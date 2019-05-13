import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button } from 'native-base';
import Func from '../../functions.js';
import ENV from '../../../env'
import JWT from 'expo-jwt'
import Style from '../../styles/infocard'
export default class InfoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            eventAuthor: "",
            isParticipating: "",
        }
    }

    async componentDidMount() {
        this.setState({ isParticipating: this.props.participates })
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
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            this.setState({ isParticipating: true });
            this.props.getParticipants();
            Func.toaster("See you at the event!", "Okay", "success", 1000);
            this.pushNotif(`You have joined the event ${this.props.navigation.state.params.event.title}`, 1)
        }
    }

    unsubscribe = async () => {
        const token = await Func.getToken()
        let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
        this.setState({ token });
        const url = "https://gathergamers.herokuapp.com/api/participant/delete/" + this.props.navigation.state.params.event.id + "/" + decodedToken.id
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "DELETE", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            await response.json()
            this.setState({ isParticipating: false });
            this.props.getParticipants();
            Func.toaster("Subscription cancelled", "Okay", "warning", 1000);
            this.pushNotif(`You left the event ${this.props.navigation.state.params.event.title}`, 0)
        }
    }

    fetchAuthor = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/user/${this.props.navigation.state.params.event.user}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth);
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({ eventAuthor: responseJSON.nickname })
        }
    }

    render() {
        const { eventAuthor } = this.state;
        return (
            <>
                {!this.props.fetchDone && (
                    <View style={Style.activityview}>
                        <ActivityIndicator style={Style.activity} size="large" color="#000000" />
                    </View>
                )}
                {this.props.fetchDone && (
                    <View style={Style.container}>
                        <View style={Style.view}>
                            <Text style={Style.text}>Titre :</Text>
                            <Text>{this.props.navigation.state.params.event.title}</Text>
                        </View>
                        {this.state.eventAuthor!=="" && (
                          <View style={Style.view}>
                              <Text style={Style.text}>Auteur :</Text>
                              <Text>{this.state.eventAuthor}</Text>
                          </View>
                        )}
                        <View style={Style.view}>
                            <Text style={Style.text}>Date :</Text>
                            <Text>{this.props.navigation.state.params.event.formatedDate}</Text>
                        </View>
                        <View style={Style.view}>
                            <Text style={Style.text}>Lieu :</Text>
                            <View style={Style.adressview}>
                                <Text style={Style.adresstext}>{this.props.navigation.state.params.event.address}</Text>
                            </View>

                        </View>
                        <View style={Style.view}>
                            <Text style={Style.text}>Distance :</Text>
                            <Text>{this.props.navigation.state.params.event.distance}km</Text>
                        </View>
                        <View style={Style.view}>
                            <Text style={Style.text}>Nombre de joueurs :</Text>
                            <Text>{this.props.navigation.state.params.event.players}</Text>
                        </View>
                        <View style={Style.view}>
                            <Text style={Style.text}>Type :</Text>
                            <Text>{this.props.navigation.state.params.event.type}</Text>
                        </View>
                        <View style={Style.priceview}>
                            <Text style={Style.text}>Prix en jeux :</Text>
                            <Text>{this.props.navigation.state.params.event.price} €</Text>
                        </View>

                        {this.props.participates===false &&
                            <Button block success onPress={() => this.subscribe()}>
                                <Text>SUBSCRIBE</Text>
                            </Button>
                        }
                        {this.props.participates===true &&
                            <Button block danger onPress={() => this.unsubscribe()}>
                                <Text>UNSUBSCRIBE</Text>
                            </Button>
                        }
                    </View>
                )}
            </>
        )
    }
}
