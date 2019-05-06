import React from 'react';
import { View, Image, KeyboardAvoidingView, TouchableOpacity, AsyncStorage } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base'
import Style from '../../styles/login'
import ENV from '../../../env.js'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            token: ""
        }
        this.restoreData()
    }

    storeData = async (email, password, token) => {
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
            await AsyncStorage.setItem('token', token);
            this.setState({
                email: email,
                password: password,
                token: token
            });
        } catch (error) {
            throw error
        }
    }
    
    restoreData = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            const token = await AsyncStorage.getItem('token');
            if (token !== null && password != "" && email != "") {
                await this.setState({
                    email: email,
                    password: password,
                    token: token 
                });
                this.login()
            }
        } catch (error) {
            throw error
        }
    }

    login = async () => {
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
                    if(response.status == 400) {
                        const errMessage = "Wrong password or email"
                        this.setState({ loading: false })
                        alert(errMessage)
                    } else {
                        let responseJSON = await response.json()
                        this.storeData(email, password, responseJSON.meta.token)
                        this.props.navigation.navigate('Home')
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
                                    <Button title="Connexion" onPress={this.login.bind(this)} style={Style.button}>
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