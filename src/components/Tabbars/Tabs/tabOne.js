import React from 'react';
import { ScrollView, View, AsyncStorage } from 'react-native';
import { Text, CardItem } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabone'
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
            <ScrollView style={Style.scrollview}>

                {notifsFetch ? (
                    notifsFetch.map((item, index) => (

                        <View key={index} style={{ marginHorizontal: 16, marginVertical: 4, marginTop: index === 0 ? 8 : 0 }}>
                            <CardItem style={{ backgroundColor: item.type ? "#48CA75" : "#EE4F5E", borderRadius: 10}}>
                                <View>
                                    <Text>{item.message}</Text>
                                    <Text note style={Style.textnote} >{item.createdAt}</Text>
                                </View>
                            </CardItem>
                        </View>
                    ))
                ) : (
                        <Text style={Style.textnonotif}>You have no notifications</Text>
                    )}

            </ScrollView>
        );
    }
}