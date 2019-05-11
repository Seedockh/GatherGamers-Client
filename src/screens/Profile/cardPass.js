import React from 'react';
import { View, AsyncStorage, TextInput } from 'react-native';
import { Card, CardItem, Body, Text, Button, Toast } from 'native-base';
import Style from '../../styles/cardpass'
import JWT from 'expo-jwt'
import ENV from '../../../env'
import Func from '../../functions.js';

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

    updateData = async () => {
        const { password, password_confirmation } = this.state
        const token = await Func.getToken()
        this.setState({ token })
        if (password.length > 7) {
            if (password == password_confirmation) {  
                const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY) 
                const url = `https://gathergamers.herokuapp.com/api/user/updatepassword/${decodedToken.id}`
                const body = JSON.stringify({
                    oldpass: this.state.old_password,
                    password: this.state.password,
                    password_confirmation: this.state.password_confirmation,
                    token: this.state.token,
                })
                const auth = `Bearer ${token}`
                await Func.fetch(url, 'PUT', body, auth)
                this.props.onFix()
            } else {
                Func.toaster("New password and confirm password are not the same!", "Okay", "danger", 3000);
            }
        } else {
            Func.toaster("Your password must contain at least 8 characters!", "Okay", "danger", 3000);
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
                                    <TextInput secureTextEntry={true} onChangeText={(old_password) => this.setState({ old_password })} placeholder="Current Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({ password })} placeholder="New Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password_confirmation) => this.setState({ password_confirmation })} placeholder="Confirm Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
                <View style={Style.viewbutton}>
                    <Button block dark onPress={() => this.updateData()} style={Style.button}>
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