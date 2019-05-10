import { StyleSheet, Platform } from 'react-native'
import { vmin } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    container: {
        flex: 1
    },

    viewimage: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    },

    image: {
        width: vmin(20), 
        height: vmin(30), 
        flex: 1
    },

    viewsummary: {
        flex: 2, 
        justifyContent: "center", 
        alignItems: "center", 
        marginHorizontal: 16, 
        marginVertical: 16
    },

    viewswitch: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        marginHorizontal: 16
    },

    viewbutton: {
        marginHorizontal: 16, 
        marginTop: 16
    },

    button: {
        marginVertical: 8, 
        backgroundColor: "black"
    }
});