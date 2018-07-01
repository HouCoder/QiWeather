import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  currentTemperature: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  'currentTemperature.text': {
    fontSize: 30,
  },
  'currentTemperature.temperature': {
    fontSize: 80,
  },
  forecasts: {
    borderBottomWidth: 1,
    borderBottomColor: '#00A4CC',
    borderTopWidth: 1,
    borderTopColor: '#00A4CC',
  },

  forecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  'forecast.range': {
    flexDirection: 'row',
  },
  'forecast.day': {
    fontSize: 20,
  },
  'forecast.condition': {
    fontSize: 20,
  },
  'forecast.high': {
    fontSize: 20,
  },
  'forecast.low': {
    fontSize: 20,
    marginLeft: 5,
  },
  misc: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  'misc.item': {
    width: '50%',
  },
  'misc.value': {
    fontSize: 30,
  },
});
