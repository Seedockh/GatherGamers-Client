import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/Home'
import Login from './screens/Login'

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    Home: {
        screen: Home
    }
},
    {
        initialRouteName: 'Login',
        headerMode: 'none'
    });

export default createAppContainer(AppNavigator);