import React from 'react';
import { View } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';

export default class FooterTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button>
                        <Text>Home</Text>
                    </Button>
                    <Button>
                        <Text>Games</Text>
                    </Button>
                    <Button>
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