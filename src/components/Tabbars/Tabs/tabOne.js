import React from 'react';
import { ScrollView, View, AsyncStorage, ActivityIndicator, RefreshControl  } from 'react-native';
import { Text, Card, CardItem, Button } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabone'
export default class TabOne extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            notifsFetch: null,
            refreshing: false,
            deleting: false,
        }
    }

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.fetchNotif().then(() => {
        this.setState({refreshing: false});
      });
    }

    deleteAllNotif = async () => {
      this.setState({deleting: true});
      await this.getToken();
      let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)
      const url = "https://gathergamers.herokuapp.com/api/notification/delete/alluser/" + decodedToken.id
      await fetch(
        url,
        {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.state.token
          },
        }
      ).then(async (response) => {
        if (response.status == 401) alert("Unauthorized!");
        else {
          await this.fetchNotif();
          this.setState({ deleting: false })
        }
      });
    }

    componentDidMount() {
        this.fetchNotif()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    fetchNotif = async () => {

        await this.getToken()
        let decodedToken = JWT.decode(this.state.token, ENV.JWT_KEY)

        const url = "https://gathergamers.herokuapp.com/api/notification/user/" + decodedToken.id
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
                    this.setState({ notifsFetch: responseJSON.data.notifs })
                    //console.log(this.state.notifsFetch);
                }
            })
    }

    render() {

        const { notifsFetch, deleting } = this.state

        return (

            <ScrollView style={Style.scrollview} refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                {!notifsFetch || deleting &&(
                  <View style={{ flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{marginTop:20}} size="large" color="#000000" />
                  </View>
                )}
                {!deleting && notifsFetch && notifsFetch.length>0 && (
                  <>
                    <Button block style={{ marginVertical: 8, marginHorizontal: 4, backgroundColor: "black" }} onPress={() => this.deleteAllNotif()}>
                        <Text>Clear All</Text>
                    </Button>
                      {notifsFetch.map((item, index) => (
                        <View key={index} style={{ marginHorizontal: 16, marginVertical: 4, marginTop: index === 0 ? 8 : 0 }}>
                            <CardItem style={{ backgroundColor: item.type ? "#48CA75" : "#EE4F5E", borderRadius: 10}}>
                                <View>
                                    <Text>{item.message}</Text>
                                    <Text note style={Style.textnote} >{item.createdAt}</Text>
                                </View>
                            </CardItem>
                        </View>
                      ))}
                    </>
                )}
                {!deleting && notifsFetch && notifsFetch.length===0 &&(
                  <Text style={{fontSize:20, textAlign:'center', marginTop:20}}> You have no news yet. </Text>
                )}

            </ScrollView>
        );
    }
}
