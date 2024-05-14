import dayjs from 'dayjs';
import { createContext, FC, useContext, useEffect, useState } from 'react';

import {
  getCountries,
  getCountryCode,
  getCountryData,
} from '../api/fetchDataFromCDN';
import { Country, CountryData } from '../types/game';

interface ITodaysCountryContext {
  todaysCountry: CountryData;
  countryList: Country[];
}

export const TodaysCountryContext = createContext<ITodaysCountryContext | null>(
  null,
);

export const TodaysCountryProvider: FC = ({ children }) => {
  const [todaysCountry, setTodaysCountry] = useState<CountryData>({
    code: '',
    latitude: 0,
    longitude: 0,
    name: '',
    names: {},
    flags: [],
    continent: '',
    population: 0,
    currencyData: {
      code: '',
      name: '',
      nameChoices: [],
    },
    borders: [],
    borderMode: 'nearby',
    autoUpdateBorders: false,
    size: 0,
    languageData: {
      languageSources: [],
      languages: [],
    },
    links: [],
  });
  const [countryList, setCountryList] = useState<Country[]>([]);

  useEffect(() => {
    const fetchTodaysCountry = async () => {
      const dayString = dayjs(Date.now()).format('YYYY-MM-DD');
      const countryCode = await getCountryCode(dayString);
      const countryData = await getCountryData(countryCode);
      setTodaysCountry(countryData);
    };
    const fetchCountryList = async () => {
      const countryList = await getCountries();
      setCountryList(countryList);
    };
    fetchTodaysCountry();
    fetchCountryList();
  }, []);

  if (!todaysCountry.name || !countryList.length) return null;

  return (
    <TodaysCountryContext.Provider value={{ todaysCountry, countryList }}>
      {children}
    </TodaysCountryContext.Provider>
  );
};

export const useTodaysCountry = () => {
  const context = useContext(TodaysCountryContext);
  if (!context) {
    throw new Error(
      'useTodaysCountry must be used within a TodaysCountryProvider',
    );
  }
  return context;
};
