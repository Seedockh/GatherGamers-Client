import React from 'react';
import { View, Image, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base';
import Style from '../../styles/register';
import ENV from '../../../env.js';
import Func from '../../functions.js';


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            loading: false,
            firstname: "",
            lastname: "",
            nickname: "",
            email: "",
            password: "",
            password_confirmation: ""
        }
    }

    checkEmail = async () => {
        const { email } = this.state
        var emails = ['adrien.masson22@gmail.com',
            'antoine.nivoy@gmail.com',
            'maxime.gouenard@gmail.com',
            'pierre.herisse@gmail.com']
        emails.map(e => {
            if (email == e) { this.setState({ check: true }) }
        })
    }

    sendEmail = async () => {
        const { email } = this.state
        const url = 'https://gathergamers.herokuapp.com/api/mailgun/register'
        const body = JSON.stringify({
            useremail: email
        })
        const response = await Func.fetch(url, "POST", body);
    }

    login = async () => {
        this.props.navigation.navigate('Login')
    }

    Register = async () => {
        const { firstname, lastname, nickname, email, password, password_confirmation } = this.state;
        if (firstname != "" && lastname != "" && nickname != "" && email != "" && password != "" && password_confirmation != "") {
            if (password == password_confirmation) {
                if (nickname != password) {
                    if (nickname.length > 5 && password.length > 7) {
                        // TODO:
                        // Server verification is different and failed with j@j.j
                        await this.checkEmail(email)
                        if (/\S+@\S+\.\S+/.test(email)) {
                            const url = ENV.NODE_ENV == "dev" ? ENV.LOCAL_API_URL_REGISTER : ENV.HEROKU_API_URL_REGISTER;
                            const body = JSON.stringify({
                                firstname,
                                lastname,
                                nickname,
                                email,
                                password,
                                password_confirmation
                            });
                            this.setState({ loading: true });
                            const response = await Func.fetch(url, "POST", body);
                            this.setState({ loading: false });
                            this.props.navigation.navigate('Login');
                            Func.toaster("Account successfully created ! And You have received an email", "Okay", "success", 3000);
                            if (response.status >= 200 && response.status < 300 && this.state.check == true) {
                                await this.sendEmail(email)
                            } else {
                                Func.toaster("Not an admin account, no mail sent.", "Okay", "danger", 3000);
                            }
                            this.setState({ loading: false });
                        } else {
                            Func.toaster("Email is not valid!", "Okay", "danger", 3000);
                        }
                    } else {
                        Func.toaster("Nickname size must be greater than 5 and Password than 7!", "Okay", "danger", 3000);
                    }
                } else {
                    Func.toaster("Nickname and Password must be different!", "Okay", "danger", 3000);
                }
            } else {
                Func.toaster("Password must be equals!", "Okay", "danger", 3000);
            }
        } else {
            Func.toaster("You must fill all inputs!", "Okay", "danger", 3000);
        }
    }

    render() {
        const { loading } = this.state
        return (
            <KeyboardAvoidingView behavior="padding" style={Style.keyboardAvoiding} enabled>
                <ScrollView>
                    <View style={Style.mainContainer}>
                        <View style={Style.logoContainer}>
                            <Image style={Style.logo} source={require('../../../assets/gg-icon.png')} />
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
                                <Label>Nickname</Label>
                                <Input onChangeText={(nickname) => this.setState({ nickname })} />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Email</Label>
                                <Input onChangeText={(email) => this.setState({ email })} autoCapitalize='none' />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password) => this.setState({ password })} autoCapitalize='none' />
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Confirm Password</Label>
                                <Input secureTextEntry={true}
                                    onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
                                    autoCapitalize='none' />
                            </Item>
                        </Form>
                        {!loading ?
                            (
                                <View style={Style.buttonContainer}>
                                    <Button title="Connexion" onPress={this.Register.bind(this)} style={Style.button}>
                                        <Text style={Style.registerText}>Register</Text>
                                    </Button>
                                    <TouchableOpacity onPress={this.login.bind(this)} style={Style.touchableOpacity}>
                                        <Text style={Style.formText}>Already have an account ?</Text>
                                    </TouchableOpacity>
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
