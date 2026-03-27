import { useState, useEffect } from 'react';
import { fetchHotels } from '../services/hotelsService';
import { buildTours } from '../models/tour';
import type { PricesMap } from '../models/types';
import type { TourItem } from '../models/tour';

type ToursState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; tours: TourItem[] };

export function useTours(prices: PricesMap | null, countryId: string | null): ToursState {
  const [toursState, setToursState] = useState<ToursState>({ status: 'idle' });

  useEffect(() => {
    if (!prices || !countryId) {
      setToursState({ status: 'idle' });
      return;
    }

    setToursState({ status: 'loading' });

    fetchHotels(countryId).then((hotels) => {
      setToursState({ status: 'ready', tours: buildTours(prices, hotels) });
    });
  }, [prices, countryId]);

  return toursState;
}
