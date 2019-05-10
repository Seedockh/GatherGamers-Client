import React from 'react';
import { View, AsyncStorage, TextInput } from 'react-native';
import { Card, CardItem, Body, Text, Button, Toast } from 'native-base';
import Style from '../../styles/cardpass'
import JWT from 'expo-jwt'
import ENV from '../../../env'

export default class CardPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "12345678910",
            password: "12345678",
            password_confirmation: "12345678",
            token: null,
        }
    }

    onPressSave() {
        this.updateData()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
        console.log("state", this.state.token)
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

        const { password, password_confirmation, token } = this.state

        await this.getToken()

        if (password.length > 7) {
            if (password == password_confirmation) {
                
                let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

                let response = await fetch("https://gathergamers.herokuapp.com/api/user/updatepassword/" + decodedToken.id, {
                    headers: {
                        "Authorization": 'Bearer ' + this.state.token,
                        "Content-Type": 'application/json'
                    },
                    method: "PUT",
                    body: JSON.stringify({
                        oldpass: this.state.old_password,
                        password: this.state.password,
                        password_confirmation: this.state.password_confirmation,
                        token: this.state.token,
                    })
                })
                    .catch(error => { return console.log("error", error) })
                console.log(response)
                this.props.onFix()
            } else {
                this.toastMessage("New password and confirmed password are not the same !")
            }
        } else {
            this.toastMessage("Your password must contain at least 8 characters !")
        }

    }

    render() {

        return (

            <>
                <View style={Style.content}>
                    <Card>
                        <CardItem header bordered>
                            <View style={Style.viewheader}>
                                <Text style={Style.text}>Password Update</Text>
                            </View>

                        </CardItem>
                        <CardItem bordered>
                            <Body>

                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(old_password) => this.setState({ old_password })} placeholder="Current Password" style={Style.textinput} />
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({ password })} placeholder="New Password" style={Style.textinput} />
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password_confirmation) => this.setState({ password_confirmation })} placeholder="Confirm Password" style={Style.textinput} />
                                </View>

                            </Body>
                        </CardItem>
                    </Card>
                </View>

                <View style={Style.viewbutton}>
                    <Button block dark onPress={() => this.onPressSave()} style={Style.button}>
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