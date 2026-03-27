import { getCountries, searchGeo } from '../api';
import type { CountriesMap, GeoResponse } from '../models/types';

export async function fetchCountries(): Promise<CountriesMap> {
  const resp = await getCountries();
  return resp.json();
}

export async function fetchGeoSearch(query: string): Promise<GeoResponse> {
  const resp = await searchGeo(query);
  return resp.json();
}
