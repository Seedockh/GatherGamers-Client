import React from 'react';
import { View, Image, AsyncStorage, ScrollView } from 'react-native';
import { Button, Text } from 'native-base'
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import CardEdit from './cardEdit'
import CardFix from './cardFix'
import CardPass from './cardPass'
import CardDelete from './cardDelete'
import Style from '../../styles/profile'


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: "fix"
        }
    }

    onFix() {
        this.setState({ edit: "fix" })
    }

    onEdit() {
        this.setState({ edit: "edit" })
    }

    onPass() {
        this.setState({ edit: "pass" })
    }

    onDelete() {
        this.setState({ edit: "delete" })
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
                <ScrollView>
                    {edit != "delete" ?

                        <View style={Style.viewimage}>
                            <Image
                                style={Style.image}
                                source={require('../../../assets/picture.png')}
                            />
                        </View>

                        : null}

                    {edit === "fix" ?
                        <>
                            <CardFix />

                            <View style={Style.view}>
                                <Button block dark onPress={() => this.onEdit()} style={Style.button}>
                                    <Text>Update Account Informations</Text>
                                </Button>
                                <Button block dark onPress={() => this.onPass()} style={Style.button}>
                                    <Text>Update Password</Text>
                                </Button>
                                <Button block dark onPress={() => this.onDelete()} style={Style.button}>
                                    <Text>Delete Account</Text>
                                </Button>
                                <Button block dark onPress={this.logout.bind(this)} style={Style.button}>
                                    <Text>Log Out</Text>
                                </Button>
                            </View>
                        </>
                        : null}

                    {edit === "edit" ?
                        <CardEdit onFix={this.onFix.bind(this)} />
                        : null}

                    {edit === "pass" ?
                        <CardPass onFix={this.onFix.bind(this)} />
                        : null}

                    {edit === "delete" ?
                        <CardDelete onLogOut={this.logout.bind(this)} onFix={this.onFix.bind(this)} />
                        : null}
                </ScrollView>
                <FooterTabs {...this.props} />
            </>
        )
    }
}