import type { PricesMap } from '../models/types';

jest.mock('../api');

const mockPrices: PricesMap = {
  p1: {
    id: 'p1',
    amount: 2000,
    currency: 'usd',
    startDate: '2025-08-27',
    endDate: '2025-09-03',
    hotelID: '7953',
  },
};

const past = () => new Date(Date.now() - 1).toISOString();
const future = (ms: number) => new Date(Date.now() + ms).toISOString();

describe('searchService', () => {
  let search: (countryId: string) => Promise<PricesMap>;
  let startSearchPrices: jest.Mock;
  let getSearchPrices: jest.Mock;
  let stopSearchPrices: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('../api', () => ({
      startSearchPrices: jest.fn(),
      getSearchPrices: jest.fn(),
      stopSearchPrices: jest.fn(),
    }));

    const api = require('../api');
    startSearchPrices = api.startSearchPrices;
    getSearchPrices = api.getSearchPrices;
    stopSearchPrices = api.stopSearchPrices;

    search = require('./searchService').search;
  });

  it('resolves with prices after successful poll', async () => {
    startSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ token: 'tok', waitUntil: past() })))
    );
    getSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ prices: mockPrices })))
    );

    const result = await search('43');

    expect(startSearchPrices).toHaveBeenCalledWith('43');
    expect(getSearchPrices).toHaveBeenCalledWith('tok');
    expect(result).toEqual(mockPrices);
  });

  it('retries poll when API returns 425', async () => {
    startSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ token: 'tok', waitUntil: past() })))
    );
    getSearchPrices
      .mockImplementationOnce(() =>
        Promise.reject(
          new Response(
            JSON.stringify({ code: 425, error: true, message: 'Not ready', waitUntil: past() })
          )
        )
      )
      .mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({ prices: mockPrices })))
      );

    const result = await search('43');

    expect(getSearchPrices).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockPrices);
  });

  it('retries up to 2 times on non-425 error then rejects', async () => {
    startSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ token: 'tok', waitUntil: past() })))
    );
    getSearchPrices.mockImplementation(() =>
      Promise.reject(
        new Response(JSON.stringify({ code: 404, error: true, message: 'Not found' }))
      )
    );

    await expect(search('43')).rejects.toThrow('Not found');
    expect(getSearchPrices).toHaveBeenCalledTimes(3);
  });

  it('cancels previous search when new one starts', async () => {
    startSearchPrices
      .mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({ token: 'old-tok', waitUntil: future(10_000) })))
      )
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({ token: 'new-tok', waitUntil: past() })))
      );
    getSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ prices: mockPrices })))
    );
    stopSearchPrices.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ status: 'cancelled', message: 'ok' })))
    );

    let firstError: unknown;
    const first = search('43').catch((e) => { firstError = e; });

    await new Promise((resolve) => setTimeout(resolve, 0));

    await search('115');
    await first;

    expect(stopSearchPrices).toHaveBeenCalledWith('old-tok');
    expect(firstError).toMatchObject({ name: 'AbortError' });
  });
});
