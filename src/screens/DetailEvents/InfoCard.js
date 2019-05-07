import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, Button } from 'native-base';

export default class InfoCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (

            <View style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Informations</Text>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Titre</Text>
                                <Text>SPEED RUN</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Author</Text>
                                <Text>MaxLaMenace</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Date</Text>
                                <Text>12/03/2019 - 15h00</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Lieu</Text>
                                <Text>St Pancras Hotel</Text>
                            </View>
                            <View style={{ width: "100%", padding: 2, marginBottom: 16 }}>
                                <Text style={{ paddingBottom: 2 }}>Description</Text>
                                <Text>Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour Bonjour</Text>
                            </View>
                            <Button block success>
                                <Text>SUBSCRIBE</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        )
    }
}