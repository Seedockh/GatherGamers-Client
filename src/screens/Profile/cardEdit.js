import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Content, Card, CardItem, Body, Text, Icon, Switch, Item, Label, Input } from 'native-base';
import Style from '../../styles/profile'
import JWT from 'expo-jwt'
import ENV from '../../../env'
export default class CardFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            nickname: "",
            email: "",
            token: null,
            key: "gathergam3rs",
            passwordConfirm : null,
            password : null
        }
    }

    componentDidMount() {

        this.recoverData()
    }

    onPressEdit() {
        this.updateData()
        this.props.onEditFalse()
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    recoverData = async () => {
        
        await this.getToken()
        const { token } = this.state

        let decodedToken = JWT.decode(token, ENV.JWT_KEY)

        let response = await fetch("https://gathergamers.herokuapp.com/api/user/" + decodedToken.id, {
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": 'application/json'
            },
            method: "GET"
        })
        .catch( error => {return console.log("error", error)})

        const json = await response.json();
        if (json.error) {
            return null
        } else {
            this.setState({ firstname: json.firstname, lastname: json.lastname, email: json.email, nickname: json.nickname })
        }
    }

    updateData = async () => {

        const { token, key } = this.state

        await this.getToken()

        let decodedToken = JWT.decode(token, key)

        let response = await fetch("https://gathergamers.herokuapp.com/api/user/update/" + decodedToken.id, {
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
                email: this.state.email,
                nickname: this.state.nickname,
                lastname: this.state.lastname,
                firstname: this.state.firstname,
                email: this.state.email,
                token: token,
            })
        })
        .catch( error => {return console.log("error", error)})

    }

    render() {
        const { firstname, lastname, email, nickname } = this.state
        return (

            <>
                <Content style={{ marginHorizontal: 16 }}>
                    <Card>
                        <CardItem header bordered>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text style={{ color: "black" }}>Informations</Text>
                                <Icon name="save" onPress={() => this.onPressEdit()} />
                            </View>

                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Nickname</Label>
                                    <Input value={nickname} onChangeText={(nickname) => this.setState({nickname})}/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Firstname</Label>
                                    <Input value={firstname} onChangeText={(firstname) => this.setState({firstname})}/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Lastname</Label>
                                    <Input value={lastname} onChangeText={(lastname) => this.setState({lastname})}/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Email</Label>
                                    <Input value={email} onChangeText={(email) => this.setState({email})}/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Password</Label>
                                    <Input secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                                </Item>
                                <Item floatingLabel style={Style.item}>
                                    <Label>Confirm Password</Label>
                                    <Input secureTextEntry={true} onChangeText={(passwordConfirm) => this.setState({passwordConfirm})}/>
                                </Item>
                            </Body>
                        </CardItem>
                        {/* <CardItem footer>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", padding: 2 }}>
                                <Text>Profil Privé</Text>
                                <Switch value={true} />
                            </View>
                        </CardItem> */}
                    </Card>
                </Content>
            </>
        );
    }
}