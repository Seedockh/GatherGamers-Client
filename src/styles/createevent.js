import { StyleSheet } from 'react-native';
import { vmin } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    scrollview: {
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

    viewname: {
        marginHorizontal: 16, 
        marginVertical: 4, 
        marginTop: 24
    },
    
    textinput: {
        width: "100%", 
        borderColor: 'gray', 
        borderBottomWidth: 1, 
        textAlign: "center", 
        fontSize: 24
    },

    view1: {
        marginHorizontal: 16, 
        marginVertical: 4, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center"
    },

    type: {
        flex: 2
    },

    text: {
        flex: 1
    },

    textinput2: {
        width: 40, 
        height: 20, 
        borderColor: 'gray', 
        borderBottomWidth: 1, 
        textAlign: "right", 
        marginRight: 4
    },

    viewcash: {
        marginHorizontal: 16, 
        marginVertical: 4, 
        marginBottom: 8, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center"
    },

    viewadresse: {
        marginHorizontal: 16, 
        marginVertical: 4 
    },

    viewevent: {
        marginHorizontal: 16, 
        marginTop: 36
    },

    adresseinput: {
        borderColor: 'gray', 
        borderBottomWidth: 1
    }
})