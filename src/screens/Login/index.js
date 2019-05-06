import React from 'react';
import { View, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base'
import Style from '../../styles/login'
import ENV from '../../../env.js'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "sevenchars@gmail.com",
            password: "sevenchars"
        }
    }

    onLoginPress = async () => {
        const { email, password } = this.state
        this.setState({ loading: true })
        const url = ENV.NODE_ENV == "dev" ? ENV.LOCAL_API_URL_LOGIN : ENV.HEROKU_API_URL_LOGIN
        if(email != "" && password != "") {
                return await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                    })
                }
                )
                .then(async (response) => {
                    alert(response.status)
                    if(response.status == 400) {
                        alert("message erreur kom dab")
                        return { error: "message erreur kom dab" }
                    } else {
                        let responseJSON = await response.json()
                        alert(responseJSON.meta.token) // Must be a persisting data ** TODO
                    }
                })
        } else {
            this.loginError()
        }
    }

    loginError() {
        alert("Nickname and password are not matching!")
        this.setState({ loading: false }) 
    }

    onRegisterPress = async () => {
        this.props.navigation.navigate('Register')
    }

    render() {

        const { loading } = this.state

        return (
            <>
                <KeyboardAvoidingView behavior="padding" style={Style.keyboardAvoiding} enabled>
                    <View style={Style.mainContainer}>
                        <View style={Style.logoContainer}>
                            <Image
                                style={Style.logo}
                                source={require('../../../assets/logo.png')}
                            />
                        </View>
                        <Form>
                            <Item floatingLabel style={Style.item}>
                                <Label>Email</Label>
                                <Input onChangeText={(email) => this.setState({email})}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                            </Item>
                        </Form>

                        {!loading ?
                            (
                                <View style={Style.buttonContainer}>
                                    <Button title="Connexion" onPress={this.onLoginPress.bind(this)} style={Style.button}>
                                        <Text style={Style.connectText}>Sign In</Text>
                                    </Button>
                                </View>
                            ) : (
                                <View style={Style.buttonContainer}>
                                    <Button style={Style.button}>
                                        <Spinner color='white' size="small" />
                                    </Button>
                                </View>)
                        }

                    </View>
                </KeyboardAvoidingView>

                <View style={Style.formContainer}>
                    <TouchableOpacity onPress={this.onRegisterPress.bind(this)} style={Style.touchableOpacity}>
                        <Text style={Style.formText} >Create an account here</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Style.touchableOpacity}>
                        <Text style={Style.formText} >Forgot password ?</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}