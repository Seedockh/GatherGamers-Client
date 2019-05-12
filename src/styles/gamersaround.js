import { StyleSheet } from 'react-native'
import { vmin } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    activityview: {
        flex: 1, 
        justifyContent: 'center', 
        flexDirection: 'row'
    },

    activity: {
        justifyContent: 'space-around', 
        padding: 0
    },

    mapview:{
        height: vmin(25),
        flex: 1 
    },

    container: {
        flex:1
    }
});