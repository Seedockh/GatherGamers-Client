import React from 'react';
import { View, ScrollView, AsyncStorage, TextInput, ActivityIndicator } from 'react-native';
import { Card, CardItem, Body, Text, Button, Toast } from 'native-base';
import Style from '../../styles/cardpass'
import JWT from 'expo-jwt'
import ENV from '../../../env'
import Func from '../../functions.js';

export default class CardPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            password: "",
            password_confirmation: "",
            token: null,
            updateDone: true,
        }
    }

    pushNotif = async (message, type) => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = "https://gathergamers.herokuapp.com/api/notification/add"
        const body = JSON.stringify({
            UserId: decodedToken.id,
            message: message,
            type: type
        })
        const auth = `Bearer ${token}`
        await Func.fetch(url, "POST", body, auth)
    }

    updateData = async () => {
        this.setState({ updateDone: false })
        const { password, password_confirmation, old_password } = this.state
        const token = await Func.getToken()
        this.setState({ token })
        if (password.length > 7) {
            if (password == password_confirmation) {
                const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
                const url = `https://gathergamers.herokuapp.com/api/user/updatepassword/${decodedToken.id}`
                const body = JSON.stringify({
                    old_password: this.state.old_password,
                    password: this.state.password,
                    password_confirmation: this.state.password_confirmation,
                    token: this.state.token,
                })
                const auth = `Bearer ${token}`
                const response = await Func.fetch(url, 'PUT', body, auth)
                if (response.status !== 200) {
                    Func.toaster("Error updating your password", "Okay", "danger", 3000);
                    this.setState({ updateDone: true })
                } else {
                    this.setState({ updateDone: true })
                    this.pushNotif("You have updated your password", 1)
                    this.props.onFix()
                    let responseJSON = await response.json()
                    Func.toaster("Password updated successfully", "Okay", "success", 3000);
                }
            } else {
                Func.toaster("New password and confirm password are not the same!", "Okay", "danger", 3000);
                this.setState({ updateDone: true })
            }
        } else {
            Func.toaster("Your password must contain at least 8 characters!", "Okay", "danger", 3000);
            this.setState({ updateDone: true })
        }
    }

    render() {
        const { updateDone } = this.state;
        return (
            <>
                <ScrollView style={Style.content}>
                    <Card>
                        <CardItem header bordered>
                            <View style={Style.viewheader}>
                                <Text style={Style.text}>Password Update</Text>
                            </View>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                              {!updateDone && (
                                  <View style={{ flex: 1, marginHorizontal: 180 }}>
                                      <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#000000"/>
                                  </View>
                              )}
                              {updateDone && (
                                <>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(old_password) => this.setState({ old_password })} placeholder="Current Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({ password })} placeholder="New Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                                <View style={Style.view}>
                                    <TextInput secureTextEntry={true} onChangeText={(password_confirmation) => this.setState({ password_confirmation })} placeholder="Confirm Password" style={Style.textinput} autoCapitalize = 'none'/>
                                </View>
                                </>
                              )}
                            </Body>
                        </CardItem>
                    </Card>
                </ScrollView>
                <View style={Style.viewbutton}>
                  {updateDone && (
                  <>
                    <Button block dark onPress={() => this.updateData()} style={Style.button}>
                        <Text>Save</Text>
                    </Button>
                    <Button block dark onPress={() => this.props.onFix()} style={Style.button}>
                        <Text>Cancel</Text>
                    </Button>
                  </>
                  )}
                </View>
            </>
        );
    }
}
