import React from 'react';
import { View, Image, TextInput, AsyncStorage } from 'react-native';
import { Item, Input, Label, Text, Button, DatePicker, Picker, Icon, Toast } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import ENV from '../../../env'
import JWT from 'expo-jwt'

export default class CreateEvent extends React.Component {

    static navigationOptions = {
        headerTitle: "Create Event"
    }

    constructor(props) {
        super(props);
        this.state = {
            cover: null,
            name: null,
            nameEvent: null,
            typeEvent: "LAN",
            playersEvent: null,
            dateEvent: null,
            priceEvent: null,
            placeEvent: null,
            token: null
        }
    }

    componentDidMount() {
        this.fetchGames()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    fetchGames = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/game/" + this.props.navigation.state.params.navigation.state.params.id
        await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.token
                },
            }
        )
            .then(async (response) => {
                if (response.status == 401) {
                    alert("Unauthorized!")
                } else {
                    let responseJSON = await response.json()
                    this.setState({ cover: responseJSON.cover, name: responseJSON.name })
                }
            })
    }

    toastMessage(message) {
        Toast.show({
            text: `${message}`,
            buttonText: "Okay",
            type: "danger",
            duration: 3000
        })
    }

    createEvent = async () => {
        const { nameEvent, playersEvent, dateEvent, priceEvent, placeEvent } = this.state

        if (nameEvent != null) {
            if (playersEvent != null) {
                if (dateEvent != null) {
                    if (priceEvent != null) {
                        if (placeEvent != null) {

                            await this.getToken()
                            const { token, id } = this.state
                            let decodedToken = JWT.decode(token, ENV.JWT_KEY)

                            const url = "https://gathergamers.herokuapp.com/api/event/create"
                            await fetch(
                                url,
                                {
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer " + this.state.token
                                    },
                                    body: JSON.stringify({
                                        name: this.state.nameEvent,
                                        place: this.state.placeEvent,
                                        date: this.state.dateEvent,
                                        UserId: decodedToken.id,
                                        GameId: this.props.navigation.state.params.navigation.state.params.id,
                                        price: this.state.priceEvent,
                                        players: this.state.playersEvent,
                                        type: this.state.typeEvent,
                                    })
                                }
                            )
                                .then(async (response) => {
                                    if (response.status == 401) {
                                        alert("Unauthorized!")
                                    } else {
                                        let responseJSON = await response.json()
                                        this.setState({ cover: responseJSON.cover, name: responseJSON.name })
                                    }
                                })
                            this.props.navigation.navigate('Home')

                        } else {
                            this.toastMessage("Wrong Address !")
                        }
                    } else {
                        this.toastMessage("Wrong Cash Price !")
                    }
                } else {
                    this.toastMessage("Wrong Date !")
                }
            } else {
                this.toastMessage("Wrong Numbers of Players !")
            }
        } else {
            this.toastMessage("Wrong Event Name !")
        }
    }

    render() {
        const { cover } = this.state

        return (
            <>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                            source={{ uri: cover }}
                        />
                    </View>

                    <View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, marginTop: 24 }}>
                            <TextInput onChangeText={(nameEvent) => this.setState({ nameEvent })} placeholder={"Event Name"} style={{ width: "100%", borderColor: 'gray', borderBottomWidth: 1, textAlign: "center", fontSize: 24 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 2 }}>Event Type :</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ flex: 1 }}
                                placeholder="Select type"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.typeEvent}
                                onValueChange={(typeEvent) => this.setState({ typeEvent })}
                            >
                                <Picker.Item label="LAN" value="key0" />
                                <Picker.Item label="Speed Run" value="key1" />
                                <Picker.Item label="Tournois" value="key2" />
                                <Picker.Item label="Esport" value="key3" />
                                <Picker.Item label="Autres" value="key4" />
                            </Picker>
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Number of players :</Text>
                            <TextInput onChangeText={(playersEvent) => this.setState({ playersEvent })} keyboardType={"numeric"} maxLength={3} style={{ width: 40, height: 20, borderColor: 'gray', borderBottomWidth: 1, textAlign: "right", marginRight: 4 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Date :</Text>
                            <DatePicker
                                defaultDate={new Date(2019, 4, 14)}
                                minimumDate={new Date(2019, 4, 14)}
                                maximumDate={new Date(2020, 4, 14)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "black" }}
                                placeHolderTextStyle={{ color: "black" }}
                                onDateChange={(dateEvent) => this.setState({ dateEvent })}
                                disabled={false}
                            />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Cash Price :</Text>
                            <TextInput onChangeText={(priceEvent) => this.setState({ priceEvent })} keyboardType={"numeric"} maxLength={6} style={{ width: 40, height: 20, borderColor: 'gray', borderBottomWidth: 1, textAlign: "right", marginRight: 4 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4 }}>
                            <Text>Address :</Text>
                            <TextInput onChangeText={(placeEvent) => this.setState({ placeEvent })} style={{ borderColor: 'gray', borderBottomWidth: 1 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginTop: 36 }}>
                            <Button block success onPress={this.createEvent.bind(this)}>
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