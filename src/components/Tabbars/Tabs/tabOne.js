import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';;
export default class TabOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                title: "Jenna Added You",
                date: "06/05/2019"
            },
            {
                title: "New Event in Paris",
                date: "06/05/2019"
            },
            {
                title: "Mark answered you",
                date: "06/05/2019"
            },
            {
                title: "Tyrion Added You",
                date: "06/05/2019"
            }]
        }
    }

    render() {

        const { data } = this.state

        return (
            <ScrollView style={{ flex: 1 }}>

                {data.length > 0 ? (
                    data.map((item, index) => (

                        <View key={index} style={{ borderWidth: 3, borderColor: "#000", marginHorizontal: 24, marginVertical: 16, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ marginTop: -12, paddingHorizontal: 8, backgroundColor:"white", alignSelf: "flex-start", marginLeft: 4 }}>
                                <Text note>{item.date}</Text>
                            </View>

                            <View style={{ padding: 8 }}>
                                <Image
                                    style={{ width: vmin(20), height: vmin(20) }}
                                    source={require('../../../../assets/logo.png')}
                                />
                            </View>
                            <View style={{ paddingBottom: 8, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontWeight: "500" }}>{item.title}</Text>
                            </View>
                        </View>

                    ))
                ) : (
                        <Text>Pas de news</Text>
                    )}

            </ScrollView>
        );
    }
}