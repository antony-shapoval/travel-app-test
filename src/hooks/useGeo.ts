import { useState, useEffect, useCallback } from 'react';
import { fetchCountries, fetchGeoSearch } from '../services/geoService';
import type { CountriesMap, GeoResponse } from '../models/types';

export function useCountries() {
  const [countries, setCountries] = useState<CountriesMap>({});

  const load = useCallback(async () => {
    const data = await fetchCountries();
    setCountries(data);
  }, []);

  return { countries, load };
}

export function useGeoSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<GeoResponse>({});

  useEffect(() => {
    if (!enabled) return;
    fetchGeoSearch(query).then(setResults);
  }, [query, enabled]);

  return results;
}
