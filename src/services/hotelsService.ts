import { getHotels } from '../api';
import type { HotelsMap } from '../models/types';

const TTL = 5 * 60 * 1000;

const cache = new Map<string, { data: HotelsMap; expiresAt: number }>();

export async function fetchHotels(countryId: string): Promise<HotelsMap> {
  const cached = cache.get(countryId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const resp = await getHotels(countryId);
  const data: HotelsMap = await resp.json();

  cache.set(countryId, { data, expiresAt: Date.now() + TTL });
  return data;
}
