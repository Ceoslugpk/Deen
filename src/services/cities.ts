/**
 * Finding a place.
 *
 * Prayer times only exist at a latitude and longitude, so the first thing the
 * app needs from anyone is where they are. Most people will name a city rather
 * than recite coordinates, so the search has to work the way they expect —
 * and it has to work on a plane, in a basement, and before the SIM is
 * activated, which is why the list is on the device rather than in the cloud.
 *
 * Two sources, in this order:
 *
 *   1. The bundled list. About 7,600 cities, chosen by population with a lower
 *      bar for countries where most people are Muslim, because a town of
 *      40,000 in Egypt is a likelier answer than a town of 160,000 in Brazil.
 *      Instant, offline, and enough for almost everyone.
 *
 *   2. Open-Meteo's geocoding API, when the bundled list has nothing. It needs
 *      a connection and no API key, and whatever the person picks is written
 *      back to the device so the next search for it is instant and offline.
 *
 * Anything still missing can be entered by hand as coordinates, which is the
 * honest fallback: an exact position beats a guess.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CityResult = {
  /** The name as it is written locally, which is what we show. */
  name: string;
  /** The ASCII form, which is what we match against. */
  ascii: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
  population: number;
  timezone?: string;
  /** Where this answer came from, so the UI can be truthful about it. */
  source: 'device' | 'online' | 'saved';
};

type Row = [string, string, string, number, number, number, string, string[]?];

let table: Row[] | null = null;
let countryNames: Record<string, string> = {};

/**
 * The dataset is around 480 KB, which is far too much to parse on startup for
 * something most sessions never use. It is read the first time somebody
 * actually searches.
 */
function table$(): Row[] {
  if (table) return table;
  try {
    const cities = require('../data/cities.json');
    const countries = require('../data/countries.json');
    table = cities.cities as Row[];
    countryNames = countries.names as Record<string, string>;
  } catch {
    table = [];
  }
  return table || [];
}

export function countryName(code: string): string {
  if (!countryNames || !Object.keys(countryNames).length) table$();
  return countryNames[code] || code;
}

/** Fold accents so "Medellin" finds "Medellín" and "Koln" finds "Köln". */
function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim();
}

const SAVED_KEY = '@deen/cities/saved/v1';
type SavedCity = { name: string; country: string; latitude: number; longitude: number; timezone?: string };

let saved: SavedCity[] = [];
let savedLoaded = false;

async function loadSaved(): Promise<SavedCity[]> {
  if (savedLoaded) return saved;
  try {
    saved = JSON.parse((await AsyncStorage.getItem(SAVED_KEY)) || '[]');
  } catch {
    saved = [];
  }
  savedLoaded = true;
  return saved;
}

/** Remember a place found online, so the next search for it needs no network. */
export async function rememberCity(city: CityResult) {
  const all = await loadSaved();
  const key = `${fold(city.name)}|${city.country}`;
  if (all.some((c) => `${fold(c.name)}|${c.country}` === key)) return;
  all.unshift({
    name: city.name, country: city.country,
    latitude: city.latitude, longitude: city.longitude, timezone: city.timezone,
  });
  saved = all.slice(0, 200);
  try {
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  } catch { /* a memory of a city is not worth failing over */ }
}

/**
 * Ranking that behaves the way people expect.
 *
 * An exact name wins outright. Then comes a name that *starts with* what was
 * typed — typing "karac" should surface Karachi, not a village with "karac"
 * in the middle of it. Word-prefix matches come next ("new y" → New York), and
 * only then do we consider a match anywhere in the name. Population breaks
 * every tie, so "Springfield" means the biggest Springfield.
 */
function score(row: Row, query: string): number {
  const pop = row[5] || 0;
  const names = [row[0], row[1], ...(row[7] || [])];

  // A match on the primary name outranks the same match on an alias: an alias
  // is how a place is known somewhere else, not what it is called.
  let best = 0;
  for (let index = 0; index < names.length; index += 1) {
    const hay = fold(names[index]);
    if (!hay) continue;
    let rank = 0;
    if (hay === query) rank = 1_000_000;
    else if (hay.startsWith(query)) rank = 500_000;
    else if (hay.split(' ').some((word) => word.startsWith(query))) rank = 250_000;
    else if (hay.includes(query)) rank = 50_000;
    if (!rank) continue;
    if (index > 1) rank -= 5_000; // alias
    best = Math.max(best, rank + pop);
  }
  return best;
}

export function searchLocalCities(query: string, limit = 12): CityResult[] {
  const q = fold(query);
  if (q.length < 2) return [];
  const rows = table$();
  const scored: { row: Row; rank: number }[] = [];
  for (const row of rows) {
    const rank = score(row, q);
    if (rank > 0) scored.push({ row, rank });
  }
  scored.sort((a, b) => b.rank - a.rank);
  return scored.slice(0, limit).map(({ row }) => ({
    name: row[1], ascii: row[0], country: row[2],
    countryName: countryName(row[2]),
    latitude: row[3], longitude: row[4], population: row[5],
    timezone: row[6], source: 'device' as const,
  }));
}

function savedToResults(query: string): CityResult[] {
  const q = fold(query);
  if (q.length < 2) return [];
  return saved
    .filter((c) => fold(c.name).startsWith(q) || fold(c.name).includes(q))
    .slice(0, 6)
    .map((c) => ({
      name: c.name, ascii: c.name, country: c.country,
      countryName: countryName(c.country),
      latitude: c.latitude, longitude: c.longitude, population: 0,
      timezone: c.timezone, source: 'saved' as const,
    }));
}

/**
 * Open-Meteo's geocoding endpoint: no key, no account, and it returns the
 * timezone, which the prayer calendar wants anyway.
 */
export async function searchRemoteCities(query: string, limit = 8): Promise<CityResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${limit}&language=en&format=json`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return [];
    const body = await response.json();
    const rows: any[] = body?.results || [];
    return rows.map((row) => ({
      name: row.name,
      ascii: row.name,
      country: row.country_code || row.country || '',
      countryName: row.country || countryName(row.country_code || ''),
      latitude: row.latitude,
      longitude: row.longitude,
      population: row.population || 0,
      timezone: row.timezone,
      source: 'online' as const,
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The one entry point the UI uses.
 *
 * The bundled answer comes back synchronously so typing feels immediate; the
 * network is consulted only when that answer is empty, and its results are
 * appended rather than prepended so the instantaneous ones never jump about
 * under the person's finger.
 */
export async function searchCities(query: string, limit = 14): Promise<CityResult[]> {
  await loadSaved();
  const local = searchLocalCities(query, limit);
  if (local.length) return dedupe([...savedToResults(query), ...local]).slice(0, limit);

  const remote = await searchRemoteCities(query, 8);
  const merged = dedupe([...savedToResults(query), ...local, ...remote]);
  // Anything the person picks from the online list is kept for next time.
  for (const city of remote) void rememberCity(city);
  return merged.slice(0, limit);
}

function dedupe(list: CityResult[]): CityResult[] {
  const seen = new Set<string>();
  const out: CityResult[] = [];
  for (const city of list) {
    // Two places can share a name in different countries; the same name in the
    // same country, within a degree, is the same place.
    const key = `${fold(city.name)}|${city.country}|${city.latitude.toFixed(1)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(city);
  }
  return out;
}
