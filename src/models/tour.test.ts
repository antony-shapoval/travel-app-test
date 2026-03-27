import { buildTours } from './tour';
import type { PricesMap, HotelsMap } from './types';

const hotels: HotelsMap = {
  '7953': {
    id: 7953,
    name: 'Marlin Inn Azur Resort',
    img: 'https://example.com/img.jpg',
    cityId: 712,
    cityName: 'Хургада',
    countryId: '43',
    countryName: 'Єгипет',
  },
  '18183': {
    id: 18183,
    name: 'Albatros Makadi Resort',
    img: 'https://example.com/img2.jpg',
    cityId: 1262,
    cityName: 'Макаді Бей',
    countryId: '43',
    countryName: 'Єгипет',
  },
};

const makePrice = (id: string, amount: number, hotelID?: string) => ({
  id,
  amount,
  currency: 'usd' as const,
  startDate: '2025-08-27',
  endDate: '2025-09-03',
  hotelID,
});

describe('buildTours', () => {
  it('merges prices with matching hotels', () => {
    const prices: PricesMap = { p1: makePrice('p1', 2000, '7953') };
    const tours = buildTours(prices, hotels);

    expect(tours).toHaveLength(1);
    expect(tours[0].id).toBe('p1');
    expect(tours[0].amount).toBe(2000);
    expect(tours[0].hotel.name).toBe('Marlin Inn Azur Resort');
  });

  it('filters out prices without a matching hotel', () => {
    const prices: PricesMap = { p1: makePrice('p1', 2000, '9999') };
    expect(buildTours(prices, hotels)).toHaveLength(0);
  });

  it('filters out prices with no hotelID', () => {
    const prices: PricesMap = { p1: makePrice('p1', 2000) };
    expect(buildTours(prices, hotels)).toHaveLength(0);
  });

  it('sorts by amount ascending', () => {
    const prices: PricesMap = {
      p1: makePrice('p1', 3500, '7953'),
      p2: makePrice('p2', 1500, '18183'),
      p3: makePrice('p3', 2500, '7953'),
    };
    const tours = buildTours(prices, hotels);

    expect(tours.map((t) => t.amount)).toEqual([1500, 2500, 3500]);
  });

  it('returns empty array when prices map is empty', () => {
    expect(buildTours({}, hotels)).toHaveLength(0);
  });
});
