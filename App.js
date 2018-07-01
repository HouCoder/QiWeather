import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { YellowBox } from 'react-native';

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

// Temporary disable the warning - https://github.com/facebook/react-native/issues/18868
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

export default () => <RootStack />;
