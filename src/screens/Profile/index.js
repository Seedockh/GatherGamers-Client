import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base'
import Style from '../../styles/profile'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <Text>Profile</Text>
        );
    }
}