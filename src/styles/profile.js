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

    switch: {
        marginHorizontal: 16,
        marginVertical: 24,
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center"
    },

    button: {
        marginVertical: 8
    }
})
