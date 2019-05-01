import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    Home: {
        screen: Home
    },
    Register: {
        screen: Register
    }
},
    {
        initialRouteName: 'Login',
        headerMode: 'none'
    });

export default createAppContainer(AppNavigator);