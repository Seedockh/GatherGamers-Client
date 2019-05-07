import React from 'react';
import { Root } from "native-base";
import { Font } from "expo";
import AppNavigator from './src/navigation'

export default class App extends React.Component {

  state = { loading: true }

  async componentWillMount() {
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