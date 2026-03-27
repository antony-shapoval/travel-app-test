import type { Hotel, PricesMap, HotelsMap } from './types';

export type TourItem = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotel: Hotel;
};

export function buildTours(prices: PricesMap, hotels: HotelsMap): TourItem[] {
  return Object.values(prices)
    .filter((price): price is typeof price & { hotelID: string } =>
      Boolean(price.hotelID && hotels[price.hotelID])
    )
    .map((price) => ({
      id: price.id,
      amount: price.amount,
      currency: price.currency,
      startDate: price.startDate,
      endDate: price.endDate,
      hotel: hotels[price.hotelID],
    }))
    .sort((a, b) => a.amount - b.amount);
}
