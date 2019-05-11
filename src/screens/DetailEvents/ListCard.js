import React from 'react';
import { View } from 'react-native';
import { Content, Card, CardItem, Body, Text, List, ListItem, Left, Thumbnail } from 'native-base';
import Func from '../../functions.js';

const participants = []
export default class ListCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participantsCount: 0,
            token: "",
            fetchDone: false
        }
        participants.length = 0
    }

    componentDidMount() {
        this.fetchParticipants()
    }

    fetchParticipants = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/participant/event/${this.props.navigation.state.params.event.id}`
        const auth = `Bearer ${token}`
        await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            await responseJSON.data.participants.Users.forEach(async function(participant) {
                const token = await Func.getToken()
                this.setState({ token })
                const url = `https://gathergamers.herokuapp.com/api/user/${participant.id}`
                let nickname = ""
                await Func.fetch(url, "GET", null, auth)
                if(response.status == 401) {
                    Func.toaster("Unauthorized!", "Okay", "danger", 3000);
                } else {
                    let responseJSON = await response.json()
                    nickname = responseJSON.nickname
                }
                let participantToPush = {
                    nickname
                }
                await participants.push(participantToPush)
                this.setState({participantsCount: participants.length})
            }.bind(this));
        }
    }

    renderItem(item, index) {
        return(
        <List key={index}>
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={require('../../../assets/rouge.jpg')} />
                </Left>
                <Body>
                    <Text>{item.nickname}</Text>
                </Body>
            </ListItem>
        </List>)
    }

    render() {
        return (
          <>
            {!this.state.fetchDone && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <ActivityIndicator style={{justifyContent: 'space-around', padding: 0}} size="large" color="#000000" />
              </View>
            )}
            {this.state.fetchDone && (
            <View style={{ marginHorizontal: 16 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                            <Text style={{ color: "black" }}>Participants</Text>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            {participants.length > 0 ? participants.map((item, index) => this.renderItem(item, index)) : null}
                        </Content>
                    </CardItem>
                </Card>
            </View>
            )}
          </>
        )
    }
}
