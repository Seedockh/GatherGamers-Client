import { StyleSheet } from 'react-native'
import { vmin } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    touchable: {
        flexDirection: "row",
    },

    activityview: {
        flex: 1, 
        justifyContent: 'center', 
        flexDirection: 'row'
    },

    activity: {
        justifyContent: 'space-around', 
        padding: 0
    },

    mapview: {
        height: vmin(30), 
        flex: 1
    },

    view: {
        flex:1
    },

    header: {
        backgroundColor: "black"
    }
});