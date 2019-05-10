import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    content: {
        marginHorizontal: 16, 
        flex: 2
    },

    viewheader: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2
    },

    view: {
        flex: 1, 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2, 
        marginVertical: 16
    },

    textinput: {
        width:"100%", 
        height: 20, 
        borderColor: 'gray', 
        borderBottomWidth: 1, 
        textAlign: "center", 
        marginRight: 4
    },

    viewbutton: {
        marginHorizontal: 16, 
        flex: 1, 
        marginTop: 40
    },
    
    button: {
        marginVertical: 8
    },

    text: {
        color: "black"
    }
})