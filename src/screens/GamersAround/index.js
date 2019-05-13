import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Item, Input, Icon, Text, List, ListItem, Thumbnail, Left, Body } from 'native-base';
import FooterTabs from '../../components/FooterTabs';
import { MapView, Location, Permissions } from 'expo';
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import Func from '../../functions.js';
import geolib from 'geolib';
import Style from '../../styles/gamersaround'
let gamers = [];

export default class GamersAround extends React.Component {

    static navigationOptions = {
        headerTitle: "Gamers Around"
    }

    constructor(props) {
        super(props);
        this.state = {
          searchText: "",
          token: null,
          decodedToken: null,
          allowGeoloc: false,
          location: {
            type: 'Point',
            coordinates: [48,2]
          },
          locationResult: false,
          fetchDone: false,
        }
    }

    async componentDidMount() {
      const token = await Func.getToken()
      let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
      const location = await Func.checkGeolocation();

      this.setState({ token, decodedToken, location: location[0], allowGeoloc: location[1] });
      if (this.state.allowGeoloc) {
        const response = await Func.getUserLocation(token,decodedToken);
        this.setState({ location: response[0], locationResult: response[1] })
      }
      await this.fetchUsers();
    }

    fetchUsers = async () => {
        const { token } = this.state;
        const url = "https://gathergamers.herokuapp.com/api/favourite/game/"+this.props.navigation.state.params.gameid ;
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if(response.status == 401) {
          Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            // When users are fetched
              responseJSON.data.favourites.Users.map(async (gamer) => {
                // Get distance from current user
               const distFromUser = this.state.allowGeoloc && gamer.lastLocation!==null ?
                  await geolib.getDistanceSimple(
                    {latitude: this.state.location.coordinates[0], longitude: this.state.location.coordinates[1]},
                    {latitude: gamer.lastLocation.coordinates[0], longitude: gamer.lastLocation.coordinates[1]}
                  ) / 1000 : null;
              // Push the gamer with all infos
              const gamerToPush = {
                id: gamer.id,
                nickname: gamer.nickname,
                picture: gamer.picture,
                distance: distFromUser===null ? null : distFromUser.toString().match(/^[0-9]*[^\.]/g)[0]+' km',
              }
              if (gamer.lastLocation!==null) {
                gamerToPush.latitude = gamer.lastLocation.coordinates[0]
                gamerToPush.longitude = gamer.lastLocation.coordinates[1]
              }

              gamers.push(gamerToPush);
              if (gamers.length===responseJSON.data.favourites.Users.length-1) this.setState({fetchDone: true});
            });
        }
    }

    getDetails(index) {
      this.props.navigation.navigate('Friends', {gamer: gamers[index]})
    }

    renderMarker(item,index) {
      if (item.latitude===undefined || item.longitude===undefined ||
          item.distance===null || item.id===this.state.decodedToken.id)
            return null;
      return(
        <MapView.Marker key={index}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude
          }}
          title={item.nickname}
          description={item.distance}
          pinColor={'#baff8c'}
        />
      )
    }

    renderItem(item, index) {
      if (item.latitude===undefined || item.longitude===undefined ||
          item.distance===null || item.id===this.state.decodedToken.id)
            return null;
      const randPicture = index%2===0 ? require(`../../../assets/profile${1}.png`) : require(`../../../assets/profile${2}.png`);
      if (item.nickname.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1) {
        return(
            <List key={index} >
                <ListItem thumbnail>
                <TouchableOpacity key={index} activeOpacity={0.5} style={{flexDirection : "row"}} onPress={() => this.getDetails(index)}>
                    <Left>
                        <Thumbnail source={randPicture} />
                    </Left>
                    <Body>
                        <Text>{item.nickname}</Text>
                        <Text note numberOfLines={1}>{item.distance}</Text>
                    </Body>
                </TouchableOpacity>
                </ListItem>
            </List>)
      } else return null;
    }

    render() {
        return (
            <>
              {this.state.allowGeoloc && !this.state.locationResult &&
                <View style={Style.activityview}>
                  <ActivityIndicator style={Style.activity} size="large" color="#000000" />
                </View>
              }
              {this.state.locationResult &&
                <MapView style={Style.mapview}
                    initialRegion={{
                      latitude: this.state.location.coordinates[0],
                      longitude: this.state.location.coordinates[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                  {this.state.allowGeoloc &&
                    <MapView.Marker
                      coordinate={{
                        latitude: this.state.location.coordinates[0],
                        longitude: this.state.location.coordinates[1]
                      }}
                      title="Your position"
                    />
                  }
                  {this.state.fetchDone ? gamers.map((item,index)=>this.renderMarker(item,index)) : null}
                </MapView>
              }
                <View style={Style.container}>
                    <Header searchBar rounded style={{ backgroundColor:"black"}}>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" onChangeText={(searchText) => this.setState({searchText})} />
                        </Item>
                    </Header>
                    {!this.state.fetchDone && (
                      <View style={Style.activityview}>
                        <ActivityIndicator style={Style.activity} size="large" color="#000000" />
                      </View>
                    )}
                    {this.state.fetchDone && (
                      <ScrollView>
                          {gamers.map((item, index) => this.renderItem(item, index))}
                      </ScrollView>
                    )}
                </View>
                <FooterTabs {...this.props} />
            </>
        )
    }
}
