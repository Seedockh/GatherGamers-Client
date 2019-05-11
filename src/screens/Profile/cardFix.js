import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text } from 'native-base';
import JWT from 'expo-jwt'
import Style from '../../styles/cardfix'
import ENV from '../../../env'
import Func from '../../functions.js';

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

    recoverData = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/user/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
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