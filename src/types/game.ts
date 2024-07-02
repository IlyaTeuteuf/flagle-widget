export interface CountryData {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
  names: { [lang: string]: string };
  flags: string[];
  continent: string;
  population: number;
  currencyData: {
    code: string;
    name: string;
    nameChoices: string[];
  };
  borders: string[];
  borderMode: 'nearby' | 'bordering';
  autoUpdateBorders: boolean;
  size: number;
  languageData: {
    languageSources?: Array<{
      title: string;
      url: string;
    }>;
    languages?: Array<{
      languageCode: string;
      percentage?: number;
    }>;
  };
  links: Array<{
    type: 'GoogleMaps' | 'Wikipedia';
    url: string;
    languageCode: string;
  }>;
}

export interface City {
  index: number;
  name: string;
  countryCode: string;
  capital: boolean;
  names: {
    [lang: string]: string;
  };
  population?: number;
  sourceLink?: string;
  flag?: string;
}

export interface Country {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
  names?: { [key: string]: string };
}
