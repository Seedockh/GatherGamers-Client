import React from 'react';
import { View, Image } from 'react-native';
import { Text, Switch, Button } from 'native-base'
import { vmin } from 'react-native-expo-viewport-units';
import Style from '../../styles/games'
import FooterTabs from '../../components/FooterTabs'

export default class DetailGames extends React.Component {

    static navigationOptions = {
        headerTitle: "Titre du Jeu"
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 16 }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(20), flex: 1 }}
                            source={require('../../../assets/rouge.jpg')}
                        />
                        <View style={{ flex: 2, justifyContent: "center", alignItems: "center", paddingLeft: 8 }}>
                            <Text>
                                Horum adventum praedocti speculationibus fidis rectores militum tessera data sollemni armatos omnes celeri eduxere procursu.
                    </Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginHorizontal: 16 }}>
                        <Text>Add Titre du Jeu as favorite</Text>
                        <Switch value={true} />
                    </View>

                    <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                        <Button block light style={{ marginVertical: 8 }}>
                            <Text>Create Event</Text>
                        </Button>
                        <Button block light style={{ marginVertical: 8 }}>
                            <Text>Join Event</Text>
                        </Button>
                        <Button block light style={{ marginVertical: 8 }}>
                            <Text>Check for gamers</Text>
                        </Button>
                        <Button block light style={{ marginVertical: 8 }}>
                            <Text>Forum</Text>
                        </Button>
                    </View>
                </View>

                <FooterTabs {...this.props} />
            </>
        )
    }
}