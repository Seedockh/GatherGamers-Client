import React from 'react';
import { ScrollView, View, Image, AsyncStorage, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
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
      this.setState({refreshing: true});
      this.fetchFavorite().then(() => {
        this.setState({refreshing: false});
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
        this.props.navigation.navigate('DetailGames', {id: gamesFetch[index].id})
    }

    render() {

        const { gamesFetch } = this.state

        return (
            <ScrollView style={{ flex: 1 }} refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                {!gamesFetch &&(
                  <View style={{ flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{marginTop:20}} size="large" color="#000000" />
                  </View>
                )}
                {gamesFetch && gamesFetch.length>0 && (
                  gamesFetch.map((item, index) => (
                      <TouchableOpacity key={index} activeOpacity={0} onPress={() => this.onDetails(index)}>
                          <View style={{ borderWidth: 3, borderColor: "#000", marginHorizontal: 24, marginVertical: 16, justifyContent: "center", alignItems: "center" }}>

                              <View style={{ paddingBottom: 8, justifyContent: "center", alignItems: "center", backgroundColor: "white", marginTop: -12, paddingHorizontal: 8 }}>
                                  <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                              </View>

                              <View style={{ padding: 8 }}>
                                  <Image
                                      style={{ width: vmin(20), height: vmin(20) }}
                                      source={{ uri: item.cover }}
                                  />
                              </View>

                          </View>
                      </TouchableOpacity>
                  ))
                )}
                {gamesFetch && gamesFetch.length===0 &&(
                  <Text style={{fontSize:20, textAlign:'center', marginTop:20}}> You have no favorites yet. </Text>
                )}
            </ScrollView>
        );
    }
}
