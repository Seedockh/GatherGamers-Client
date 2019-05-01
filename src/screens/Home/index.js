import React from 'react';
import { View } from 'react-native';
import Style from '../../styles/home'
import FooterTabs from '../../components/FooterTabs'
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <>
            <View style={Style.container}></View>
            <FooterTabs />
            </>
        );
    }
}