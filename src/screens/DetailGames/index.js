import React from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Switch, Button } from 'native-base'
import Style from '../../styles/detailgame'
import FooterTabs from '../../components/FooterTabs'
import JWT from 'expo-jwt'
import ENV from '../../../env'
import Func from '../../functions.js';

export default class DetailGames extends React.Component {

    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('screenTitle')
      }
    }

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
        this.props.navigation.setParams({ screenTitle: this.props.navigation.state.params.title })
        this.fetchGames();
        this.fetchFavorite();
    }

    componentWillUnmount() {
      this.setState({
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
      })
    }

    setFetchStatus = async () => {
        if (this.state.cover && this.state.gamesFetch) this.setState({ fetchesDone: true });
        else this.setState({ fetchesDone: false });
    }

    fetchGames = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/game/${this.props.navigation.state.params.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({ cover: responseJSON.cover, name: responseJSON.name, summary: responseJSON.summary });
            this.props.navigation.setParams({ title: responseJSON.name });
            this.setFetchStatus();
        }
    }

    fetchFavorite = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/favourite/user/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
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
    }

    pushNotif = async (message, type) => {
        const token = await Func.getToken()
        this.setState({ token })
        const decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = "https://gathergamers.herokuapp.com/api/notification/add"
        const body = JSON.stringify({
            UserId: decodedToken.id,
            message: message,
            type: type
        })
        const auth = `Bearer ${token}`
        await Func.fetch(url, "POST", body, auth)
    }

    onJoinEvent() {
        this.props.navigation.navigate('JoinEvent', { gameid: this.props.navigation.state.params.id })
    }

    onGamersAround() {
        this.props.navigation.navigate('GamersAround', { gameid: this.props.navigation.state.params.id })
    }

    onCreateEvent() {
        this.props.navigation.navigate('CreateEvent', { ...this.props })
    }

    async changeStatus() {
        await this.setState({ switchValue: !this.state.switchValue });
        await this.onSwitch();
        if (this.state.switchValue) {
            await this.pushNotif(`You have added ${this.state.name} to your favorites`, 1)
        } else {
            await this.pushNotif(`You have deleted ${this.state.name} from your favorites`, 0)
        }
    }

    onSwitch = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        let decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        if (this.state.switchValue === true) {
            const url = "https://gathergamers.herokuapp.com/api/favourite/add"
            const body = JSON.stringify({
                UserId: decodedToken.id,
                GameId: this.props.navigation.state.params.id
            })
            const auth = `Bearer ${token}`
            await Func.fetch(url, "POST", body, auth)
        } else if (this.state.switchValue === false) {
            const url = "https://gathergamers.herokuapp.com/api/favourite/delete/" + decodedToken.id + "/" + this.state.gameid;
            const auth = `Bearer ${token}`
            await Func.fetch(url, "DELETE", null, auth)
        }
    }

    render() {
        const { cover, summary, text, switchValue, name, fetchesDone } = this.state
        return (
            <>
                {!fetchesDone && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000000"/>
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
                                <Switch value={switchValue} onValueChange={() => this.changeStatus()} />
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
                                {/*<Button block style={Style.button}>
                                    <Text>Forum</Text>
                                </Button>*/}
                            </View>
                        </View>
                    </ScrollView>
                )}
                <FooterTabs {...this.props} />
            </>
        )
    }
}
