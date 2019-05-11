import React from 'react';
import { View, TextInput } from 'react-native';
import { Card, CardItem, Body, Text, Button } from 'native-base';
import Style from '../../styles/cardedit'
import JWT from 'expo-jwt'
import ENV from '../../../env'
import Func from '../../functions.js';

export default class CardEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            nickname: "",
            email: "",
            token: null,
        }
    }

    componentDidMount() {
        this.recoverData()
    }

    edit() {
        this.updateData()
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

    updateData = async () => {
        const { nickname, email } = this.state
        if (nickname.length > 5) {
            if (/\S+@\S+\.\S+/.test(email)) {
                const token = await Func.getToken()
                this.setState({ token })
                const decodedToken = await JWT.decode(token, ENV.JWT_KEY)
                const url = `https://gathergamers.herokuapp.com/api/user/update/${decodedToken.id}`
                const body = JSON.stringify({
                    email: this.state.email,
                    nickname: this.state.nickname,
                    lastname: this.state.lastname,
                    firstname: this.state.firstname,
                    email: this.state.email,
                    token: token,
                })
                const auth = `Bearer ${token}`
                await Func.fetch(url, "PUT", body, auth)
                this.props.onFix()
            } else {
                Func.toaster("Wrong Email!", "Okay", "danger", 3000);
            }
        } else {
            Func.toaster("Wrong Nickname!", "Okay", "danger", 3000);
        }
    }

    render() {
        const { firstname, lastname, email, nickname } = this.state
        return (
            <>
                <View style={Style.content}>
                    <Card>
                        <CardItem header bordered>
                            <View style={Style.headerview}>
                                <Text style={Style.text}>Informations</Text>
                            </View>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style={Style.view}>
                                    <Text>Nickname :</Text>
                                    <TextInput value={nickname} onChangeText={(nickname) => this.setState({ nickname })} style={Style.textinput} />
                                </View>
                                <View style={Style.view}>
                                    <Text>Firstname :</Text>
                                    <TextInput value={firstname} onChangeText={(firstname) => this.setState({ firstname })} style={Style.textinput} />
                                </View>
                                <View style={Style.view}>
                                    <Text>Lastname :</Text>
                                    <TextInput value={lastname} onChangeText={(lastname) => this.setState({ lastname })} style={Style.textinput} />
                                </View>
                                <View style={Style.view}>
                                    <Text>Email :</Text>
                                    <TextInput value={email} onChangeText={(email) => this.setState({ email })} style={Style.lastinput} autoCapitalize = 'none'/>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
                <View style={Style.viewbutton}>
                    <Button block dark onPress={() => this.edit()} style={Style.button} >
                        <Text>Save</Text>
                    </Button>
                    <Button block dark onPress={() => this.props.onFix()} style={Style.button}>
                        <Text>Cancel</Text>
                    </Button>
                </View>
            </>
        );
    }
}