import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import InfoCard from './InfoCard'
import ListCard from './ListCard'

export default class DetailEvents extends React.Component {

    static navigationOptions = {
        headerTitle: "Join Event"
    }

    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    render() {

        return (
            <>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                            source={require('../../../assets/rouge.jpg')}
                        />
                    </View>

                    <InfoCard {...this.props}/>

                    <ListCard {...this.props}/>

                </ScrollView>

                <FooterTabs {...this.props} />
            </>
        )
    }
}