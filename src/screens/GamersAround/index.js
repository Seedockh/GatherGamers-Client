import React from 'react';
import { View, Image } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Thumbnail, Left, Body, Right, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'

export default class GamersAround extends React.Component {

    static navigationOptions = {
        headerTitle: "Gamers Around"
    }

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
            <>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                            source={require('../../../assets/rouge.jpg')}
                        />
                    </View>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" />
                        </Item>
                    </Header>

                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <List key={index} >
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
                            <Text>Pas d'events</Text>
                        )}

                </View>

                <FooterTabs {...this.props} />
            </>
        )
    }
}