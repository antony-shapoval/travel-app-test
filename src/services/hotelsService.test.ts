import type { HotelsMap } from '../models/types';

jest.mock('../api');

const mockHotels: HotelsMap = {
  '7953': {
    id: 7953,
    name: 'Marlin Inn Azur Resort',
    img: 'https://example.com/img.jpg',
    cityId: 712,
    cityName: 'Хургада',
    countryId: '43',
    countryName: 'Єгипет',
  },
};

function makeResponse(data: unknown) {
  return Promise.resolve(new Response(JSON.stringify(data)));
}

describe('hotelsService', () => {
  let fetchHotels: (countryId: string) => Promise<HotelsMap>;
  let getHotelsMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();

    jest.mock('../api', () => ({ getHotels: jest.fn() }));
    getHotelsMock = require('../api').getHotels;
    getHotelsMock.mockImplementation(() => makeResponse(mockHotels));

    fetchHotels = require('./hotelsService').fetchHotels;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches hotels from API', async () => {
    const result = await fetchHotels('43');

    expect(getHotelsMock).toHaveBeenCalledWith('43');
    expect(result).toEqual(mockHotels);
  });

  it('returns cached result on second call', async () => {
    await fetchHotels('43');
    await fetchHotels('43');

    expect(getHotelsMock).toHaveBeenCalledTimes(1);
  });

  it('re-fetches after TTL expires', async () => {
    await fetchHotels('43');

    jest.advanceTimersByTime(6 * 60 * 1000);

    await fetchHotels('43');

    expect(getHotelsMock).toHaveBeenCalledTimes(2);
  });
});
