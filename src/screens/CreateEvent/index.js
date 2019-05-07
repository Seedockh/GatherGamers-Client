import React from 'react';
import { View, Image, TextInput } from 'react-native';
import { Item, Input, Label, Text, Button } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'

export default class CreateEvent extends React.Component {

    static navigationOptions = {
        headerTitle: "Create Event"
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        alert(JSON.stringify(this.props))
        return (
            <>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                            source={require('../../../assets/rouge.jpg')}
                        />
                    </View>

                    <View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4 }}>
                            <Item regular >
                                <Label>Event Name</Label>
                                <Input />
                            </Item>
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Event Type :</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Number of players :</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Date :</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Cash Price :</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4 }}>
                            <Text>Adresse</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4 }}>
                            <Button block success>
                                <Text>Create Event</Text>
                            </Button>
                        </View>
                    </View>
                </View>

                <FooterTabs {...this.props} />
            </>
        )
    }
}