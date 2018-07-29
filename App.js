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

YellowBox.ignoreWarnings([
  // https://github.com/facebook/react-native/issues/18868
  'Warning: isMounted(...) is deprecated',
  // https://github.com/facebook/react-native/issues/18201#issuecomment-390427365
  'Class RCTCxxModule',
  // https://github.com/facebook/react-native/issues/19133
  'Module RCTImageLoader',
]);

export default () => <RootStack />;
