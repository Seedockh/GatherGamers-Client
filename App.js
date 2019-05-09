import React from 'react';
import { Root } from "native-base";
import { Font, Permissions } from "expo";
import * as Persmissions from 'expo-permissions';
import AppNavigator from './src/navigation'

export default class App extends React.Component {

  state = { loading: true, allowGeoloc: false }

  async checkGeolocation() {
    const { Location, Permissions } = Expo;
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      this.setState({ allowGeoloc: true })
      return Location.getCurrentPositionAsync({enableHighAccuracy: true});
    } else {
      alert('Location permission not granted');
    }
  }

  async componentWillMount() {
    await this.checkGeolocation();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false })
  }

  render() {

    if (this.state.loading) {
      return <Expo.AppLoading />;
    }

    return (
      <Root>
        <AppNavigator ref={navigatorRef => this.navigatorRef = navigatorRef} />
      </Root>
    )
  }
}
