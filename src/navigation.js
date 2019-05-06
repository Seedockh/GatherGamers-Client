import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Profile from './screens/Profile'
import Games from './screens/Games'
import DetailGames from './screens/DetailGames'

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },
    Register: {
        screen: Register,
        navigationOptions: {
            header: null
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            header: null
        }
    },
    Games: {
        screen: Games,
        navigationOptions: {
            header: null
        }
    },
    DetailGames: {
        screen: DetailGames,
    }
},
    {
        initialRouteName: 'DetailGames',
        headerMode: 'float'
    });

export default createAppContainer(AppNavigator);