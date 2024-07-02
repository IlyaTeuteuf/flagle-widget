import dayjs from 'dayjs';
import seedrandom from 'seedrandom';

import countryData from '../data/countries';
import { getContinentByCountry } from '../domain/continents';
import { areas } from '../domain/countries.area';

interface Country {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}

const noRepeatStartDate = dayjs('2024-02-04');

const noSmallCountriesStartDate = dayjs('2024-02-04');
const noBackToBackContinentStartDate = dayjs('2024-02-04');

const smallCountryLimit = 5000;

const SmallCountryList = [
  'KY',
  'BM',
  'MH',
  'MP',
  'GL',
  'AS',
  'KN',
  'FO',
  'SX',
  'MC',
  'TC',
  'MF',
  'LI',
  'SM',
  'GI',
  'VG',
  'BQ',
  'PW',
  'CK',
  'AI',
  'TV',
  'WF',
  'NF',
  'NR',
  'BL',
  'SH',
  'PM',
  'MS',
  'FK',
  'NU',
  'TK',
  'VA',
  'CC',
  'AN',
  'GZ',
  'GS',
  'CX',
  'BV',
];

const excludePrimaryDate = dayjs('2024-02-06');
const excludeCountry = ['EG', 'IL', 'PS', 'JO', 'LB', 'SY'];

type DateTime = dayjs.Dayjs;

const filterCountriesByContinent = (
  selection: Country[],
  contintent: string,
): Country[] => {
  if (contintent === 'AF' || contintent === 'AS') {
    return selection.filter(
      (c: Country) => getContinentByCountry(c.code) !== contintent,
    );
  }
  return selection;
};
export function getCountry(dayString: string) {
  const currentDayDate = dayjs(dayString);
  let pickingDate = dayjs('2024-02-01');
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;
  const lastPickDates: Record<string, DateTime> = {};
  let lastContinentPicked: string | undefined;

  let countrySelection = Object.entries(countryData).map((entry) => ({
    code: entry[1].code.toUpperCase(),
    latitude: entry[1].latitude,
    longitude: entry[1].longitude,
    name: entry[0],
  }));

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.format('YYYY-MM-DD');

    if (pickingDate >= noBackToBackContinentStartDate && lastContinentPicked) {
      countrySelection = filterCountriesByContinent(
        countrySelection,
        lastContinentPicked,
      );
    }
    if (pickingDate >= noSmallCountriesStartDate) {
      countrySelection = countrySelection.filter((c: Country) => {
        return SmallCountryList.indexOf(c.code.toUpperCase()) === -1;
      });
    }
    if (pickingDate >= excludePrimaryDate) {
      countrySelection = countrySelection.filter((c: Country) => {
        return excludeCountry.indexOf(c.code.toUpperCase()) === -1;
      });
    }
    let countryIndex = Math.floor(
      seedrandom.alea(pickingDateString)() * countrySelection.length,
    );
    pickedCountry = countrySelection[countryIndex];

    if (pickingDate >= noRepeatStartDate) {
      while (isARepeat(pickedCountry, lastPickDates, pickingDate)) {
        countryIndex = (countryIndex + 1) % countrySelection.length;
        pickedCountry = countrySelection[countryIndex];
      }
    }

    if (areas[pickedCountry.code] < smallCountryLimit) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      smallCountryCooldown = 7;
    }

    lastPickDates[pickedCountry.code] = pickingDate;
    pickingDate = pickingDate.add(1, 'day');
    lastContinentPicked = getContinentByCountry(pickedCountry.code);
  } while (pickingDate <= currentDayDate);

  return pickedCountry;
}

const countriesNoCapitals = [
  'AI',
  'AQ',
  'BM',
  'BS',
  'BV',
  'CR',
  'CX',
  'CZ',
  'EH',
  'FJ',
  'FK',
  'FM',
  'GD',
  'GF',
  'GG',
  'GI',
  'GL',
  'GM',
  'GZ',
  'HK',
  'HM',
  'IO',
  'JE',
  'KN',
  'KY',
  'KZ',
  'LY',
  'MC',
  'MK',
  'MN',
  'MO',
  'MP',
  'MQ',
  'NC',
  'NF',
  'NU',
  'PF',
  'PG',
  'PR',
  'PS',
  'PW',
  'PY',
  'RE',
  'SH',
  'SJ',
  'ST',
  'SZ',
  'TC',
  'TF',
  'TG',
  'TK',
  'TL',
  'TO',
  'TT',
  'VA',
  'VI',
  'VU',
  'XK',
  'YT',
];

function isARepeat(
  pickedCountry: Country | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime,
) {
  if (pickedCountry == null || lastPickDates[pickedCountry.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedCountry.code],
    'day',
  );

  if (countriesNoCapitals.indexOf(pickedCountry.code.toUpperCase()) !== -1) {
    return true;
  }
  return daysSinceLastPick < 100;
}

export function getTodaysCountry(dayString: string): Country {
  return getCountry(dayString);
}
