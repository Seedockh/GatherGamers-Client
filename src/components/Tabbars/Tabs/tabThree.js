import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabthree'
import Func from '../../../functions.js';

export default class TabThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            gamesFetch: null,
            refreshing: false,
        }
    }

    componentDidMount() {
        this.fetchFavorite()
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchFavorite().then(() => {
            this.setState({ refreshing: false });
        });
    }

    fetchFavorite = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        let decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/favourite/user/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({ gamesFetch: responseJSON.data.favourite.Games })
        }
    }

    getDetails(index) {
        const { gamesFetch } = this.state
        this.props.navigation.navigate('DetailGames', { id: gamesFetch[index].id })
    }

    render() {
        const { gamesFetch } = this.state
        return (
            <ScrollView style={Style.scrollview} refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }>
                {!gamesFetch && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000000" />
                    </View>
                )}
                {gamesFetch && gamesFetch.length > 0 && (
                    gamesFetch.map((item, index) => (
                        <TouchableOpacity key={index} activeOpacity={0} onPress={() => this.getDetails(index)}>
                            <View style={Style.container}>

                                <View style={Style.view}>
                                    <Image
                                        style={Style.picture}
                                        source={{ uri: item.cover }}
                                    />
                                </View>
                                <View style={Style.viewname}>
                                    <Text style={Style.name}>{item.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                {gamesFetch && gamesFetch.length === 0 && (
                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}> You have no favorites yet. </Text>
                )}
            </ScrollView>
        );
    }
}
