import {
  startSearchPrices,
  getSearchPrices,
  stopSearchPrices,
} from '../api';
import type { PricesMap, ErrorResponse } from '../models/types';

const MAX_RETRIES = 2;

let activeToken: string | null = null;
let activeAbortController: AbortController | null = null;

function waitUntilTime(isoTime: string, signal: AbortSignal): Promise<void> {
  const delay = Math.max(0, new Date(isoTime).getTime() - Date.now());
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delay);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Search cancelled', 'AbortError'));
    });
  });
}

async function poll(
  token: string,
  waitUntil: string,
  retryCount: number,
  signal: AbortSignal
): Promise<PricesMap> {
  await waitUntilTime(waitUntil, signal);

  try {
    const resp = await getSearchPrices(token);
    const data = await resp.json();
    activeToken = null;
    return data.prices as PricesMap;
  } catch (raw) {
    const error: ErrorResponse = await (raw as Response).json();

    if (error.code === 425 && error.waitUntil) {
      return poll(token, error.waitUntil, retryCount, signal);
    }

    if (retryCount < MAX_RETRIES) {
      return poll(token, waitUntil, retryCount + 1, signal);
    }

    activeToken = null;
    throw new Error(error.message);
  }
}

export async function search(countryId: string): Promise<PricesMap> {
  if (activeAbortController) {
    activeAbortController.abort();
  }
  if (activeToken) {
    stopSearchPrices(activeToken).catch(() => {});
    activeToken = null;
  }

  const controller = new AbortController();
  activeAbortController = controller;

  const startResp = await startSearchPrices(countryId);
  const startData = await startResp.json();
  const { token, waitUntil } = startData;
  activeToken = token;

  return poll(token, waitUntil, 0, controller.signal);
}

export function cancelSearch(): void {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
  if (activeToken) {
    stopSearchPrices(activeToken).catch(() => {});
    activeToken = null;
  }
}
