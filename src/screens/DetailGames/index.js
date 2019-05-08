import React from 'react';
import { View, Image, AsyncStorage, ScrollView } from 'react-native';
import { Text, Switch, Button } from 'native-base'
import { vmin } from 'react-native-expo-viewport-units';
import Style from '../../styles/games'
import FooterTabs from '../../components/FooterTabs'
import JWT from 'expo-jwt'
import ENV from '../../../env'

export default class DetailGames extends React.Component {

    static navigationOptions = {
        headerTitle: "Titre du Jeu"
    }

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            name: "",
            cover: null,
            summary: null,
            text: false,
            switchValue: false,
            nameFetch: null,
            gamesFetch: null
        }
    }

    componentDidMount() {
        this.fetchGames()
        this.fetchFavorite()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    fetchGames = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/game/" + this.props.navigation.state.params.id
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
                    this.setState({ cover: responseJSON.cover, name: responseJSON.name, summary: responseJSON.summary })
                }
            })
    }

    fetchFavorite = async () => {

        await this.getToken()
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        const url = "https://gathergamers.herokuapp.com/api/favourite/user/" + decodedToken.id
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
                    console.log(responseJSON)
                    this.setState({ gamesFetch: responseJSON.data.favourite.Games })
                    for (let gameObject of this.state.gamesFetch) {
                        if (gameObject.name === this.state.name) {
                            this.setState({ switchValue: true })
                        }
                    }
                }
            })
    }

    onJoinEvent() {
        this.props.navigation.navigate('JoinEvent', {gameid: this.props.navigation.state.params.id})
    }

    onGamersAround() {
        this.props.navigation.navigate('GamersAround')
    }

    onCreateEvent() {
        this.props.navigation.navigate('CreateEvent', { ...this.props })
    }

    CHANGEDESTATETAMERE() {
        const { switchValue } = this.state
        console.log("avant", switchValue)
        this.setState({ switchValue: !this.state.switchValue }, () => this.onSwitch())
        console.log("apres", switchValue)
    }

    onSwitch = async () => {
        const { switchValue } = this.state

        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        if (switchValue === true) {

            const url = "https://gathergamers.herokuapp.com/api/favourite/add"
            let response = await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.state.token
                    },
                    body: JSON.stringify({
                        UserId: decodedToken.id,
                        GameId: this.props.navigation.state.params.id
                    })
                })
            console.log(response)
        } else if (switchValue === false) {

            const url = "https://gathergamers.herokuapp.com/api/favourite/delete/" + decodedToken.id + "/" + this.props.navigation.state.params.id
            let response = await fetch(
                url,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + this.state.token,
                        "Content-Type": 'application/json'
                    },
                    method: "DELETE"
                })
            console.log(response)
        }
    }

    render() {
        const { cover, summary, text, switchValue } = this.state
        return (
            <>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                                source={{ uri: cover }}
                            />
                        </View>

                        <View style={{ flex: 2, justifyContent: "center", alignItems: "center", marginHorizontal: 16, marginVertical: 16 }}>
                            <Text onPress={() => this.setState({ text: !this.state.text })} numberOfLines={text ? null : 5}>{summary}</Text>
                        </View>


                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginHorizontal: 16 }}>
                            <Text>Add Titre du Jeu as favorite</Text>
                            <Switch value={switchValue} onValueChange={() => this.CHANGEDESTATETAMERE()} />
                        </View>

                        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                            <Button block style={{ marginVertical: 8, backgroundColor: "black" }} onPress={() => this.onCreateEvent()}>
                                <Text>Create Event</Text>
                            </Button>
                            <Button block style={{ marginVertical: 8, backgroundColor: "black" }} onPress={() => this.onJoinEvent()}>
                                <Text>Join Event</Text>
                            </Button>
                            <Button block style={{ marginVertical: 8, backgroundColor: "black" }} onPress={() => this.onGamersAround()}>
                                <Text>Check for gamers</Text>
                            </Button>
                            <Button block style={{ marginVertical: 8, backgroundColor: "black" }}>
                                <Text>Forum</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
                <FooterTabs {...this.props} />
            </>
        )
    }
}