import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },

  savedCity: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },

  'savedCity.left': {
    position: 'absolute',
  },

  'savedCity.cityName': {
    fontSize: 28,
  },

  'savedCity.oneWordCondition': {
    justifyContent: 'center',
    flex: 1,
  },

  'savedCity.oneWordCondition.text': {
    fontSize: 20,
    textAlign: 'center',
  },

  'savedCity.temperature': {
    fontSize: 38,
    position: 'absolute',
    right: 0,
  },

  horizontelCenter: {
    alignItems: 'center',
  },

  yahooAttribution: {
    marginVertical: 20,
    width: 100,
    height: 22,
  },
});
