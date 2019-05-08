import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button, Text } from 'native-base';
import JWT from 'expo-jwt'
import Style from '../../styles/profile'
import ENV from '../../../env'

export default class CardDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    deleteData = async () => {
        
        await this.getToken()

        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)
        console.log(decodedToken)

        let response = await fetch("https://gathergamers.herokuapp.com/api/user/delete/" + decodedToken.id, {
            headers: {
                "Authorization": 'Bearer ' + this.state.token,
                "Content-Type": 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({
                token: this.state.token,
            })
        })
        .catch( error => {return console.log("error", error)})
        console.log("response", response)
        this.props.onLogOut()
    }


    render() {

        return (

            <View style={{ marginHorizontal: 16, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ marginVertical: 16, marginTop: "90%" }}>Are you sure you want to delete your account?</Text>
                <Button block danger onPress={() => this.deleteData()} style={{ marginVertical: 8 }}>
                    <Text>Delete Account</Text>
                </Button>
                <Button block dark onPress={() => this.props.onFix()} style={{ marginVertical: 8 }}>
                        <Text>Cancel</Text>
                </Button>
            </View>

        )
    }
}