import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, Icon, Switch, Item, Label, Input } from 'native-base';
import Style from '../../styles/profile'

export default class CardFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onPressEdit() {
        this.props.onEditFalse()
    }

    render() {
        return (

            <>
                <Content style={{ marginHorizontal: 16 }}>
                    <Card>
                        <CardItem header bordered>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text style={{ color: "black" }}>Informations</Text>
                                <Icon name="save" onPress={() => this.onPressEdit()} />
                            </View>

                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Pseudo</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Prenom</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Nom</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Email</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Password</Label>
                                    <Input secureTextEntry={true} />
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Confirm Password</Label>
                                    <Input secureTextEntry={true} />
                                </Item>
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
            </>
        );
    }
}