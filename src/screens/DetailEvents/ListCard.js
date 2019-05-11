import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Content, Card, CardItem, Body, Text, List, ListItem, Left, Thumbnail } from 'native-base';
import Func from '../../functions.js';

export default class ListCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participantsCount: 0,
            token: "",
        }
    }

    renderItem(item, index) {
        return(
        <List key={index}>
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                </Left>
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
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
              </View>
            )}
            {this.props.fetchDone && (
            <View style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Participants</Text>
                        </View>
                    </CardItem>
                      <CardItem bordered>
                          <Content>
                              {participants.length>0 ? participants.map((item, index) => this.renderItem(item, index)) : null}
                          </Content>
                      </CardItem>
                </Card>
            </View>
            )}
          </>
        )
    }
}
