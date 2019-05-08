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

                        <View style={{ marginTop: 48, marginBottom: 16 }}>
                            <Image
                                style={{ width: vmin(40), height: vmin(40), borderRadius: 50, alignSelf: "center" }}
                                source={require('../../../assets/rouge.jpg')}
                            />
                        </View>

                        : null}

                    {edit === "fix" ?
                        <>
                            <CardFix />

                            <View style={{ marginHorizontal: 16, flex: 1, justifyContent: "space-around" }}>
                                <Button block dark onPress={() => this.onEdit()} style={{ marginVertical: 8 }}>
                                    <Text>Update Account Informations</Text>
                                </Button>
                                <Button block dark onPress={() => this.onPass()} style={{ marginVertical: 8 }}>
                                    <Text>Update Password</Text>
                                </Button>
                                <Button block dark onPress={() => this.onDelete()} style={{ marginVertical: 8 }}>
                                    <Text>Delete Account</Text>
                                </Button>
                                <Button block dark onPress={this.logout.bind(this)} style={{ marginVertical: 8 }}>
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