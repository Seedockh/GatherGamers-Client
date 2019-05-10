import React from 'react';
import { View, Image, TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import { Item, Input, Label, Text, Button, DatePicker, Picker, Icon, Toast } from 'native-base';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Location } from 'expo';

export default class CreateEvent extends React.Component {

    static navigationOptions = {
        headerTitle: "Create Event"
    }

    constructor(props) {
        super(props);
        this.state = {
            cover: null,
            name: null,
            nameEvent: null,
            typeEvent: "LAN",
            playersEvent: null,
            dateEvent: null,
            priceEvent: null,
            placeEvent: null,
            token: null,
            addressData: null,
            addressDetails: null,
            mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            locationResult: false,
            location: { coords: {
                latitude: 37.78825,
                longitude: -122.4324
            } },
            lockCreation: true,
        }
    }

    componentDidMount() {
        this.fetchGames();
        this.getUserLocation();
    }

    handleMapRegionChange = mapRegion => {
      this.setState({ mapRegion });
    };

    validateAddress = async () => {
      if (this.state.addressData!==null && this.state.addressDetails!==null) {
        await this.setState({
          placeEvent: {
            type: 'Point',
            coordinates: [this.state.addressDetails.geometry.location.lat,this.state.addressDetails.geometry.location.lng]
          },
          lockCreation: false });
      }
    }

    async getUserLocation() {
      if (await Location.hasServicesEnabledAsync()) {
        let location = await Location.getCurrentPositionAsync({accuracy: 2});
        this.setState({ location: location, locationResult: true })
      } else {
        this.state({ locationResult: 'Location permission not enabled !'});
      }
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({ token })
    }

    fetchGames = async () => {
        await this.getToken()
        const url = "https://gathergamers.herokuapp.com/api/game/" + this.props.navigation.state.params.navigation.state.params.id
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
                    this.setState({ cover: responseJSON.cover, name: responseJSON.name })
                }
            })
    }

    toastMessage(message) {
        Toast.show({
            text: `${message}`,
            buttonText: "Okay",
            type: "danger",
            duration: 3000
        })
    }

    createEvent = async () => {
        const { nameEvent, playersEvent, dateEvent, priceEvent, placeEvent } = this.state

        if (nameEvent != null) {
            if (playersEvent != null) {
                if (dateEvent != null) {
                    if (priceEvent != null) {
                        if (placeEvent != null) {

                            await this.getToken()
                            const { token, id } = this.state
                            let decodedToken = JWT.decode(token, ENV.JWT_KEY)
                            console.log("====== CALLING EVENT/CREATE ROUTE ");
                            const url = "https://gathergamers.herokuapp.com/api/event/create"
                            await fetch(
                                url,
                                {
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer " + this.state.token
                                    },
                                    body: JSON.stringify({
                                        name: this.state.nameEvent,
                                        place: this.state.placeEvent,
                                        date: this.state.dateEvent,
                                        UserId: decodedToken.id,
                                        GameId: this.props.navigation.state.params.navigation.state.params.id,
                                        price: this.state.priceEvent,
                                        players: this.state.playersEvent,
                                        type: this.state.typeEvent,
                                    })
                                }
                            )
                                .then(async (response) => {
                                    if (response.status == 401) {

                                        alert("Unauthorized!")
                                    } else if (response.status>401 || response.status<200) {
                                      console.log(response);
                                    } else {
                                        let responseJSON = await response.json()
                                        this.setState({ cover: responseJSON.cover, name: responseJSON.name })
                                    }
                                })
                            this.props.navigation.navigate('Home')

                        } else {
                            this.toastMessage("Wrong Address !")
                        }
                    } else {
                        this.toastMessage("Wrong Cash Price !")
                    }
                } else {
                    this.toastMessage("Wrong Date !")
                }
            } else {
                this.toastMessage("Wrong Numbers of Players !")
            }
        } else {
            this.toastMessage("Wrong Event Name !")
        }
    }

    render() {
        const { cover, lockCreation } = this.state

        return (
            <>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: vmin(20), height: vmin(30), flex: 1 }}
                            source={{ uri: cover }}
                        />
                    </View>

                    <View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, marginTop: 24 }}>
                            <TextInput onChangeText={(nameEvent) => this.setState({ nameEvent })} placeholder={"Event Name"} style={{ width: "100%", borderColor: 'gray', borderBottomWidth: 1, textAlign: "center", fontSize: 24 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 2 }}>Event Type :</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ flex: 1 }}
                                placeholder="Select type"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.typeEvent}
                                onValueChange={(typeEvent) => this.setState({ typeEvent })}
                            >
                                <Picker.Item label="LAN" value="LAN" />
                                <Picker.Item label="Speed Run" value="Speed Run" />
                                <Picker.Item label="Tournois" value="Tournois" />
                                <Picker.Item label="Esport" value="Esport" />
                                <Picker.Item label="Autres" value="Autres" />
                            </Picker>
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Number of players :</Text>
                            <TextInput onChangeText={(playersEvent) => this.setState({ playersEvent })} keyboardType={"numeric"} maxLength={3} style={{ width: 40, height: 20, borderColor: 'gray', borderBottomWidth: 1, textAlign: "right", marginRight: 4 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Date :</Text>
                            <DatePicker
                                defaultDate={new Date(2019, 4, 14)}
                                minimumDate={new Date(2019, 4, 14)}
                                maximumDate={new Date(2020, 4, 14)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "black" }}
                                placeHolderTextStyle={{ color: "black" }}
                                onDateChange={(dateEvent) => this.setState({ dateEvent })}
                                disabled={false}
                            />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 4, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ flex: 1 }} >Cash Price :</Text>
                            <TextInput onChangeText={(priceEvent) => this.setState({ priceEvent })} keyboardType={"numeric"} maxLength={6} style={{ width: 40, height: 20, borderColor: 'gray', borderBottomWidth: 1, textAlign: "right", marginRight: 4 }} />
                        </View>
                        <View style={{ marginHorizontal: 16, marginVertical: 16, flex: 1 }}>
                            <Text>Address :</Text>
                            <GooglePlacesAutocomplete
                              placeholder='Search'
                              minLength={2} // minimum length of text to search
                              autoFocus={false}
                              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                              listViewDisplayed='false'    // true/false/undefined
                              fetchDetails={true}
                              renderDescription={row => row.description} // custom description render
                              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                //console.log(data, details);
                                this.setState({ addressData: data, addressDetails: details })
                              }}

                              getDefaultValue={() => ''}

                              query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: KEY.MAPS_API_KEY,
                                language: 'fr', // language of the results
                                types: 'address' // default: 'geocode'
                              }}

                              styles={{
                                textInputContainer: {
                                  width: '100%'
                                },
                                description: {
                                  fontWeight: 'bold'
                                },
                                predefinedPlacesDescription: {
                                  color: '#1faadb'
                                }
                              }}

                              //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                              //currentLocationLabel="Current location"
                              //nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                              GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                              }}
                              GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                type: 'geocode'
                              }}

                              GooglePlacesDetailsQuery={{
                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                fields: 'formatted_address',
                              }}

                              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                              //predefinedPlaces={}

                              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                              //renderLeftButton={()  => <Text>renderLeftButton</Text>}
                              renderRightButton={()=>
                                <View style={{ flex: 1 }}>
                                  <Button block info onPress={this.validateAddress.bind(this)}>
                                    <Text>OK</Text>
                                  </Button>
                                </View>
                               }
                            />
                            {/*<TextInput onChangeText={(placeEvent) => this.setState({ placeEvent })} style={{ borderColor: 'gray', borderBottomWidth: 1 }} />*/}
                        </View>

                        <View style={{ marginHorizontal: 16,  marginVertical: 32, flex: 1 }}>
                            <Button block success onPress={this.createEvent.bind(this)} disabled={lockCreation}>
                                <Text>Create Event</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>

                <FooterTabs {...this.props} />
            </>
        )
    }
}
