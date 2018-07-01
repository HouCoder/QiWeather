import React from 'react';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './src/screens/Home';
import AddCityScreen from './src/screens/AddCity';
import DetailScreen from './src/screens/Detail';

const RootStack = createStackNavigator({
  Home: HomeScreen,
  AddCity: AddCityScreen,
  Detail: DetailScreen,
}, {
  initialRouteName: 'Home',
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
