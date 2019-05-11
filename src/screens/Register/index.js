import React from 'react';
import { View, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base';
import Style from '../../styles/register';
import ENV from '../../../env.js';
import Func from '../../functions.js';

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
            password_confirmation: ""
        }
    }

    Register = async () => {
        const { firstname, lastname, nickname, email, password, password_confirmation } = this.state;
        if (firstname != "" && lastname != "" && nickname != "" && email != "" && password != "" && password_confirmation != "") {
            if (password == password_confirmation) {
                if (nickname != password) {
                    if (nickname.length > 5 && password.length > 7) {
                        // TODO:
                        // Server verification is different and failed with j@j.j
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
                            if (response.status >= 200 && response.status < 300) {
                                this.setState({ loading: false });
                                this.props.navigation.navigate('Login');
                                Func.toaster("Account successfully created!", "Okay", "success", 3000);
                            } else {
                                Func.toaster("Something went wrong :(", "Okay", "danger", 3000);
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
                            <Image style={Style.logo} source={require('../../../assets/logo.png')}/>
                        </View>
                        <Form>
                            <Item floatingLabel style={Style.item}>
                                <Label>Firstname</Label>
                                <Input onChangeText={(firstname) => this.setState({ firstname })}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Lastname</Label>
                                <Input onChangeText={(lastname) => this.setState({ lastname })}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Nickname</Label>
                                <Input onChangeText={(nickname) => this.setState({ nickname })}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Email</Label>
                                <Input onChangeText={(email) => this.setState({ email })}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password) => this.setState({ password })}/>
                            </Item>
                            <Item floatingLabel style={Style.item}>
                                <Label>Confirm Password</Label>
                                <Input secureTextEntry={true} onChangeText={(password_confirmation) => this.setState({ password_confirmation })}/>
                            </Item>
                        </Form>
                    {!loading ?
                        (
                            <View style={Style.buttonContainer}>
                                <Button title="Connexion" onPress={this.Register.bind(this)} style={Style.button}>
                                    <Text style={Style.registerText}>Register</Text>
                                </Button>
                            </View>
                        ) : (
                            <View style={Style.buttonContainer}>
                                <Button style={Style.button}>
                                    <Spinner color='white' size="small"/>
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
