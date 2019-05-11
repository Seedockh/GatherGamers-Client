import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import JWT from 'expo-jwt'
import Style from '../../styles/carddelete'
import ENV from '../../../env'
import Func from '../../functions.js';

export default class CardDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    deleteData = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/user/delete/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const body = JSON.stringify({token: this.state.token})
        await Func.fetch(url, "DELETE", body, auth)
        this.props.onLogOut()
    }

    render() {
        return (
            <View style={Style.content}>
                <Text style={Style.text}>Are you sure you want to delete your account?</Text>
                <Button block danger onPress={() => this.deleteData()} style={Style.button}>
                    <Text>Delete Account</Text>
                </Button>
                <Button block dark onPress={() => this.props.onFix()} style={Style.button}>
                        <Text>Cancel</Text>
                </Button>
            </View>
        )
    }
}