import React from 'react';
import { View, AsyncStorage, TextInput } from 'react-native';
import { Card, CardItem, Body, Text, Button, Toast } from 'native-base';
import Style from '../../styles/cardedit'
import JWT from 'expo-jwt'
import ENV from '../../../env'
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

    onPressEdit() {
        this.updateData()
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
            .catch(error => { return console.log("error", error) })

        const json = await response.json();
        if (json.error) {
            return null
        } else {
            this.setState({ firstname: json.firstname, lastname: json.lastname, email: json.email, nickname: json.nickname })
        }
    }

    toastMessage(message) {
        Toast.show({
            text: `${message}`,
            buttonText: "Okay",
            type: "danger",
            duration: 3000
        })
    }

    updateData = async () => {

        const { nickname, email } = this.state

        if (nickname.length > 5) {
            if (/\S+@\S+\.\S+/.test(email)) {
                const { token } = this.state

                await this.getToken()

                let decodedToken = JWT.decode(token, ENV.JWT_KEY)

                let response = await fetch("https://gathergamers.herokuapp.com/api/user/update/" + decodedToken.id, {
                    headers: {
                        "Authorization": 'Bearer ' + token,
                        "Content-Type": 'application/json'
                    },
                    method: "PUT",
                    body: JSON.stringify({
                        email: this.state.email,
                        nickname: this.state.nickname,
                        lastname: this.state.lastname,
                        firstname: this.state.firstname,
                        email: this.state.email,
                        token: token,
                    })
                })
                    .catch(error => { return console.log("error", error) })
                    this.props.onFix()
            } else {
                this.toastMessage("Wrong Email !")
            }
        } else {
            this.toastMessage("Wrong Nickname !")
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
                                    <TextInput value={email} onChangeText={(email) => this.setState({ email })} style={Style.lastinput} />
                                </View>

                            </Body>
                        </CardItem>
                    </Card>
                </View>

                <View style={Style.viewbutton}>
                    <Button block dark onPress={() => this.onPressEdit()} style={Style.button} >
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