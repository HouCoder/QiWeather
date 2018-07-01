import React from 'react';
import {
  Text, View, FlatList, ScrollView,
} from 'react-native';

import styles from './styles';
import { fToC } from '../../utilities/temperature';
import { getDirectionByAngle } from '../../utilities/wind';

export default class DetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name'),
  })

  render() {
    const { navigation } = this.props;
    const { channel } = navigation.getParam('weather');
    const forecasts = channel.item.forecast;
    const { condition } = channel.item;

    const renderForecast = ({ item }) => (
      <View style={styles.forecast}>
        <Text style={styles['forecast.day']}>
          {item.day}
        </Text>
        <Text style={styles['forecast.condition']}>
          {item.text}
        </Text>
        <View style={styles['forecast.range']}>
          <Text style={styles['forecast.high']}>
            {fToC(item.high)}
          </Text>
          <Text style={styles['forecast.low']}>
            {fToC(item.low)}
          </Text>
        </View>
      </View>
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.currentTemperature}>
          <Text style={styles['currentTemperature.text']}>
            {condition.text}
          </Text>
          <Text style={styles['currentTemperature.temperature']}>
            {fToC(condition.temp)}
°
          </Text>
          <Text>
            {channel.item.title}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <FlatList
              style={styles.forecasts}
              scrollEnabled={false}
              data={forecasts}
              keyExtractor={forecast => forecast.date.split(' ').join('-')}
              renderItem={renderForecast}
            />
            <View style={styles.misc}>
              <View style={styles['misc.item']}>
                <Text>
SUNRISE
                </Text>
                <Text style={styles['misc.value']}>
                  {channel.astronomy.sunrise}
                </Text>
              </View>
              <View style={styles['misc.item']}>
                <Text>
SUNSET
                </Text>
                <Text style={styles['misc.value']}>
                  {channel.astronomy.sunset}
                </Text>
              </View>
            </View>
            <View style={styles.misc}>
              <View style={styles['misc.item']}>
                <Text>
WIND
                </Text>
                <Text style={styles['misc.value']}>
                  {getDirectionByAngle(channel.wind.direction)}
                  {' '}
                  {channel.wind.speed}
                  {' '}
m/s
                </Text>
              </View>
              <View style={styles['misc.item']}>
                <Text>
HUMIDITY
                </Text>
                <Text style={styles['misc.value']}>
                  {channel.atmosphere.humidity}
                  {' '}
%
                </Text>
              </View>
            </View>
            <View style={styles.misc}>
              <View style={styles['misc.item']}>
                <Text>
PRESSURE
                </Text>
                <Text style={styles['misc.value']}>
                  <Text style={styles['misc.value']}>
                    {channel.atmosphere.pressure}
                    {' '}
hPa
                  </Text>
                </Text>
              </View>
              <View style={styles['misc.item']}>
                <Text>
VISIBILITY
                </Text>
                <Text style={styles['misc.value']}>
                  {(channel.atmosphere.visibility * 1.609344).toFixed(1)}
                  {' '}
km
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
