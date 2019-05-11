import React from 'react';
import { View, Image, TextInput } from 'react-native';
import { Text, Button, DatePicker, Picker, Icon } from 'native-base';
import FooterTabs from '../../components/FooterTabs'
import ENV from '../../../env'
import JWT from 'expo-jwt'
import KEY from '../../../secretenv.js'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ScrollView } from 'react-native-gesture-handler';
import { Location } from 'expo';
import Style from '../../styles/createevent'
import Func from '../../functions.js';

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

    fetchGames = async () => {
        const token = await Func.getToken()
        this.setState({ token })
        const url = `https://gathergamers.herokuapp.com/api/game/${this.props.navigation.state.params.navigation.state.params.id}`
        const auth = `Bearer ${token}`
        const response = await Func.fetch(url, "GET", null, auth)
        if (response.status == 401) {
            Func.toaster("Unauthorized!", "Okay", "danger", 3000);
        } else {
            let responseJSON = await response.json()
            this.setState({ cover: responseJSON.cover, name: responseJSON.name })
        }
    }

    createEvent = async () => {
        const { nameEvent, playersEvent, dateEvent, priceEvent, placeEvent } = this.state
        if (nameEvent != null) {
            if (playersEvent != null) {
                if (dateEvent != null) {
                    if (priceEvent != null) {
                        if (placeEvent != null) {
                            const token = await Func.getToken()
                            this.setState({ token })
                            let decodedToken = await JWT.decode(token, ENV.JWT_KEY)
                            const url = "https://gathergamers.herokuapp.com/api/event/create"
                            const body = JSON.stringify({
                                name: this.state.nameEvent,
                                place: this.state.placeEvent,
                                date: this.state.dateEvent,
                                UserId: decodedToken.id,
                                GameId: this.props.navigation.state.params.navigation.state.params.id,
                                price: this.state.priceEvent,
                                players: this.state.playersEvent,
                                type: this.state.typeEvent,
                            })
                            const auth = `Bearer ${token}`
                            const response = await Func.fetch(url, "POST", body, auth)
                            if (response.status == 401) {
                                Func.toaster("Unauthorized!", "Okay", "danger", 3000);
                            } else {
                                let responseJSON = await response.json()
                                this.setState({ cover: responseJSON.cover, name: responseJSON.name });
                                // Once the user creates an event, he is automatically participant
                                const url = "https://gathergamers.herokuapp.com/api/participant/add"
                                const body = JSON.stringify({
                                    UserId: decodedToken.id,
                                    EventId: responseJSON.data.event.id
                                })
                                const auth = `Bearer ${token}`
                                await Func.fetch(url, "POST", body, auth)
                              }
                            this.props.navigation.navigate('Home')

                        } else {
                            Func.toaster("Wrong Address!", "Okay", "danger", 3000);
                        }
                    } else {
                        Func.toaster("Wrong Cash Price!", "Okay", "danger", 3000);
                    }
                } else {
                    Func.toaster("Wrong Date!", "Okay", "danger", 3000);
                }
            } else {
                Func.toaster("Wrong Numbers of Players!", "Okay", "danger", 3000);
            }
        } else {
            Func.toaster("Wrong Event Name!", "Okay", "danger", 3000);
        }
    }

    render() {
        const { cover, lockCreation } = this.state
        return (
            <>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image style={Style.image} source={{ uri: cover }}/>
                    </View>
                    <View>
                        <View style={Style.viewname}>
                            <TextInput onChangeText={(nameEvent) => this.setState({ nameEvent })} placeholder={"Event Name"} style={Style.textinput}/>
                        </View>
                        <View style={Style.view1}>
                            <Text style={Style.type}>Event Type :</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{ flex: 1 }}
                                placeholder="Select type"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.typeEvent}
                                onValueChange={(typeEvent) => this.setState({ typeEvent })}
                            >
                                <Picker.Item label="LAN" value="LAN"/>
                                <Picker.Item label="Speed Run" value="Speed Run"/>
                                <Picker.Item label="Tournois" value="Tournois"/>
                                <Picker.Item label="Esport" value="Esport"/>
                                <Picker.Item label="Autres" value="Autres"/>
                            </Picker>
                        </View>
                        <View style={Style.view1}>
                            <Text style={Style.text} >Number of players :</Text>
                            <TextInput onChangeText={(playersEvent) => this.setState({ playersEvent })} keyboardType={"numeric"} maxLength={3} style={Style.textinput2} />
                        </View>
                        <View style={Style.view1}>
                            <Text style={Style.text} >Date :</Text>
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
                        <View style={Style.viewcash}>
                            <Text style={Style.text} >Cash Price :</Text>
                            <TextInput onChangeText={(priceEvent) => this.setState({ priceEvent })} keyboardType={"numeric"} maxLength={6} style={Style.textinput2} />
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
                <FooterTabs {...this.props}/>
            </>
        )
    }
}
