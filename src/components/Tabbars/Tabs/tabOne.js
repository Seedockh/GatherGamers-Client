import React from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, CardItem, Button } from 'native-base';
import JWT from 'expo-jwt'
import ENV from '../../../../env'
import Style from '../../../styles/tabone'
import Func from '../../../functions.js';
import { withNavigationFocus } from "react-navigation";

class TabOne extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            notifsFetch: [],
            refreshing: false,
            deleting: false
        }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isFocused !== this.props.isFocused) {
        this.fetchNotif()
      }
    }

    _onRefresh = async () => {
      this.setState({refreshing: true});
      await this.fetchNotif()
      this.setState({refreshing: false});
    }

    deleteAllNotif = async () => {
      this.setState({deleting: true});
      const token = await Func.getToken()
      this.setState({ token })
      let decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
      const url = `https://gathergamers.herokuapp.com/api/notification/delete/alluser/${decodedToken.id}`
      const auth = `Bearer ${token}`
      const response = await Func.fetch(url, "DELETE", null, auth)
      if (response.status == 401) {
        Func.toaster("Unauthorized!", "Okay", "danger", 3000);
      } else {
          this.setState({notifsFetch: []})
          await this.fetchNotif();
          this.setState({ deleting: false })
      }
    }

    componentDidMount() {
        this.fetchNotif()
    }

    fetchNotif = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        let decodedToken = await JWT.decode(this.state.token, ENV.JWT_KEY)
        const url = `https://gathergamers.herokuapp.com/api/notification/user/${decodedToken.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
          Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
          let responseJSON = await response.json()
          await responseJSON.data.notifs.map(async notif => {
            notif.formatedDate = await Func.formatDate(notif.createdAt)
            this.setState({ notifsFetch: responseJSON.data.notifs })
          })
      }
    }

    render() {
        const { notifsFetch, deleting } = this.state
        return (
            <ScrollView style={Style.scrollview} refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
              }>
                {!notifsFetch || deleting &&(
                  <View style={{ flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{marginTop:20}} size="large" color="#000000" />
                  </View>
                )}
                {!deleting && notifsFetch && notifsFetch.length>0 && (
                  <>
                    <Button block style={{ marginVertical: 8, marginHorizontal: 16, backgroundColor: "black" }} onPress={() => this.deleteAllNotif()}>
                        <Text>Clear All</Text>
                    </Button>
                      {notifsFetch.map((item, index) => (
                        <View key={index} style={{ marginHorizontal: 16, marginVertical: 4, marginTop: index === 0 ? 8 : 0 }}>
                            <CardItem style={{ backgroundColor: item.type ? "#48CA75" : "#EE4F5E", borderRadius: 10}}>
                                <View>
                                    <Text>{item.message}</Text>
                                    <Text note style={Style.textnote} >{item.formatedDate}</Text>
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

export default withNavigationFocus(TabOne)