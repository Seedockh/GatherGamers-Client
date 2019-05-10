import { StyleSheet, Platform } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';;

export default StyleSheet.create({
    viewimage: {
        marginTop: 48, 
        marginBottom: 16
    },

    image: {
        width: vmin(40), 
        height: vmin(40), 
        borderRadius: 50, 
        alignSelf: "center"
    },

    view: {
        marginHorizontal: 16, 
        flex: 1, 
        justifyContent: "space-around"
    },

    button: {
        marginVertical: 8
    }
})