import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Content, Card, CardItem, Body, Text } from 'native-base';
import JWT from 'expo-jwt'
import Style from '../../styles/cardfix'
import ENV from '../../../env'

export default class CardFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            nickname: "",
            email: "",
            token: null
        }
    }

    componentDidMount() {
        this.recoverData()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    recoverData = async () => {
        
        await this.getToken()
        const { token } = this.state

        let decodedToken = JWT.decode(token, ENV.JWT_KEY)

        let response = await fetch("https://gathergamers.herokuapp.com/api/user/" + decodedToken.id, {
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": 'application/json'
            },
            method: "GET"
        })
        .catch( error => {return console.log("error", error)})

        const json = await response.json();
        if (json.error) {
            return null
        } else {
            this.setState({ firstname: json.firstname, lastname: json.lastname, email: json.email, nickname: json.nickname })
        }
    }


    render() {
        const { firstname, lastname, nickname, email } = this.state

        return (

            <Content style={Style.content}>
                <Card>
                    <CardItem header bordered>
                        <View style={Style.view}>
                            <Text style={Style.text}>Informations</Text>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <View style={Style.view}>
                                <Text>Nickname :</Text>
                                <Text>{nickname}</Text>
                            </View>
                            <View style={Style.view}>
                                <Text>Firstname :</Text>
                                <Text>{firstname}</Text>
                            </View>
                            <View style={Style.view}>
                                <Text>Lastname :</Text>
                                <Text>{lastname}</Text>
                            </View>
                            <View style={Style.view}>
                                <Text>Email :</Text>
                                <Text>{email}</Text>
                            </View>
                        </Body>
                    </CardItem>
                </Card>
            </Content>

        );
    }
}