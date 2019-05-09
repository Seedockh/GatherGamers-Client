import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Content, Card, CardItem, Body, Text, List, ListItem, Left, Thumbnail, Toast } from 'native-base';

const participants = []
export default class ListCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participantsCount: 0,
            token: ""
        }
        participants.length = 0
    }

    componentDidMount() {
        this.fetchParticipants()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    toastMessage(status, message) {
        Toast.show({
            text: `${message}`,
            buttonText: "Okay",
            type: `${status}`,
            duration: 3000
        })
    }

    fetchParticipants = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/participant/event/" + this.props.navigation.state.params.event.id
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
                if(response.status == 401) {
                    this.toastMessage("danger", "Unauthorized!")
                } else {
                    let responseJSON = await response.json()
                    await responseJSON.data.participants.Users.forEach(async function(participant) {
                        const token = await AsyncStorage.getItem('token');
                        const url = "https://gathergamers.herokuapp.com/api/user/" + participant.id
                        let nickname = ""
                        await fetch(
                            url,
                            {
                                method: "GET",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + token
                                }
                            }
                            )
                            .then(async (response) => {
                                if(response.status == 401) {
                                    this.toastMessage("danger", "Unauthorized!")
                                } else {
                                    let responseJSON = await response.json()
                                    nickname = responseJSON.nickname
                                }
                        })
                        let participantToPush = {
                            nickname
                        }
                        await participants.push(participantToPush)
                        this.setState({participantsCount: participants.length})
                    }.bind(this));
                }
        })
    }

    fetchParticipantsNickname = async (id) => {
        await this.getToken()
        
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
        )
    }
}