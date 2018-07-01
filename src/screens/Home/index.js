import React from 'react';
import {
  Text, View, Button, FlatList, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import queryString from 'query-string';
import axios from 'axios';
import momentTimezone from 'moment-timezone';

// https://github.com/dancormier/react-native-swipeout/issues/267
import Swipeout from 'react-native-swipeout';

import appConfig from '../../config/app';
import styles from './styles';
import * as storage from '../../utilities/storage';
import { fToC } from '../../utilities/temperature';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this.refresh();
  }

  getCurrentWeatherInfos(cityList) {
    const generateYql = place => [
      'select * from weather.forecast where woeid in',
      `(select woeid from geo.places(1) where text="${place}")`,
    ].join(' ');

    const currentWeatherQueue = cityList.map((item) => {
      const parameters = queryString.stringify({
        format: 'json',
        q: generateYql(item.full_name),
      });
      const weatherHttpEndpoint = `${appConfig.yahoo.weatherHttpEndpoint}?${parameters}`;

      return axios.get(weatherHttpEndpoint);
    });

    axios.all(currentWeatherQueue).then(axios.spread((...response) => {
      cityList.forEach((city, index) => {
        city.weather = response[index].data.query.results;
        city.weather.date = Date.now();
      });

      this.setState({
        list: cityList,
      });

      // Save to localStorage
      storage.setSelectedCities(cityList);
    }));
  }

  refresh = async () => {
    const storedData = await storage.getSelectedCities();

    this.setState({
      list: storedData,
    });

    this.getCurrentWeatherInfos(storedData);
  }

  gotoAddCityScreen() {
    this.props.navigation.navigate('AddCity', {
      refresh: this.refresh.bind(this),
    });
  }

  handleDeletation(item) {
    // Delete from state
    this.setState((prevState) => {
      const newList = prevState.list
        .filter(city => city.place_id !== item.place_id);

      // Save to localStorage
      storage.setSelectedCities(newList);

      return {
        list: newList,
      };
    });
  }

  gotoDetailScreen(item) {
    this.props.navigation.navigate('Detail', item);
  }

  render() {
    const renderItem = ({ item }) => {
      const swipeoutBtns = [{
        text: 'Delete',
        onPress: () => this.handleDeletation(item),
        backgroundColor: '#FF0000',
      }];

      const getTimeByTimezoneId = timezone => momentTimezone().tz(timezone).format('LT');

      return (
        <Swipeout right={swipeoutBtns} backgroundColor="#E9E9EF">
          <TouchableOpacity onPress={() => this.gotoDetailScreen(item)}>
            <View style={styles.savedCity}>
              <View style={styles['savedCity.left']}>
                <Text>
                  { getTimeByTimezoneId(item.timezoneId) }
                </Text>
                <Text style={styles['savedCity.cityName']}>
                  {item.name}
                </Text>
              </View>
              <View style={styles['savedCity.oneWordCondition']}>
                <Text style={styles['savedCity.oneWordCondition.text']}>
                  {item.weather === undefined ? '--' : item.weather.channel.item.condition.text}
                </Text>
              </View>
              <Text style={styles['savedCity.temperature']}>
                {item.weather === undefined ? '--' : fToC(item.weather.channel.item.condition.temp)}
°
              </Text>
            </View>
          </TouchableOpacity>
        </Swipeout>
      );
    };

    const gotoAddCityScreen = this.gotoAddCityScreen.bind(this);

    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.list.length > 0
            && (
            <View>
              <FlatList
                scrollEnabled={false}
                data={this.state.list}
                extraData={this.state}
                keyExtractor={item => item.place_id + item.date}
                renderItem={renderItem}
              />
              <View style={styles.horizontelCenter}>
                <Image
                  style={styles.yahooAttribution}
                  // eslint-disable-line global-require
                  source={require('./purple_retina.png')}
                />
              </View>
            </View>
            )
          }
          <Button onPress={gotoAddCityScreen} title="Add City" />
        </ScrollView>
      </View>
    );
  }
}
