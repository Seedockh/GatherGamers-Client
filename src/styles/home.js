import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
        alignItems: 'center'
    }
});