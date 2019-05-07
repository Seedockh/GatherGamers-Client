import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, Icon, Thumbnail, Button } from 'native-base';
import FooterTabs from '../../components/FooterTabs'

export default class Friends extends React.Component {

    static navigationOptions = {
        headerTitle: "Friends"
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    onPressSave() {
        this.props.onEditTrue()
    }

    render() {
        return (

            <>
                <Content style={{ marginHorizontal: 16 }}>
                    <Card>
                        <CardItem header bordered>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text style={{ color: "black" }}>Informations</Text>
                                <Icon name="create" onPress={() => this.onPressSave()} />
                            </View>

                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                                    <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                                    <View style={{ flexDirection: "column", width: "100%", padding: 2, paddingHorizontal: 8 }}>
                                        <Text>Hyperion</Text>
                                        <Text>From 24/01/2018</Text>
                                    </View>
                                </View>
                                <Button block success>
                                    <Text>Add Friend</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>

                <FooterTabs {...this.props} />
            </>
        );
    }
}