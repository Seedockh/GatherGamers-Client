import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    activityview: {
        flex: 1, 
        justifyContent: 'center', 
        marginVertical: 50, 
        flexDirection: 'row'
    },

    activity: {
        justifyContent: 'space-around', 
        padding: 0
    },

    container: {
        marginHorizontal: 16, 
        marginTop: 16
    },
    
    view : {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2, 
        marginVertical: 2
    },

    text: {
        fontWeight:"600"
    },

    priceview: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        width: "100%", 
        padding: 2, 
        paddingBottom: 8
    },

    adressview: {
        flexWrap: "wrap", 
        marginRight: 16 
    },

    adresstext: {
        textAlign:"right", 
        marginRight:16
    }
});