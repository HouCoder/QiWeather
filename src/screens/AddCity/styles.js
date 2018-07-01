import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },

  placeSuggestions: {
    flexGrow: 0,
  },

  placeSuggestion: {
    padding: 10,
  },

  googleAttribution: {
    marginLeft: 10,
    marginTop: 20,
  },
});
