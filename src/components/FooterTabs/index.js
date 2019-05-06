import React from 'react';
import { View } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';

export default class FooterTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onProfilePress =  () => {
        this.props.navigation.navigate('Profile')
    }

    onGamesPress =  () => {
        this.props.navigation.navigate('Games')
    }

    onHomePress =  () => {
        this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button onPress={this.onHomePress.bind(this)}>
                        <Text>Home</Text>
                    </Button>
                    <Button onPress={this.onGamesPress.bind(this)}>
                        <Text>Games</Text>
                    </Button>
                    <Button onPress={this.onProfilePress.bind(this)}>
                        <Text>Profile</Text>
                    </Button>
                    <Button>
                        <Text>Messenger</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}