import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'native-base';
import FooterTabs from '../../components/FooterTabs'
import Style from '../../styles/friends'
export default class Friends extends React.Component {

    static navigationOptions = {
        headerTitle: "Friends"
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    save() {
        this.props.onEditTrue()
    }

    render() {
        return (
            <>
                <View style={Style.container}>
                    <Text>Do you want to add {this.props.navigation.state.params.gamer.nickname} as a friend?</Text>
                    <Button block success style={Style.buttonadd}>
                        <Text>Add</Text>
                    </Button>
                </View>
                <FooterTabs {...this.props} />
            </>
        );
    }
}