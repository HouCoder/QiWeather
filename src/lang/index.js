// Load i18n files
import home from './home';

const collections = {
  ...home,
};

const en = {};
const zh = {};

Object.entries(collections).forEach((entry) => {
  const [key, value] = entry;

  en[key] = value[0];
  zh[key] = value[1];
});

export { zh, en };
