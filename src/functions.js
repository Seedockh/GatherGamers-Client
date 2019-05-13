import { AsyncStorage } from 'react-native';
import { Toast } from 'native-base';

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
    formatDate: async function(unformatedDate) {
        const date = new Date(unformatedDate)
        let month = date.getMonth() + 1;
        let formatedMonth = month < 10 ? '0' + month : '' + month;
        let formatedDate = await `${date.getFullYear()}/${formatedMonth}/${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`
        return formatedDate
      }
}