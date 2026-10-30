import AsyncStorage from '@react-native-async-storage/async-storage';
import { AESSealedData, AESEncryptionKey, aesDecryptAsync, aesEncryptAsync, getRandomBytesAsync } from 'expo-crypto';
import { AppState } from 'react-native';
import { useEffect, useState } from 'react';
import { fromBase64, fromUtf8, pbkdf2Sha256, toBase64, utf8 } from './backupCrypto';

/**
 * An encrypted backup of everything the app knows about a person.
 *
 * The threat this is built for is boring and real: the export is a file, files
 * get copied into chats and onto laptops and into cloud drives, and at some
 * point one of them is somewhere it should not be. So the file is useless
 * without a password, and the password is never written to storage.
 *
 * What is defended against, then, is the file falling into someone's hands.
 * What is *not* defended against is the device itself being compromised while
 * the app is open and unlocked — no amount of encryption here changes that,
 * and it would be dishonest to imply otherwise.
 *
 * Every export gets its own salt. Reusing one would let a single key open
 * every file ever made, and would let somebody who stole a drawer full of
 * backups attack them all for the price of attacking one.
 *
 * The header is authenticated, not just the data. The KDF parameters travel in
 * plaintext because they must, so they are bound into the encryption as
 * additional authenticated data: anybody who edits the iteration count down to
 * make guessing cheaper gets a file that will not open at all.
 */

const SETTINGS_KEY = '@deen/backup/v1';
const FORMAT = 'deen-backup';
const VERSION = 1;

/**
 * Iterations for PBKDF2-HMAC-SHA256 — the number OWASP currently recommends
 * for this construction. It is written into every file so it can be raised
 * later without stranding backups that were already made.
 */
export const PBKDF2_ITERATIONS = 210_000;

const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;

/** A known string, encrypted, whose decryption is what proves a password. */
const VERIFIER_PLAINTEXT = 'deen-backup-verifier-v1';

export const BACKUP_RELOCK_OPTIONS = [
  { minutes: 0, label: 'Every time' },
  { minutes: 15, label: 'After 15 minutes' },
  { minutes: 60, label: 'After 1 hour' },
  { minutes: 480, label: 'After 8 hours' },
];

export type BackupSettings = {
  passwordSet: boolean;
  iterations: number;
  /** Base64 salt for the verifier, and the verifier's combined IV/ct/tag. */
  salt: string;
  verifier: string;
  relockMinutes: number;
  lastBackupAt: number | null;
};

export type BackupSummary = {
  version: number;
  iterations: number;
  exportedAt: number;
};

const EMPTY: BackupSettings = {
  passwordSet: false,
  iterations: PBKDF2_ITERATIONS,
  salt: '',
  verifier: '',
  relockMinutes: 15,
  lastBackupAt: null,
};

/* --------------------------------------------------------------- exclusion */

/**
 * Keys deliberately left out of a backup.
 *
 * The navigation state is where the person happened to be standing, not
 * anything of theirs. The content cache is a copy of what the API serves and
 * refills on its own. Downloaded recitation is a list of files on this
 * device's disk, which the backup cannot carry — restoring it elsewhere would
 * produce entries pointing at audio that is not there.
 *
 * And the backup's own settings stay home: the password belongs to the device,
 * and letting an old export quietly replace it would be a way to lose access.
 */
const EXCLUDED_KEYS = new Set<string>([
  'deen-nav-v2',
  '@deen/content-cache/index/v1',
  'quran-downloads-v1',
  SETTINGS_KEY,
]);

function isAppKey(key: string): boolean {
  return key.startsWith('@deen/') || key.startsWith('deen-')
    || key === 'quran-downloads-v1' || key === 'tasbih-state-v1';
}

/* ------------------------------------------------------------------ state */

let settings: BackupSettings = { ...EMPTY };

/**
 * The password, held in memory only while the session is unlocked.
 *
 * Storing the derived key instead would be marginally safer — a key cannot be
 * reused on another site the way a password might be — but it is not possible
 * here, because each export must derive from its own fresh salt, and deriving
 * from a salt needs the password rather than any key already made from it. So
 * the password is what is kept, it lives only in this variable, and it is
 * dropped the moment the session locks.
 */
let sessionPassword: string | null = null;
let unlockedAt: number | null = null;
let backgroundedAt: number | null = null;
let watching = false;
/** Bumped after a restore so the app can rebuild everything it had cached. */
let restoreNonce = 0;
/**
 * The outcome of the last restore, kept outside the screen.
 *
 * A successful restore remounts the app so every service re-reads what was
 * just written, and that remount throws away the screen's own state — taking
 * the confirmation with it. Holding the result here means the person is told
 * what happened even though the screen they were looking at is a new one.
 */
let lastRestore: RestoredBackup | null = null;

const settingsListeners = new Set<(next: BackupSettings) => void>();
const sessionListeners = new Set<(unlocked: boolean) => void>();
const restoreListeners = new Set<() => void>();

function emitSettings(next: BackupSettings) {
  settings = next;
  settingsListeners.forEach((listener) => listener(next));
}

function emitSession() {
  sessionListeners.forEach((listener) => listener(isUnlocked()));
}

export function getBackupSettings(): BackupSettings {
  return settings;
}

export function subscribeBackupSettings(listener: (next: BackupSettings) => void) {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}

export function subscribeBackupSession(listener: (unlocked: boolean) => void) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function useBackupSettings(): BackupSettings {
  const [value, setValue] = useState<BackupSettings>(settings);
  useEffect(() => {
    setValue(settings);
    return subscribeBackupSettings(setValue);
  }, []);
  return value;
}

export function useBackupUnlocked(): boolean {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  useEffect(() => {
    const sync = () => setUnlocked(isUnlocked());
    sync();
    const stopSettings = subscribeBackupSettings(sync);
    const stopSession = subscribeBackupSession(sync);
    return () => {
      stopSettings();
      stopSession();
    };
  }, []);
  return unlocked;
}

export function subscribeRestore(listener: () => void) {
  restoreListeners.add(listener);
  return () => {
    restoreListeners.delete(listener);
  };
}

/** How many restores have happened this session. */
export function useRestoreNonce(): number {
  const [value, setValue] = useState(restoreNonce);
  useEffect(() => subscribeRestore(() => setValue(restoreNonce)), []);
  return value;
}

export async function loadBackupSettings(): Promise<BackupSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<BackupSettings>) : {};
    settings = {
      ...EMPTY,
      ...parsed,
      passwordSet: Boolean(parsed.salt && parsed.verifier),
    };
  } catch {
    settings = { ...EMPTY };
  }
  emitSettings(settings);
  return settings;
}

async function persist(next: BackupSettings) {
  settings = next;
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* the session still works without the settings being written */
  }
  emitSettings(next);
}

/* ------------------------------------------------------------------ crypto */

async function randomBytes(count: number): Promise<Uint8Array> {
  const bytes = await getRandomBytesAsync(count);
  return new Uint8Array(bytes);
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  return pbkdf2Sha256(utf8(password.normalize('NFKC')), salt, iterations, KEY_BYTES);
}

async function encrypt(keyBytes: Uint8Array, plaintext: Uint8Array, aad: Uint8Array): Promise<string> {
  const key = await AESEncryptionKey.import(keyBytes);
  const sealed = await aesEncryptAsync(plaintext, key, { additionalData: aad });
  return sealed.combined('base64');
}

async function decrypt(keyBytes: Uint8Array, combined: string, aad: Uint8Array): Promise<Uint8Array> {
  const key = await AESEncryptionKey.import(keyBytes);
  const sealed = AESSealedData.fromCombined(combined, { ivLength: IV_BYTES, tagLength: TAG_BYTES });
  const plain = await aesDecryptAsync(sealed, key, { additionalData: aad, output: 'bytes' });
  return new Uint8Array(plain as Uint8Array);
}

/* ---------------------------------------------------------------- password */

export class WrongPasswordError extends Error {
  constructor() {
    super('That password does not open this backup.');
    this.name = 'WrongPasswordError';
  }
}

/**
 * Derives the key from the stored salt and checks it opens the verifier.
 *
 * A failed GCM tag and a wrong password are the same event from out here, and
 * that is deliberate: the caller learns only that it did not work, never
 * whether the key or the data was at fault.
 */
async function verify(password: string, config: BackupSettings): Promise<void> {
  const key = await derive(password, fromBase64(config.salt), config.iterations);
  try {
    const plain = await decrypt(key, config.verifier, utf8(VERIFIER_PLAINTEXT));
    if (fromUtf8(plain) !== VERIFIER_PLAINTEXT) throw new WrongPasswordError();
  } catch {
    throw new WrongPasswordError();
  }
}

/**
 * Sets or replaces the password, and leaves the session unlocked.
 *
 * The verifier is the encrypted form of a string this file already knows, kept
 * so the app can tell a right password from a wrong one without a backup file
 * in hand — which is what makes remembering it possible at all.
 */
export async function setPassword(password: string): Promise<void> {
  if (password.length < 8) throw new Error('Use at least 8 characters.');
  const salt = await randomBytes(SALT_BYTES);
  const iterations = PBKDF2_ITERATIONS;
  const key = await derive(password, salt, iterations);
  let verifier: string;
  try {
    verifier = await encrypt(key, utf8(VERIFIER_PLAINTEXT), utf8(VERIFIER_PLAINTEXT));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not set that password.');
  }
  await persist({
    ...settings,
    passwordSet: true,
    iterations,
    salt: toBase64(salt),
    verifier,
  });
  sessionPassword = password;
  unlockedAt = Date.now();
  emitSession();
}

export async function changePassword(current: string, next: string): Promise<void> {
  if (!settings.passwordSet) throw new Error('No password is set yet.');
  await verify(current, settings);
  await setPassword(next);
}

export async function removePassword(): Promise<void> {
  sessionPassword = null;
  unlockedAt = null;
  await persist({ ...settings, passwordSet: false, salt: '', verifier: '' });
  emitSession();
}

/** Checks a password against the verifier and opens the session if it is right. */
export async function unlock(password: string): Promise<void> {
  if (!settings.passwordSet) throw new Error('No password is set yet.');
  await verify(password, settings);
  sessionPassword = password;
  unlockedAt = Date.now();
  emitSession();
}

export function lockBackup(): void {
  sessionPassword = null;
  unlockedAt = null;
  emitSession();
}

export function isUnlocked(): boolean {
  return !settings.passwordSet || sessionPassword !== null;
}

export async function saveRelock(minutes: number): Promise<void> {
  await persist({ ...settings, relockMinutes: minutes });
}

/* ----------------------------------------------------------------- session */

/**
 * Closes the session when the app is put away, on the same terms as the
 * privacy lock: straight away, or once the grace period has run out.
 */
export function startBackupWatch() {
  if (watching) return () => undefined;
  watching = true;
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      if (backgroundedAt !== null && settings.relockMinutes > 0) {
        if (Date.now() - backgroundedAt >= settings.relockMinutes * 60_000) lockBackup();
      }
      backgroundedAt = null;
      return;
    }
    if (state === 'background' || state === 'inactive') {
      backgroundedAt = Date.now();
      if (settings.relockMinutes === 0) lockBackup();
    }
  });
  return () => {
    subscription.remove();
    watching = false;
  };
}

/* ------------------------------------------------------------------ export */

export type CreatedBackup = { text: string; keys: number; bytes: number };

/**
 * Encrypts everything into one portable string.
 *
 * Each export gets a fresh salt and nonce, so two backups of the same data
 * come out completely different. Identical files would tell an observer that
 * nothing had changed, and one key would open both.
 */
export async function createBackup(): Promise<CreatedBackup> {
  if (!isUnlocked() || !sessionPassword) throw new Error('Unlock the backup password first.');

  const keys = (await AsyncStorage.getAllKeys()).filter((key) => !EXCLUDED_KEYS.has(key));
  const pairs = await AsyncStorage.multiGet(keys);
  const data: Record<string, string> = {};
  pairs.forEach(([key, value]) => {
    if (value !== null) data[key] = value;
  });

  const exportedAt = Date.now();
  const body = { kind: FORMAT, version: VERSION, exportedAt, keys: data };
  const salt = await randomBytes(SALT_BYTES);
  const key = await derive(sessionPassword, salt, PBKDF2_ITERATIONS);

  const header = { format: FORMAT, version: VERSION, iterations: PBKDF2_ITERATIONS, salt: toBase64(salt), exportedAt };
  let payload: string;
  try {
    payload = await encrypt(key, utf8(JSON.stringify(body)), utf8(JSON.stringify(header)));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not create the backup.');
  }

  const text = JSON.stringify({ ...header, payload });
  await persist({ ...settings, lastBackupAt: exportedAt });
  return { text, keys: Object.keys(data).length, bytes: text.length };
}

/* ----------------------------------------------------------------- restore */

/** Reads a backup's header without needing the password. */
export function readBackupSummary(text: string): BackupSummary | null {
  try {
    const parsed = JSON.parse(text) as any;
    if (!parsed || parsed.format !== FORMAT) return null;
    return {
      version: Number(parsed.version) || 0,
      iterations: Number(parsed.iterations) || 0,
      exportedAt: Number(parsed.exportedAt) || 0,
    };
  } catch {
    return null;
  }
}

export type RestoredBackup = { keys: number; exportedAt: number };

export function getLastRestore(): RestoredBackup | null {
  return lastRestore;
}

export function clearLastRestore(): void {
  lastRestore = null;
  emitSettings(settings);
}

/**
 * Replaces everything on this device with what is in the file.
 *
 * Keys the backup does not mention are removed rather than left behind, so
 * this is a restore and not a merge. A merge would set deleted things back up
 * alongside new ones, and the result would be nobody's history.
 *
 * The password is checked against the file itself rather than against this
 * device's verifier, because the file may have been made with a different
 * password, on a different device, years ago. Restoring does not adopt it.
 */
export async function restoreBackup(text: string, password: string): Promise<RestoredBackup> {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not an Islamic backup.');
  }
  if (!parsed || parsed.format !== FORMAT) throw new Error('That file is not an Islamic backup.');
  if (Number(parsed.version) > VERSION) throw new Error('That backup was made by a newer version of the app.');

  const header = {
    format: parsed.format,
    version: Number(parsed.version),
    iterations: Number(parsed.iterations),
    salt: String(parsed.salt),
    exportedAt: Number(parsed.exportedAt),
  };
  if (!header.iterations || !header.salt || !parsed.payload) throw new Error('That backup file is damaged.');

  const key = await derive(password, fromBase64(header.salt), header.iterations);
  let plain: Uint8Array;
  try {
    plain = await decrypt(key, String(parsed.payload), utf8(JSON.stringify(header)));
  } catch {
    throw new WrongPasswordError();
  }

  let body: any;
  try {
    body = JSON.parse(fromUtf8(plain));
  } catch {
    throw new WrongPasswordError();
  }
  if (!body || body.kind !== FORMAT || !body.keys) throw new Error('That backup file is damaged.');

  const incoming: Record<string, string> = body.keys;
  const existing = await AsyncStorage.getAllKeys();
  const stale = existing.filter((key) => isAppKey(key) && !EXCLUDED_KEYS.has(key) && !(key in incoming));

  try {
    await AsyncStorage.multiSet(Object.entries(incoming).map(([k, v]) => [k, v] as [string, string]));
    if (stale.length) await AsyncStorage.multiRemove(stale);
  } catch {
    throw new Error('Could not write the restored data to this device.');
  }

  const result = { keys: Object.keys(incoming).length, exportedAt: header.exportedAt };
  lastRestore = result;
  restoreNonce += 1;
  restoreListeners.forEach((listener) => listener());
  return result;
}
