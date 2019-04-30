import React from 'react';
import { View, Image, KeyboardAvoidingView } from 'react-native';
import { Form, Item, Input, Label, Button, Spinner, Text } from 'native-base'
import Style from '../../styles/login'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    onLoginPress = async () => {
        this.setState({ loading: true })
        this.props.navigation.navigate('Home')
    }

    render() {
        
        const { loading } = this.state

        return (
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
                            <Input />
                        </Item>
                        <Item floatingLabel style={Style.item}>
                            <Label>Mot de Passe</Label>
                            <Input secureTextEntry={true} />
                        </Item>
                    </Form>

                    {!loading ?
                        (
                            <View style={Style.buttonContainer}>
                                <Button title="Connexion" onPress={this.onLoginPress.bind(this)} style={Style.button}>
                                    <Text style={Style.centerText}>Connexion</Text>
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
        )
    }
}