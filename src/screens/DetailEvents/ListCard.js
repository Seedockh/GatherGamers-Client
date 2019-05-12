import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Content, Card, CardItem, Body, Text, List, ListItem } from 'native-base';
import Func from '../../functions.js';
import Style from '../../styles/listcard'
export default class ListCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participantsCount: 0,
            token: "",
        }
    }

    renderItem(item, index) {
        return (
            <List key={index}>
                <ListItem>
                    <Body>
                        <Text>{item.nickname}</Text>
                    </Body>
                </ListItem>
            </List>)
    }

    render() {
        const participants = this.props.participants;
        return (
            <>
                {!this.props.fetchDone && (
                    <View style={Style.activityview}>
                        <ActivityIndicator style={Style.activity} size="large" color="#000000" />
                    </View>
                )}
                {this.props.fetchDone && (
                    <View style={Style.container}>
                        <Card>
                            <CardItem header bordered>
                                <View style={Style.view}>
                                    <Text style={Style.text}>Participants</Text>
                                </View>
                            </CardItem>
                            <CardItem bordered>
                                <Content>
                                    {participants.length > 0 ? participants.map((item, index) => this.renderItem(item, index)) : null}
                                </Content>
                            </CardItem>
                        </Card>
                    </View>
                )}
            </>
        )
    }
}
