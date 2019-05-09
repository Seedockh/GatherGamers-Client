import React from 'react';
import { ScrollView, View, Image, AsyncStorage } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
export default class TabTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            eventsFetch: null
        }
    }

    componentDidMount() {
        this.eventsFetch()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    eventsFetch = async () => {

        await this.getToken()
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        const url = "https://gathergamers.herokuapp.com/api/participant/user/" + decodedToken.id
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
                    console.log(responseJSON)
                    this.setState({ eventsFetch: responseJSON.data.events })
                }
            })
    }

    render() {

        const { eventsFetch } = this.state
        return (
            <ScrollView style={{ flex: 1 }}>
                
                {eventsFetch ? (
                    eventsFetch.map((item, index) => (

                        <Card key={index} >
                            <CardItem>
                                <View>
                                    <Text>{item.name}</Text>
                                    <Text>{item.date}</Text>
                                    <Text>{item.players}</Text>
                                </View>
                            </CardItem>
                        </Card>
                    ))
                ) : (
                        <Text>You have no notifications</Text>
                    )}
                {/* {data.length > 0 ? (
                    data.map((item, index) => (

                        <View key={index} style={{ borderWidth: 3, borderColor: "#000", marginHorizontal: 24, marginVertical: 16, justifyContent: "center", alignItems: "center" }}>

                            <View style={{ marginTop: -12, paddingHorizontal: 8, backgroundColor: "white", alignSelf: "flex-start", marginLeft: 4 }}>
                                <Text note>{item.date}</Text>
                            </View>

                            <View style={{ padding: 8 }}>
                                <Image
                                    style={{ width: vmin(20), height: vmin(20) }}
                                    source={require('../../../../assets/logo.png')}
                                />
                            </View>
                            <View style={{ paddingBottom: 8, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontWeight: "500" }}>{item.title}</Text>
                            </View>
                        </View>

                    ))
                ) : (
                        <Text>Pas de news</Text>
                    )} */}

            </ScrollView>
        );
    }
}