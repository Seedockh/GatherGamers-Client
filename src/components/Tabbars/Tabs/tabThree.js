import React from 'react';
import { ScrollView, View, Image, AsyncStorage, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabthree'
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

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
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
                }
            })
    }

    onDetails(index) {
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
                        <TouchableOpacity key={index} activeOpacity={0} onPress={() => this.onDetails(index)}>
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
