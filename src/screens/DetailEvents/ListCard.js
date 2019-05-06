import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, List, ListItem, Left, Thumbnail } from 'native-base';

export default class InfoCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [{
                title: "Jean Michmich",
                text1: "Paris",
                text2: "Sekiro"
            },
            {
                title: "Jean Michmich",
                text1: "Paris",
                text2: "Sekiro, Apex"
            },
            {
                title: "Prout",
                text1: "Dans ton cul",
                text2: "Sent pas bon"
            },
            {
                title: "Jean Michmich",
                text1: "Paris",
                text2: "Sekiro"
            }]
        }
    }

    render() {

        const { data } = this.state

        return (

            <View style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Amis</Text>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Content>

                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <List key={index}>
                                        <ListItem thumbnail>
                                            <Left>
                                                <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                                            </Left>
                                            <Body>
                                                <Text>{item.title}</Text>
                                                <Text note numberOfLines={1}>{item.text1}</Text>
                                                <Text note numberOfLines={1}>{item.text2}</Text>
                                            </Body>
                                        </ListItem>
                                    </List>
                                ))
                            ) : (
                                    <Text>Pas d'amis</Text>
                                )}
                        </Content>
                    </CardItem>
                </Card>
            </View>
        )
    }
}