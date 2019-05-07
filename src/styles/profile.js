import { StyleSheet, Platform } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';;

export default StyleSheet.create({
    disconnectText: {
        color: 'white',
    },
    button: {
        backgroundColor: "black", 
        width: vmin(60), 
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonContainer: {
        justifyContent: "center",
        width: vmin(80),
        backgroundColor: "black"
    },
    formContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: vmin(15)
    }
})