import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    content: {
        marginHorizontal: 16, 
        flex: 2
    },

    headerview: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2
    },

    view: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2, 
        marginVertical: 4
    },

    textinput: {
        width: 100, 
        height: 20, 
        borderColor: 'gray', 
        borderBottomWidth: 1, 
        textAlign: "right", 
        marginRight: 4
    },

    lastinput: {
        width: 150, 
        height: 20, 
        borderColor: 'gray', 
        borderBottomWidth: 1, 
        textAlign: "right", 
        marginRight: 4
    },

    text: {
        color: "black"
    },

    viewbutton: {
        marginHorizontal: 16, 
        flex: 1, 
        marginTop: 40
    },

    button: {
        marginVertical: 8
    }
})