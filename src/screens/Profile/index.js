import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Button, Text, Switch } from 'native-base'
import { Permissions } from 'expo';
import FooterTabs from '../../components/FooterTabs'
import CardEdit from './cardEdit'
import CardFix from './cardFix'
import CardPass from './cardPass'
import CardDelete from './cardDelete'
import Style from '../../styles/profile'
import Func from '../../functions.js';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: "fix",
            switchValue: false,
        }
    }

    async componentDidMount() {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status==='granted') this.setState({switchValue:true});
      else this.setState({switchValue:false});
    }

    action(calledAction) {
        this.setState({ edit: calledAction })
    }

    onFix() {
        this.setState({ edit: "fix" })
    }

    logout = async () => {
        await Func.rmAsyncStorage()
        this.props.navigation.navigate('Login', { connected: false })
    }

    async switchOptinGeoloc() {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.setState({ switchValue: true })
        Func.toaster("Geolocation activated", "Okay", "success", 3000);
      } else {
        this.setState({ switchValue: false })
        Func.toaster("Geolocation stopped", "Okay", "danger", 3000);
      }
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

                            <View style={Style.switch}>
                                <Text style={{fontWeight: 'bold'}}>Geolocation status</Text>
                                <Switch value={this.state.switchValue} onValueChange={() => this.switchOptinGeoloc()} />
                            </View>

                            <View style={Style.view}>
                                <Button block dark onPress={() => this.action("edit")} style={Style.button}>
                                    <Text>Update Account Informations</Text>
                                </Button>
                                <Button block dark onPress={() => this.action("pass")} style={Style.button}>
                                    <Text>Update Password</Text>
                                </Button>
                                <Button block dark onPress={() => this.action("delete")} style={Style.button}>
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
