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
        marginTop: 36,
        justifyContent: "center",
        width: vmin(100),
        backgroundColor: "black"
    }
})