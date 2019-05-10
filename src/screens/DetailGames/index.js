import React from 'react';
import { View, Image, AsyncStorage, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Switch, Button } from 'native-base'
import Style from '../../styles/detailgame'
import FooterTabs from '../../components/FooterTabs'
import JWT from 'expo-jwt'
import ENV from '../../../env'
export default class DetailGames extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            gameid: null,
            name: null,
            cover: null,
            summary: null,
            text: false,
            switchValue: false,
            nameFetch: null,
            gamesFetch: null,
            fetchesDone: false
        }
    }

    componentDidMount() {
        this.fetchGames();
        this.fetchFavorite();
    }

    setFetchStatus = async () => {
        if (this.state.cover && this.state.gamesFetch) this.setState({ fetchesDone: true });
        else this.setState({ fetchesDone: false });
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
                    this.setState({ cover: responseJSON.cover, name: responseJSON.name, summary: responseJSON.summary });
                    this.props.navigation.setParams({ title: responseJSON.name });
                    this.setFetchStatus();
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
                    this.setState({ gamesFetch: responseJSON.data.favourite.Games })
                    this.setState({ switchValue: false })
                    for await (let gameObject of this.state.gamesFetch) {
                        if (gameObject.name === this.state.name) {
                            this.setState({ switchValue: true, gameid: gameObject.id })
                        }
                    }
                    this.setFetchStatus();
                }
            })

    }

    pushNotif = async (message, type) => {
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = "https://gathergamers.herokuapp.com/api/notification/add"
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
                    message: message,
                    type: type
                })
            })
    }

    onJoinEvent() {
        this.props.navigation.navigate('JoinEvent', { gameid: this.props.navigation.state.params.id })
    }

    onGamersAround() {
        this.props.navigation.navigate('GamersAround')
    }

    onCreateEvent() {
        this.props.navigation.navigate('CreateEvent', { ...this.props })
    }

    async CHANGEDESTATETAMERE() {
        await this.setState({ switchValue: !this.state.switchValue });
        await this.onSwitch();

        if (this.state.switchValue) {
            await this.pushNotif(`You have added ${this.state.name} to your favorites`, 1)
        } else {
            await this.pushNotif(`You have deleted ${this.state.name} from your favorites`, 0)
        }
    }

    onSwitch = async () => {
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        if (this.state.switchValue === true) {
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
        } else if (this.state.switchValue === false) {
            const url = "https://gathergamers.herokuapp.com/api/favourite/delete/" + decodedToken.id + "/" + this.state.gameid;
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
        }
    }

    render() {
        const { cover, summary, text, switchValue, name, fetchesDone } = this.state
        return (
            <>
                {!fetchesDone && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000000" />
                    </View>
                )}
                {fetchesDone && (
                    <ScrollView>
                        <View style={Style.container}>
                            <View style={Style.viewimage}>
                                <Image
                                    style={Style.image}
                                    source={{ uri: cover }}
                                />
                            </View>

                            <View style={Style.viewsummary}>
                                <Text onPress={() => this.setState({ text: !this.state.text })} numberOfLines={text ? null : 5}>{summary}</Text>
                            </View>


                            <View style={Style.viewswitch}>
                                <Text>Add {name} as favorite</Text>
                                <Switch value={switchValue} onValueChange={() => this.CHANGEDESTATETAMERE()} />
                            </View>

                            <View style={Style.viewbutton}>
                                <Button block style={Style.button} onPress={() => this.onCreateEvent()}>
                                    <Text>Create Event</Text>
                                </Button>
                                <Button block style={Style.button} onPress={() => this.onJoinEvent()}>
                                    <Text>Join Event</Text>
                                </Button>
                                <Button block style={Style.button} onPress={() => this.onGamersAround()}>
                                    <Text>Check for gamers</Text>
                                </Button>
                                <Button block style={Style.button}>
                                    <Text>Forum</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                )}
                <FooterTabs {...this.props} />
            </>
        )
    }
}
