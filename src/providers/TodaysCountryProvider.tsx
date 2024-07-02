import dayjs from 'dayjs';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getCities,
  getCountries,
  getCountryCode,
  getCountryData,
} from '../api/fetchDataFromCDN';
import { City, Country, CountryData } from '../types/game';

interface ITodaysCountryContext {
  todaysCountry: CountryData;
  countryList: Country[];
  cityList: City[];
  todaysCity?: City | null;
}

export const TodaysCountryContext = createContext<ITodaysCountryContext | null>(
  null,
);

export const TodaysCountryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  const [cityList, setCityList] = useState<City[]>([]);

  const todaysCity = useMemo(
    () =>
      cityList.filter(
        (c) => c.countryCode === todaysCountry.code && c.capital,
      )[0],
    [cityList, todaysCountry],
  );

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
    const fetchCityList = async () => {
      const cityList = await getCities();
      setCityList(cityList);
    };
    fetchTodaysCountry();
    fetchCountryList();
    fetchCityList();
  }, []);

  if (!todaysCountry.name || !countryList.length) return null;

  return (
    <TodaysCountryContext.Provider
      value={{ todaysCountry, countryList, cityList, todaysCity }}
    >
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
