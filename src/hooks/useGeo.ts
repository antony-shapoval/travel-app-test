import { useState, useEffect, useRef } from 'react';
import { fetchCountries, fetchGeoSearch } from '../services/geoService';
import type { CountriesMap, GeoResponse } from '../models/types';

export function useCountries() {
  const [countries, setCountries] = useState<CountriesMap>({});

  const load = async () => {
    const data = await fetchCountries();
    setCountries(data);
  };

  return { countries, load };
}

export function useGeoSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<GeoResponse>({});
  const prevQuery = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (prevQuery.current === query) return;
    prevQuery.current = query;

    fetchGeoSearch(query).then(setResults);
  }, [query, enabled]);

  return results;
}
