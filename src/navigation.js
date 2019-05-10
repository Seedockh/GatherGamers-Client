import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Profile from './screens/Profile'
import Games from './screens/Games'
import DetailGames from './screens/DetailGames'
import JoinEvent from './screens/JoinEvent'
import DetailEvents from './screens/DetailEvents'
import GamersAround from './screens/GamersAround'
import Friends from './screens/Friends'
import CreateEvent from './screens/CreateEvent'

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
        navigationOptions: {
          //title:
        }
    },
    JoinEvent: {
        screen: JoinEvent,
    },
    DetailEvents: {
        screen: DetailEvents
    },
    GamersAround: {
        screen: GamersAround
    },
    Friends: {
        screen: Friends
    },
    CreateEvent: {
        screen: CreateEvent
    }
},
    {
        initialRouteName: 'Login',
        headerMode: 'float',
        defaultNavigationOptions: {
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#000',
            },
        },
    });

export default createAppContainer(AppNavigator);
