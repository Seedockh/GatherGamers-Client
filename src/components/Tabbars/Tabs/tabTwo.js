import React from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, CardItem } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabtwo'
import Func from '../../../functions.js';

export default class TabTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            eventsFetch: null,
            refreshing: false,
        }
    }

    componentDidMount() {
        this.eventsFetch()
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.eventsFetch().then(() => {
            this.setState({ refreshing: false });
        });
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
            this.setState({ eventsFetch: responseJSON.data.events })
        }
    }

    render() {
        const { eventsFetch } = this.state
        return (
            <ScrollView style={Style.scrollview} refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
            }>
                {!eventsFetch && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000000" />
                    </View>
                )}
                {eventsFetch && eventsFetch.length > 0 && (
                    eventsFetch.map((item, index) => (
                        <View key={index} style={{ marginHorizontal: 16, marginVertical: 4, marginTop: index === 0 ? 8 : 0 }}>
                            <CardItem style={Style.carditem}>
                                <View style={Style.container}>
                                    <Text style={Style.name}>{item.name}</Text>
                                    <View style={Style.view}>
                                        <Text>Nombre de participants :</Text>
                                        <Text>{item.players}</Text>
                                    </View>
                                    <View style={Style.view}>
                                        <Text>Date :</Text>
                                        <Text>{item.date}</Text>
                                    </View>
                                </View>
                            </CardItem>
                        </View>
                    ))
                )}
                {eventsFetch && eventsFetch.length === 0 && (
                    <Text style={Style.textnonotif}> You're not participating to any event yet. </Text>
                )}
            </ScrollView>
        );
    }
}
