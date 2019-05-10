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
    fetch: async function(url, method, body = {}) {
        try {
            let response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
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
    }
}