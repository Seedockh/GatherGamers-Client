import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Profile from './screens/Profile'

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    Home: {
        screen: Home
    },
    Register: {
        screen: Register
    },
    Profile: {
        screen: Profile
    }
},
    {
        initialRouteName: 'Login', //Penser à exclure initialRouteName: 'Profile' du commit
        headerMode: 'none'
    });

export default createAppContainer(AppNavigator);