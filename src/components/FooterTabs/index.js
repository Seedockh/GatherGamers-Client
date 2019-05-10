import React from 'react';
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
            <Footer >
                <FooterTab style={{ backgroundColor: "black"}}>
                    <Button onPress={this.onHomePress.bind(this)}>
                        <Text style={{color:"white"}}>Home</Text>
                    </Button>
                    <Button onPress={this.onGamesPress.bind(this)}>
                        <Text style={{color:"white"}}>Games</Text>
                    </Button>
                    <Button onPress={this.onProfilePress.bind(this)}>
                        <Text style={{color:"white"}}>Profile</Text>
                    </Button>
                    <Button>
                        <Text style={{color:"white"}}>Chat</Text>
                    </Button>
                </FooterTab>
            </Footer>
        )
    }
}