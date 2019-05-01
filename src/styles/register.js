import { StyleSheet, Platform } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';;

export default StyleSheet.create({
    keyboardAvoiding: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
        alignItems: 'center',
    },

    mainContainer: {
        justifyContent: "center", 
        alignItems: "center", 
        flex: 1,
    },

    logoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: vmin(60),
        height: vmin(40),
        marginBottom: vmin(5)
    },

    logo: {
        width: vmin(40),
        height: vmin(40)
    },

    item: {
        width: "60%", 
        alignSelf: "center"
    },

    button: {
        backgroundColor: "#000", 
        width: vmin(60), 
        justifyContent: 'center',
        alignSelf: 'center'
    },

    buttonContainer: {
        marginTop: 36,
        justifyContent: "center",
        width: vmin(100),
    },

    connectText: {
        color: 'white',
    },
});