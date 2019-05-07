import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, Icon, Switch } from 'native-base';
import Style from '../../styles/profile'

export default class CardFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onPressSave () {
        this.props.onEditTrue()
    }

    render() {
        return (

            <Content style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Informations</Text>
                            <Icon name="create" onPress={() => this.onPressSave() }/>
                        </View>

                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Pseudo</Text>
                                <Text>Hyperions</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Prenom</Text>
                                <Text>Jean-Michel</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Nom</Text>
                                <Text>Obsolète</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Email</Text>
                                <Text>JMObsolète@gmail.com</Text>
                            </View>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text>Profil Privé</Text>
                            <Switch value={true} />
                        </View>
                    </CardItem>
                </Card>
            </Content>

        );
    }
}