import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 4 — Zakat across assets and currencies.
 *
 * The calculator holds the kinds of wealth people actually have — cash, bank
 * balances, gold and silver by weight, investments, business stock and money
 * owed — subtracts what falls due, compares what is left with the nisab, and
 * takes 2.5% of the balance. Prices and exchange rates are fetched live where
 * they are reachable and cached on the device when they are not; a woman or a
 * man can also type in the gold and silver prices their own market uses.
 *
 * This is arithmetic, not a ruling. What counts as zakatable, how business
 * stock is valued and how debts are treated differ between schools and
 * situations, so the result is a careful estimate to take to a scholar.
 */

export const ZAKAT_RATE = 0.025;
export const NISAB_GOLD_GRAMS = 85;
export const NISAB_SILVER_GRAMS = 595;
const GRAMS_PER_OUNCE = 31.1034768;

export type Currency = { code: string; symbol: string; name: string };

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' },
  { code: 'JOD', symbol: 'JOD', name: 'Jordanian Dinar' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  { code: 'DZD', symbol: 'DZD', name: 'Algerian Dinar' },
  { code: 'IQD', symbol: 'IQD', name: 'Iraqi Dinar' },
];

export type AssetKind = 'cash' | 'bank' | 'gold' | 'silver' | 'investments' | 'business' | 'receivables' | 'other';

export type ZakatAsset = {
  id: string;
  kind: AssetKind;
  label: string;
  /** Value in the chosen currency, except gold and silver, which are grams. */
  amount: number;
};

export type ZakatLiability = {
  id: string;
  label: string;
  amount: number;
};

export type NisabBasis = 'gold' | 'silver';

export type ZakatHistoryEntry = {
  id: string;
  at: number;
  currency: string;
  gross: number;
  net: number;
  nisab: number;
  zakat: number;
  above: boolean;
  basis: NisabBasis;
};

export type MetalPrices = {
  /** Per gram, in the selected currency. */
  goldPerGram: number;
  silverPerGram: number;
  /** Set when the numbers came from the last successful fetch. */
  fetchedAt: number | null;
  /** True once the user has typed their own prices. */
  custom: boolean;
};

export type MarketData = {
  rates: Record<string, number>;
  goldUsdPerOunce: number;
  silverUsdPerOunce: number;
  fetchedAt: number | null;
};

export type ZakatState = {
  currency: string;
  basis: NisabBasis;
  assets: ZakatAsset[];
  liabilities: ZakatLiability[];
  prices: MetalPrices;
  history: ZakatHistoryEntry[];
};

const KEY = 'deen-zakat-v1';
const RATES_KEY = 'deen-zakat-rates-v1';

const ASSET_TEMPLATE: { kind: AssetKind; label: string }[] = [
  { kind: 'cash', label: 'Cash at home' },
  { kind: 'bank', label: 'Bank and savings' },
  { kind: 'gold', label: 'Gold (grams)' },
  { kind: 'silver', label: 'Silver (grams)' },
  { kind: 'investments', label: 'Investments and shares' },
  { kind: 'business', label: 'Business goods and stock' },
  { kind: 'receivables', label: 'Money owed to you' },
  { kind: 'other', label: 'Other assets' },
];

const LIABILITY_TEMPLATE = [{ label: 'Debts and bills due' }, { label: 'Borrowed money' }];

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultState(): ZakatState {
  return {
    currency: 'USD',
    basis: 'gold',
    assets: ASSET_TEMPLATE.map((item) => ({ id: id(item.kind), ...item, amount: 0 })),
    liabilities: LIABILITY_TEMPLATE.map((item) => ({ id: id('due'), ...item, amount: 0 })),
    prices: { goldPerGram: 0, silverPerGram: 0, fetchedAt: null, custom: false },
    history: [],
  };
}

let state: ZakatState = defaultState();
let market: MarketData = { rates: {}, goldUsdPerOunce: 0, silverUsdPerOunce: 0, fetchedAt: null };

const listeners = new Set<(next: ZakatState) => void>();
const marketListeners = new Set<(next: MarketData) => void>();

function emit(next: ZakatState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

function emitMarket(next: MarketData) {
  market = next;
  marketListeners.forEach((listener) => listener(market));
}

async function persist(next: ZakatState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}


export function subscribeZakat(listener: (next: ZakatState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeMarket(listener: (next: MarketData) => void) {
  marketListeners.add(listener);
  return () => {
    marketListeners.delete(listener);
  };
}

export function useZakat(): ZakatState {
  const [value, setValue] = useState<ZakatState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeZakat(setValue);
  }, []);
  return value;
}

export function useMarket(): MarketData {
  const [value, setValue] = useState<MarketData>(market);
  useEffect(() => {
    setValue(market);
    return subscribeMarket(setValue);
  }, []);
  return value;
}

export async function loadZakatState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<ZakatState>;
      const base = defaultState();
      state = {
        currency: typeof saved.currency === 'string' ? saved.currency : base.currency,
        basis: saved.basis === 'silver' ? 'silver' : 'gold',
        assets: Array.isArray(saved.assets) && saved.assets.length ? saved.assets : base.assets,
        liabilities: Array.isArray(saved.liabilities) ? saved.liabilities : base.liabilities,
        prices: { ...base.prices, ...(saved.prices || {}) },
        history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : [],
      };
    }
    const cached = await AsyncStorage.getItem(RATES_KEY);
    if (cached) market = { ...market, ...JSON.parse(cached) };
  } catch {
    /* first run, or storage unavailable — defaults stay */
  }
  emit(state);
  emitMarket(market);
  return state;
}

/* ---------------------------------------------------------------- market --- */

export async function refreshMarket() {
  try {
    const [fx, gold, silver] = await Promise.all([
      fetch('https://open.er-api.com/v6/latest/USD', { headers: { Accept: 'application/json' } }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('rates unavailable'))
      ),
      fetch('https://api.gold-api.com/price/XAU', { headers: { Accept: 'application/json' } }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('gold unavailable'))
      ),
      fetch('https://api.gold-api.com/price/XAG', { headers: { Accept: 'application/json' } }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('silver unavailable'))
      ),
    ]);
    const next: MarketData = {
      rates: (fx && fx.rates) || {},
      goldUsdPerOunce: Number(gold?.price) || 0,
      silverUsdPerOunce: Number(silver?.price) || 0,
      fetchedAt: Date.now(),
    };
    emitMarket(next);
    await AsyncStorage.setItem(RATES_KEY, JSON.stringify(next)).catch(() => undefined);
    return next;
  } catch {
    return market;
  }
}

/** Live prices converted into the selected currency, per gram. */
export function livePrices(currency = state.currency, data = market) {
  const rate = data.rates?.[currency] ?? (currency === 'USD' ? 1 : 0);
  return {
    goldPerGram: data.goldUsdPerOunce ? (data.goldUsdPerOunce / GRAMS_PER_OUNCE) * rate : 0,
    silverPerGram: data.silverUsdPerOunce ? (data.silverUsdPerOunce / GRAMS_PER_OUNCE) * rate : 0,
    fetchedAt: data.fetchedAt,
  };
}

export function marketIsFresh() {
  if (!market.fetchedAt) return false;
  return Date.now() - market.fetchedAt < 12 * 60 * 60 * 1000;
}

/* ------------------------------------------------------------- editing --- */

export async function setCurrency(currency: string) {
  const live = livePrices(currency);
  // Only the metal prices normally follow the currency — unless the user has
  // pinned their own, in which case those stay.
  const prices = state.prices.custom
    ? state.prices
    : { ...state.prices, goldPerGram: live.goldPerGram, silverPerGram: live.silverPerGram, fetchedAt: live.fetchedAt };

  // Amounts the user already typed are carried across at the going rate, so a
  // figure entered in one currency is not silently re-read in another. Gold and
  // silver are held by weight, so they are left alone.
  const from = market.rates?.[state.currency];
  const to = market.rates?.[currency];
  const factor = from && to && from > 0 ? to / from : 1;
  const convert = (value: number) => Math.round(value * factor * 100) / 100;
  const assets = state.assets.map((asset) =>
    asset.kind === 'gold' || asset.kind === 'silver' ? asset : { ...asset, amount: convert(Number(asset.amount) || 0) }
  );
  const liabilities = state.liabilities.map((item) => ({ ...item, amount: convert(Number(item.amount) || 0) }));

  await persist({ ...state, currency, prices, assets, liabilities });
}

export async function setBasis(basis: NisabBasis) {
  await persist({ ...state, basis });
}

export async function setAssetAmount(assetId: string, amount: number) {
  await persist({ ...state, assets: state.assets.map((a) => (a.id === assetId ? { ...a, amount } : a)) });
}

export async function setLiabilityAmount(liabilityId: string, amount: number) {
  await persist({ ...state, liabilities: state.liabilities.map((l) => (l.id === liabilityId ? { ...l, amount } : l)) });
}

export async function setMetalPrice(metal: 'gold' | 'silver', perGram: number) {
  const prices: MetalPrices = {
    ...state.prices,
    [metal === 'gold' ? 'goldPerGram' : 'silverPerGram']: perGram,
    custom: true,
  };
  await persist({ ...state, prices });
}

export async function useLiveMetalPrices() {
  const live = livePrices();
  await persist({
    ...state,
    prices: { goldPerGram: live.goldPerGram, silverPerGram: live.silverPerGram, fetchedAt: live.fetchedAt, custom: false },
  });
}

/* ---------------------------------------------------------- calculation --- */

export type ZakatResult = {
  gross: number;
  liabilities: number;
  net: number;
  nisab: number;
  above: boolean;
  zakat: number;
  goldPerGram: number;
  silverPerGram: number;
  /** Value of each asset line, in the selected currency. */
  lines: { id: string; label: string; value: number; grams?: number }[];
};

export function computeZakat(current = state): ZakatResult {
  const live = livePrices(current.currency);
  const goldPerGram = current.prices.custom && current.prices.goldPerGram ? current.prices.goldPerGram : live.goldPerGram;
  const silverPerGram =
    current.prices.custom && current.prices.silverPerGram ? current.prices.silverPerGram : live.silverPerGram;

  const lines = current.assets.map((asset) => {
    if (asset.kind === 'gold') {
      const grams = Number(asset.amount) || 0;
      return { id: asset.id, label: asset.label, value: grams * goldPerGram, grams };
    }
    if (asset.kind === 'silver') {
      const grams = Number(asset.amount) || 0;
      return { id: asset.id, label: asset.label, value: grams * silverPerGram, grams };
    }
    return { id: asset.id, label: asset.label, value: Number(asset.amount) || 0 };
  });

  const gross = lines.reduce((sum, line) => sum + line.value, 0);
  const liabilities = current.liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const net = Math.max(0, gross - liabilities);
  const nisab = current.basis === 'gold' ? NISAB_GOLD_GRAMS * goldPerGram : NISAB_SILVER_GRAMS * silverPerGram;
  const above = nisab > 0 && net >= nisab;

  return { gross, liabilities, net, nisab, above, zakat: above ? net * ZAKAT_RATE : 0, goldPerGram, silverPerGram, lines };
}

export async function saveCalculation(result: ZakatResult) {
  const entry: ZakatHistoryEntry = {
    id: id('calc'),
    at: Date.now(),
    currency: state.currency,
    gross: result.gross,
    net: result.net,
    nisab: result.nisab,
    zakat: result.zakat,
    above: result.above,
    basis: state.basis,
  };
  await persist({ ...state, history: [entry, ...state.history].slice(0, 30) });
  return entry;
}

export async function deleteCalculation(entryId: string) {
  await persist({ ...state, history: state.history.filter((entry) => entry.id !== entryId) });
}

export async function clearHistory() {
  await persist({ ...state, history: [] });
}

/* ----------------------------------------------------------- formatting --- */

export function currencySymbol(code: string) {
  return CURRENCIES.find((item) => item.code === code)?.symbol || code;
}

let moneyLocale = 'en';

export function setMoneyLocale(locale: string) {
  moneyLocale = locale === 'ar' ? 'ar-u-nu-latn' : locale || 'en';
}

export function formatMoney(value: number, code = state.currency, maximumFractionDigits = 2) {
  const safe = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat(moneyLocale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits,
    }).format(safe);
  } catch {
    return `${currencySymbol(code)} ${safe.toLocaleString(moneyLocale, { maximumFractionDigits })}`;
  }
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(moneyLocale, { maximumFractionDigits });
}
