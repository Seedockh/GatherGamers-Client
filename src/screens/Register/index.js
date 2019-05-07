import React from 'react';
import { View, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base'
import Style from '../../styles/register'
import ENV from '../../../env.js'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            firstname: "",
            lastname: "",
            nickname: "",
            email: "",
            password: "",
            password_confirmation: "",
        }
    }

    onLoginPress = async () => {
        const { firstname, lastname, nickname, email, password, password_confirmation } = this.state
        if (firstname != "" && lastname != "" && nickname != "" && email != "" && password != "" && password_confirmation != "") {
            if (password == password_confirmation) {
                if (nickname != password) {
                    if (nickname.length > 5 && password.length > 7) {
                        if (/\S+@\S+\.\S+/.test(email)) {
                            this.setState({ loading: true })
                            const url = ENV.NODE_ENV == "dev" ? ENV.LOCAL_API_URL_REGISTER : ENV.HEROKU_API_URL_REGISTER
                            try {
                                let response = await fetch(
                                    url,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            firstname: this.state.firstname,
                                            lastname: this.state.lastname,
                                            nickname: this.state.nickname,
                                            email: this.state.email,
                                            password: this.state.password,
                                            password_confirmation: this.state.password_confirmation
                                        })
                                    }
                                );
                                if (response.status >= 200 && response.status < 300) {
                                    this.setState({ loading: false })
                                    this.props.navigation.navigate('Login')
                                    alert("Account successfully created!")
                                } else {
                                    alert(JSON.stringify(response))
                                }
                            } catch (errors) {
                                alert(errors);
                            }
                        } else {
                            alert("Email is not valid!")
                        }
                    } else {
                        alert("Nickname size must be greater than 5 and Password than 7!")
                    }
                } else {
                    alert("Nickname and Password must be different!")
                }
            } else {
                alert("Password must be equals!")
            }
        } else {
            alert("You must fill all inputs!")
        }
    }

    render() {
        const { loading } = this.state

        return (

            <KeyboardAvoidingView behavior="padding" style={Style.keyboardAvoiding} enabled>
                <ScrollView>
                    <View style={Style.mainContainer}>
                        <View style={Style.logoContainer}>
                            <Image
                                style={Style.logo}
                                source={require('../../../assets/logo.png')}
                            />
                        </View>
                        <Form>
                            <Item floatingLabel style={Style.item}>
                                <Label>Firstname</Label>
                                <Input onChangeText={(firstname) => this.setState({ firstname })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Lastname</Label>
                                <Input onChangeText={(lastname) => this.setState({ lastname })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Pseudo</Label>
                                <Input onChangeText={(nickname) => this.setState({ nickname })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Email</Label>
                                <Input onChangeText={(email) => this.setState({ email })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password) => this.setState({ password })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Confirm Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password_confirmation) => this.setState({ password_confirmation })} />
                            </Item>
                        </Form>


                    {!loading ?
                        (
                            <View style={Style.buttonContainer}>
                                <Button title="Connexion" onPress={this.onLoginPress.bind(this)} style={Style.button}>
                                    <Text style={Style.disconnectText}>Register</Text>
                                </Button>
                            </View>
                        ) : (
                            <View style={Style.buttonContainer}>
                                <Button style={Style.button}>
                                    <Spinner color='white' size="small" />
                                </Button>
                            </View>
                        )
                    }

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
