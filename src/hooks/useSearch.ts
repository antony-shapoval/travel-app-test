import { useState, useCallback } from 'react';
import { search } from '../services/searchService';
import type { PricesMap, SearchState, SelectedDestination } from '../models/types';

export function useSearch() {
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  const run = useCallback(async (destination: SelectedDestination) => {
    const countryId = destination.countryId ?? String(destination.id);

    setState({ status: 'loading' });

    try {
      const prices = await search(countryId);
      setState({ status: 'success', prices, countryId });
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return;
      setState({ status: 'error', message: (e as Error).message });
    }
  }, []);

  return { state, run };
}
