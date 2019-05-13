import React from 'react';
import { View, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base'
import Style from '../../styles/login'
import ENV from '../../../env.js'
import Func from '../../functions.js';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            token: "",
        };
        this.baseState = this.state;
    }

    componentDidMount = async () => {
        await this.clearState()
        await this.restoreData()
    }

    clearState() {
        this.setState(this.baseState)
    }

    storeData = async (email, password, token) => {
        await Func.setAsyncStorage(email, password, token)
    }

    restoreData = async () => {
        let response = await Func.getAsyncStorage()
        if (response.token !== null && response.password !== null && response.email !== null) {
            await this.setState({
                email: response.email,
                password: response.password,
                token: response.token
            });
            this.login()
        }
    }

    login = async () => {
        const { email, password } = this.state
        const url = ENV.NODE_ENV == "dev" ? ENV.LOCAL_API_URL_LOGIN : ENV.HEROKU_API_URL_LOGIN
        const body = JSON.stringify({email, password})
        if(email != "" && password != "") {
            this.setState({ loading: true })
            const response = await Func.fetch(url, "POST", body);
            if(response.status == 400) {
                this.setState({ loading: false })
                Func.toaster("Wrong email or password!", "Okay", "danger", 3000);
            } else {
                const responseJSON = await response.json()
                await this.storeData(email, password, responseJSON.meta.token)
                this.clearState()
                this.props.navigation.navigate('Home')
            }
        } else {
            this.setState({ loading: false });
            Func.toaster("Nickname and password can't be empty!", "Okay", "danger", 3000);
        }
    }

    register = async () => {
        this.props.navigation.navigate('Register')
    }

    render() {
        const { loading } = this.state
        return (
            <>
                <KeyboardAvoidingView behavior="padding" style={Style.keyboardAvoiding} enabled>
                    <View style={Style.mainContainer}>
                        <View style={Style.logoContainer}>
                            <Image style={Style.logo} source={require('../../../assets/logo.png')}/>
                        </View>
                        {!loading ?
                            (
                                <>
                                <Form>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Email</Label>
                                    <Input onChangeText={(email) => this.setState({email})} autoCapitalize = 'none'/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Password</Label>
                                    <Input secureTextEntry={true} onChangeText={(password) => this.setState({password})} autoCapitalize = 'none'/>
                                </Item>
                                </Form>
                                <View style={Style.buttonContainer}>
                                    <Button title="Connexion" onPress={this.login.bind(this)} style={Style.button}>
                                        <Text style={Style.connectText}>Sign In</Text>
                                    </Button>
                                </View>
                                </>
                            ) : (
                                <View style={Style.buttonContainer}>
                                    <Button style={Style.button}>
                                        <Spinner color='white' size="small"/>
                                    </Button>
                                </View>
                            )
                        }
                    </View>
                </KeyboardAvoidingView>
                <View style={Style.formContainer}>
                    <TouchableOpacity onPress={this.register.bind(this)} style={Style.touchableOpacity}>
                        <Text style={Style.formText}>Create an account here</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Style.touchableOpacity}>
                        <Text style={Style.formText}>Forgot password ?</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}
