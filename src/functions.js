import { AsyncStorage } from 'react-native';
import { Toast } from 'native-base';
import { Location, Permissions } from 'expo';
import ENV from '../env'
import JWT from 'expo-jwt'

export default Func = {
    toaster: function(text, buttonText, type, duration) {
        Toast.show({
            text: `${text}`,
            buttonText: `${buttonText}`,
            type: `${type}`,
            duration
        })
    },
    getToken: async function() {
        const token = await AsyncStorage.getItem('token');
        return token
    },
    fetch: async function(url, method, body = {}, auth = null) {
        try {
            let response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": auth
                    },
                    body
                }
            );
            return response
        } catch (errors) {
            Func.Toaster("Something went wrong :(", "Okay", "danger", 3000)
            throw errors;
        }
    },
    setAsyncStorage: async function(email, password, token) {
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            throw error
        }
    },
    getAsyncStorage: async function() {
        try {
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            const token = await AsyncStorage.getItem('token');
            return {email, password, token}
        } catch (error) {
            throw error
        }
    },
    rmAsyncStorage: async function() {
        await AsyncStorage.multiRemove(['email', 'password', 'token'])
    },

    // Return a tab with [ location, allowGeoloc ]
    checkGeolocation: async function() {
      // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        return [{ type: 'Point', coordinates: [location.coords.latitude, location.coords.longitude] },true]
      } else {
        Func.toaster("Location permission not granted!", "Okay", "danger", 3000);
        return [{ type: 'Point', coordinates: [48.856614, 2.3522219] },false];
      }
    },

    // Send UserLocation to DB and returns [ location, locationResult, response ]
    getUserLocation: async function(token,decodedToken) {
      if (await Location.hasServicesEnabledAsync()) {
        const currentPosition = await Location.getCurrentPositionAsync({ accuracy: 2 });
        const location = { type: 'Point', coordinates: [currentPosition.coords.latitude, currentPosition.coords.longitude] }
        const locationResult = true;
        const result = await this.updateUserLocation(location,locationResult,token,decodedToken);
        return [location,locationResult,result];
      } else {
        const location = { type: 'Point', coordinates: [48.856614, 2.3522219] }
        const locationResult = false;
        const result = await this.updateUserLocation(location,locationResult,token,decodedToken);
        return [location,locationResult,result];
      }
    },

    updateUserLocation: async function(location,locationResult,token,decodedToken) {
      const url = `https://gathergamers.herokuapp.com/api/user/updatelocation/${decodedToken.id}`
      const body = JSON.stringify({
        latitude: location.coordinates[0],
        longitude: location.coordinates[1],
      })
      const auth = `Bearer ${token}`
      const response = await this.fetch(url, 'PUT', body, auth)
      if (response.status == 401) {
        Func.toaster("Unauthorized!", "Okay", "danger", 3000);
      } else {
        const responseJSON = await response.json();
        return responseJSON;
      }
    }
}
