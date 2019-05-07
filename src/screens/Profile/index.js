import React from 'react';
import { View, Image, AsyncStorage } from 'react-native';
import { Form, Button, Text } from 'native-base'
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import CardEdit from './cardEdit'
import CardFix from './cardFix'
import Style from '../../styles/profile'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
    }

    onEditFalse() {
        this.setState({ edit: false })
    }

    onEditTrue() {
        this.setState({ edit: true })
    }

    logout = async () => {
        await AsyncStorage.multiRemove(['email', 'password', 'token'], (err) => {
            this.props.navigation.navigate('Login', { connected: false })
        });
    }

    render() {
        const { edit } = this.state

        return (

            <>
                <View style={{ marginTop: 48, marginBottom: 16 }}>
                    <Image
                        style={{ width: vmin(40), height: vmin(40), borderRadius: 50, alignSelf: "center" }}
                        source={require('../../../assets/rouge.jpg')}
                    />
                </View>

                {!edit ?
                    <>
                        <CardFix onEditTrue={this.onEditTrue.bind(this)} />

                        <View style={{ marginHorizontal: 16, flex: 1, justifyContent: "space-around" }}>
                            <Button block dark onPress={() => this.onEditTrue()} >
                                <Text>Update Account Informations</Text>
                            </Button>
                            <Button block dark onPress={() => this.onEditTrue()} >
                                <Text>Update Password</Text>
                            </Button>
                            <Button block dark onPress={this.logout.bind(this)} >
                                <Text>Log Out</Text>
                            </Button>
                        </View>
                    </>
                    :
                    <CardEdit onEditFalse={this.onEditFalse.bind(this)} />
                }

                <FooterTabs {...this.props} />
            </>
        )
    }
}