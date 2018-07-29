import React from 'react';
import {
  Text, View, TextInput, FlatList, Image, Alert,
} from 'react-native';

import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

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
      placeholder: 'Search',
      autocompleteSuggestions: [],
      isSaving: false,
    };
  }

  saveSelected = async (selected) => {
    // Get existing saved places.
    const saved = await storage.getSelectedCities();
    const isSelectedExist = saved.find(city => city.place_id === selected.place_id) !== undefined;

    const { navigation } = this.props;

    if (isSelectedExist) {
      // Already exist, go back to home page.
      return navigation.navigate('Home');
    }

    this.setState({
      isSaving: true,
    });

    // Get selected details by placeid from Google place API.
    return axios.get(appConfig.google.placeDetailHtppEndpoint, {
      params: {
        placeid: selected.place_id,
        key: credentials.google,
      },
    })
      .then((placeDetail) => {
        const placeDetailResponse = placeDetail.data;

        if (placeDetailResponse.status !== 'OK') {
          Alert.alert('Unable to find the place detail');
          return Promise.reject(new Error('Unable to find the detail.'));
        }

        const { location } = placeDetailResponse.result.geometry;

        // Get selected time zone from Google place API.
        axios.get(appConfig.google.timeZoneAPIHttpEndpoint, {
          params: {
            location: `${location.lat},${location.lng}`,
            timestamp: Date.now() / 1000,
            key: credentials.google,
          }
        })
          .then(async (response) => {
            const apiResponse = response.data;

            if (apiResponse.status !== 'OK') {
              Alert.alert('Unable to find the timezone.');
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
            navigation.getParam('refresh')();

            this.setState({
              isSaving: false,
            });
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
    this.cancellation = axios.CancelToken.source();

    // Get place suggestions from Google place autocomplete.
    axios.get(appConfig.google.autocompleteHttpEndpoint, {
      params: {
        input: city,
        // Look for cities only
        types: ['(cities)'],
        language: 'en',
        key: credentials.google,
      },
      cancelToken: this.cancellation.token,
    })
      .then((suggestionsResponse ) => {
        this.setState({
          autocompleteSuggestions: suggestionsResponse.data.predictions,
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
        <Spinner visible={this.state.isSaving} textContent="Loading..." textStyle={{ color: '#FFF' }} />
        <TextInput
          style={styles.input}
          autoFocus
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
