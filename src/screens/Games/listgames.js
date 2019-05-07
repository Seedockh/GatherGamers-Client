import React from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { Header, Item, Input, Icon, Text } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';

export default class ListGames extends React.Component {

    static navigationOptions = {
        header: false
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [{
                title: "Apex Legend"
            },
            {
                title: "Sea of Thieves"
            },
            {
                title: "Overwatch"
            },
            {
                title: "Super Smash Bros"
            }]
        }
    }

    onDetails() {
        this.props.navigation.navigate('DetailGames')
    }

    render() {

        const { data } = this.state

        return (

            <>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                    </Item>
                </Header>

                <ScrollView style={{ flex: 1 }}>

                    {data.length > 0 ? (
                        data.map((item, index) => (

                            <TouchableOpacity key={index} activeOpacity={0} onPress={() => this.onDetails()}>
                                <View style={{ borderWidth: 3, borderColor: "#000", marginHorizontal: 24, marginVertical: 16, justifyContent: "center", alignItems: "center" }}>

                                    <View style={{ paddingBottom: 8, justifyContent: "center", alignItems: "center", backgroundColor: "white", marginTop: -12, paddingHorizontal: 8 }}>
                                        <Text style={{ fontWeight: "500" }}>{item.title}</Text>
                                    </View>

                                    <View style={{ padding: 8 }}>
                                        <Image
                                            style={{ width: vmin(20), height: vmin(20) }}
                                            source={require('../../../assets/logo.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                        ))
                    ) : (
                            <Text>Pas de news</Text>
                        )}

                </ScrollView>

            </>
        );
    }
}