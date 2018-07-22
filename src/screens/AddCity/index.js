import React from 'react';
import {
  Text, View, TextInput, FlatList, Image,
} from 'react-native';

// Pure npm package https://www.npmjs.com/package/query-string
import queryString from 'query-string';
import axios from 'axios';

import appConfig from '../../config/app';
import credentials from '../../../.credentials';
import styles from './styles';
import * as storage from '../../utilities/storage';

export default class AddCityScreen extends React.Component {
  static navigationOptions = {
    title: 'Add City',
  };

  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'Please add a city',
      autocompleteSuggestions: [],
    };
  }

  saveSelected = async (selected) => {
    // Get existing saved places.
    const saved = await storage.getSelectedCities();
    const parameters = queryString.stringify({
      placeid: selected.place_id,
      key: credentials.google,
    });

    const isSelectedExist = saved.find(city => city.place_id === selected.place_id) !== undefined;
    if (isSelectedExist) {
      // Already exist, back to previous page.
      return this.props.navigation.navigate('Home');
    }

    const placeDetailHtppEndpoint = `${appConfig.google.placeDetailHtppEndpoint}?${parameters}`;

    // Get selected details by placeid from Google place API.
    return axios.get(placeDetailHtppEndpoint)
      .then((placeDetail) => {
        const { location } = placeDetail.data.result.geometry;
        const googleTimeZoneParameters = queryString.stringify({
          location: `${location.lat},${location.lng}`,
          timestamp: Date.now() / 1000,
          key: credentials.google,
        });

        const timeZoneAPI = `${appConfig.google.timeZoneAPIHttpEndpoint}?${googleTimeZoneParameters}`;

        // Get selected time zone from Google place API.
        axios.get(timeZoneAPI)
          .then(async (response) => {
            const apiResponse = response.data;

            if (apiResponse.status !== 'OK') {
              // TODO: Alert user
              return Promise.reject(new Error('Unable to find the timezone.'));
            }

            const { terms } = selected;
            const item = {
              name: terms[0].value,
              place_id: selected.place_id,
              country: terms[terms.length - 1].value,
              full_name: selected.description,
              timezoneId: apiResponse.timeZoneId,
            };

            // Save to localstorage
            await storage.addCity(item);

            // Refresh & back to previous page.
            const { navigation } = this.props;
            navigation.getParam('refresh')();
            return navigation.navigate('Home');
          }).catch(error => console.log(error));
      }).catch(error => console.log(error));
  }

  handleTextChange(city) {
    // Abort exisiting request if has
    if (this.cancellation) {
      this.cancellation.cancel();
      this.cancellation = null;
    }

    const parameters = queryString.stringify({
      input: city,
      // Look cities only
      types: ['(cities)'],
      language: 'en',
      key: credentials.google,
    });

    const autocompleteHttpEndpoint = `${appConfig.google.autocompleteHttpEndpoint}?${parameters}`;
    this.cancellation = axios.CancelToken.source();

    // Get place suggestions from Google place autocomplete.
    axios.get(autocompleteHttpEndpoint, { cancelToken: this.cancellation.token })
      .then((jsonResponse) => {
        console.log(jsonResponse.data.predictions);
        this.setState({
          autocompleteSuggestions: jsonResponse.data.predictions,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log(`Request canceled, keyword: ${city}`);
        } else {
          console.log(error);
        }
      });
  }

  render() {
    const renderItem = ({ item }) => (
      <View style={styles.placeSuggestion}>
        <Text style={styles['placeSuggestion.text']} onPress={() => this.saveSelected(item)}>
          {item.description}
        </Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoFocus={true}
          placeholder={this.state.placeholder}
          onChangeText={this.handleTextChange.bind(this)}
          // https://github.com/facebook/react-native/issues/5424#issuecomment-173122119
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        {this.state.autocompleteSuggestions.length > 0
          && (
          <View>
            <FlatList
              style={styles.placeSuggestions}
              data={this.state.autocompleteSuggestions}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
            <Image
              style={styles.googleAttribution}
              source={require('./powered_by_google_on_white.png')}
            />
          </View>
          )
        }
      </View>
    );
  }
}
