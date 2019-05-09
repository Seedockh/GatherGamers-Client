import React from 'react';
import { ScrollView, View, Image, AsyncStorage } from 'react-native';
import { Text, Card, CardItem, Body } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
export default class TabOne extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            notifsFetch: null
        }
    }

    componentDidMount() {
        this.fetchNotif()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    fetchNotif = async () => {

        await this.getToken()
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        const url = "https://gathergamers.herokuapp.com/api/notification/user/" + decodedToken.id
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

                if (response.status == 401) {
                    alert("Unauthorized!")
                } else {
                    let responseJSON = await response.json()
                    this.setState({ notifsFetch: responseJSON.data.notifs })
                }
            })
    }

    render() {

        const { notifsFetch } = this.state

        return (
            <ScrollView style={{ flex: 1 }}>

                {notifsFetch ? (
                    notifsFetch.map((item, index) => (

                        <Card key={index} >
                            <CardItem style={{ backgroundColor: item.type ? "green" : "red" }}>
                                <View>
                                    <Text>{item.message}</Text>
                                    <Text>{item.createdAt}</Text>
                                </View>
                            </CardItem>
                        </Card>
                    ))
                ) : (
                        <Text>You have no notifications</Text>
                    )}

            </ScrollView>
        );
    }
}