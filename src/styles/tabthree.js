import { StyleSheet } from 'react-native'
import { vmin } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    scrollview: {
        flex: 1
    },
    container: {
        borderWidth: 2, 
        borderColor: "#000", 
        marginHorizontal: 16, 
        marginVertical: 4, 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 10
    },
    view: {
        padding: 8
    },
    picture: {
        width: vmin(20), 
        height: vmin(20)
    },
    viewname: {
        marginBottom: 4,
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "white", 
        marginHorizontal: 8
    },
    name: {
        fontWeight: "500", 
        textAlign: "center"
    },
    textnonotif: {
        fontSize: 20, 
        textAlign: 'center', 
        marginTop: 20 
    }
});