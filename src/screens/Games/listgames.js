import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Header, Item, Input, Icon, Text } from 'native-base';
import Style from '../../styles/listgames'
import Func from '../../functions.js';

const games = [];
export default class ListGames extends React.Component {

    static navigationOptions = {
        header: false
    }

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            token: "",
            gamesCount: 0
        }
        games.length = 0
    }

    componentDidMount() {
        this.fetchGames()
    }

    fetchGames = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = "https://gathergamers.herokuapp.com/api/game/"
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            responseJSON.data.games.forEach(function (game) {
                let gameToPush = {
                    title: game.name,
                    image: game.cover,
                    id: game.id
                }
                games.push(gameToPush)
            });
        }
        this.setState({ gamesCount: games.length })
    }

    showDetails(index) {
        this.props.navigation.navigate('DetailGames', { id: games[index].id })
    }

    renderItem(item, index) {
        if (item.title.indexOf(this.state.searchText) !== -1) {
            return (
                <TouchableOpacity key={index} activeOpacity={0} onPress={() => this.showDetails(index)}>
                    <View style={Style.container}>

                        <View style={Style.view}>
                            <Image
                                style={Style.picture}
                                source={{ uri: item.image }}
                            />
                        </View>

                        <View style={Style.viewname}>
                            <Text style={Style.name}>{item.title}</Text>
                        </View>

                    </View>
                </TouchableOpacity>

            )
        } else {
            return null
        }
    }

    render() {
        return (
            <>
                <View style={Style.viewheader}></View>
                <Header searchBar rounded style={Style.header}>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={(searchText) => this.setState({ searchText })} />
                    </Item>
                </Header>

                <ScrollView style={Style.scrollview}>
                    {games.length > 0 ? games.map((item, index) => this.renderItem(item, index)) : null}
                </ScrollView>
            </>
        );
    }
}