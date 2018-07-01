import { AsyncStorage } from 'react-native';

const storageKey = 'selectedCities';

export async function getSelectedCities() {
  let selectedCities;

  try {
    const saved = await AsyncStorage.getItem(storageKey);
    if (saved !== null) {
      selectedCities = saved;
    } else {
      selectedCities = '[]';
    }
  } catch (error) {
    console.log(error);
  }
  return JSON.parse(selectedCities);
}

export async function setSelectedCities(cities) {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(cities));
  } catch (error) {
    console.log(error);
  }
}

export async function addCity(city) {
  // Get exisiting cities
  const exisitingCities = await getSelectedCities();

  await setSelectedCities([...exisitingCities, city]);
}
