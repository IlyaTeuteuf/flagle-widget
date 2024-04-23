import { City, Country, CountryData } from '../types/game';

export const CDN_URL = 'https://teuteuf-dashboard-assets.pages.dev/data/';
const _cache: { [url: string]: string } = {};

async function fetchJSONFromCDN(endpoint: string) {
  if (_cache[endpoint]) {
    return _cache[endpoint];
  }

  // Fetch data, and cache it
  const data: any = await fetch(CDN_URL + endpoint)
    .then((res) => res.json())
    .catch((e) => null);
  _cache[endpoint] = data;
  return data;
}

export async function getCountryCode(dayString: string): Promise<string> {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/flagle/games/2024/2024-03-01.json
  const [year] = dayString.split(/-/);
  const data = await fetchJSONFromCDN(`flagle/games/${year}/${dayString}.json`);
  return data.countryCode;
}

export async function getCountryData(
  countryCode: string,
): Promise<CountryData> {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/countries/gb.json
  const data = await fetchJSONFromCDN(
    `common/countries/${countryCode.toLowerCase()}.json`,
  );
  return data;
}

export function getCountryShapeSvgUrl(
  countryCode: string,
  cacheBuster?: string,
): string {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/country-shapes/gb.svg
  const cacheParam = cacheBuster ? `?ver=${cacheBuster}` : '';
  return `${CDN_URL}common/country-shapes/${countryCode.toLowerCase()}.svg${cacheParam}`;
}

export function getCountryFlagSvgUrl(
  countryCode: string,
  cacheBuster?: string,
): string {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/flags/gb.svg
  const cacheParam = cacheBuster ? `?ver=${cacheBuster}` : '';
  return `${CDN_URL}common/flags/${countryCode.toLowerCase()}.svg${cacheParam}`;
}

export async function getCities(langCode?: string): Promise<Array<City>> {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/cities.json
  const data = await fetchJSONFromCDN(`common/cities.json`);
  if (langCode) {
    // Localise name field
    for (const c of data) {
      if (c.names) {
        c.name = c.names[langCode] || c.names['en'] || c.name;
      }
    }
  }
  return data;
}

export async function getCountries(langCode?: string): Promise<Array<Country>> {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/countries.json
  const data = await fetchJSONFromCDN(`common/countries.json`);
  if (langCode) {
    // Localise name field
    for (const c of data) {
      if (c.names) {
        c.name = c.names[langCode] || c.names['en'] || c.name;
      }
    }
  }
  return data;
}

// export async function getLanguages(langCode?: string): Promise<Array<LocalizedLanguage>> {
//     // Example: https://teuteuf-dashboard-assets.pages.dev/data/common/languages.json
//     const data = await fetchJSONFromCDN(`common/languages.json`);
//     if (langCode) {
//         // Localise name field
//         for (const c of data) {
//             if (c.names) {
//                 c.name = c.names[langCode] || c.names["en"] || c.name;
//             }
//         }
//     }
//     return data;
// }

export async function getVersion(): Promise<number> {
  // Example: https://teuteuf-dashboard-assets.pages.dev/data/version.json
  const data = (await fetchJSONFromCDN(`version.json`)) as number;
  return data;
}
