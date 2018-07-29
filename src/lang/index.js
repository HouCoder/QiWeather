import I18n from 'react-native-i18n';

// Load i18n files
import home from './home';
import addCity from './add-city';

I18n.fallbacks = true;

const collections = {
  ...home,
  ...addCity,
};

const en = {};
const zh = {};

Object.entries(collections).forEach((entry) => {
  const [key, value] = entry;

  en[key] = value[0];
  zh[key] = value[1];
});

I18n.translations = {
  zh,
  en,
};

export default I18n;
