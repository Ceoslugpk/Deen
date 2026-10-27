import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState } from 'react-native';
import { useEffect, useState } from 'react';

/**
 * Phase 4 — the lock that guards the women's area.
 *
 * Everything here is local. There is no account, no server and no recovery
 * email: the PIN is a gate on this device, not an identity. It is stored as a
 * salted SHA-256 digest rather than the digits themselves, so a stray backup
 * does not hand over the code.
 *
 * Biometrics are offered whenever the device can do them — Face ID on iPhone
 * and iPad, fingerprint or face on Android, whichever the handset enrols. The
 * actual scan belongs to the operating system; this app only asks and is told
 * yes or no, and it never sees the face or the print.
 */

export type BiometricKind = 'face' | 'fingerprint' | 'iris' | 'none';

export type LockConfig = {
  /** A gate is placed on the women's screens. */
  required: boolean;
  /** A PIN has been chosen (the digest below is set). */
  pinSet: boolean;
  /** Face ID / fingerprint may be used instead of the PIN. */
  biometric: boolean;
  /** 0 = lock the moment the app leaves the foreground, otherwise minutes. */
  relockMinutes: number;
  pinHash: string;
  pinSalt: string;
};

export const RELOCK_OPTIONS = [
  { minutes: 0, label: 'Immediately' },
  { minutes: 1, label: 'After 1 minute' },
  { minutes: 5, label: 'After 5 minutes' },
  { minutes: 15, label: 'After 15 minutes' },
];

const KEY = 'deen-lock-v1';

const EMPTY: LockConfig = {
  required: false,
  pinSet: false,
  biometric: false,
  relockMinutes: 0,
  pinHash: '',
  pinSalt: '',
};

let config: LockConfig = { ...EMPTY };
let unlockedAt: number | null = null;
let backgroundedAt: number | null = null;
let watching = false;

const configListeners = new Set<(next: LockConfig) => void>();
const sessionListeners = new Set<(unlocked: boolean) => void>();

function emitConfig(next: LockConfig) {
  config = next;
  configListeners.forEach((listener) => listener(config));
}

function emitSession() {
  sessionListeners.forEach((listener) => listener(unlockedAt !== null));
}

async function persist(next: LockConfig) {
  emitConfig(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function getLockConfig() {
  return config;
}

export function subscribeLockConfig(listener: (next: LockConfig) => void) {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
}

export function subscribeSession(listener: (unlocked: boolean) => void) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function useLockConfig(): LockConfig {
  const [value, setValue] = useState<LockConfig>(config);
  useEffect(() => {
    setValue(config);
    return subscribeLockConfig(setValue);
  }, []);
  return value;
}

/** True when the gate is up and the session has not been opened yet. */
export function useIsLocked(): boolean {
  const [locked, setLocked] = useState(!isUnlocked());
  useEffect(() => {
    const sync = () => setLocked(!isUnlocked());
    sync();
    const stopConfig = subscribeLockConfig(sync);
    const stopSession = subscribeSession(sync);
    return () => {
      stopConfig();
      stopSession();
    };
  }, []);
  return locked;
}

export async function loadLockConfig() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    config = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
    config.pinSet = Boolean(config.pinHash && config.pinSalt);
  } catch {
    config = { ...EMPTY };
  }
  emitConfig(config);
  return config;
}

/* ------------------------------------------------------------------ PIN --- */

function randomSalt() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function digest(pin: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}::${pin}`);
}

export async function setPin(pin: string) {
  const salt = randomSalt();
  const hash = await digest(pin, salt);
  await persist({
    ...config,
    pinSet: true,
    pinHash: hash,
    pinSalt: salt,
    required: true,
  });
  unlockedAt = Date.now();
  emitSession();
}

export async function removePin() {
  await persist({ ...config, pinSet: false, pinHash: '', pinSalt: '', biometric: false, required: false });
  unlockedAt = null;
  emitSession();
}

export async function checkPin(pin: string) {
  if (!config.pinSet) return false;
  const hash = await digest(pin, config.pinSalt);
  return hash === config.pinHash;
}

export async function updateLockSettings(next: Partial<Pick<LockConfig, 'required' | 'biometric' | 'relockMinutes'>>) {
  await persist({ ...config, ...next });
}

/* ----------------------------------------------------------- biometrics --- */

export type BiometricInfo = {
  available: boolean;
  enrolled: boolean;
  kind: BiometricKind;
  /** "Face ID", "Fingerprint", "Iris" or "Biometric". */
  label: string;
};

let cachedInfo: BiometricInfo | null = null;

export async function biometricInfo(force = false): Promise<BiometricInfo> {
  if (cachedInfo && !force) return cachedInfo;
  const fallback: BiometricInfo = { available: false, enrolled: false, kind: 'none', label: 'Biometric' };
  try {
    const hardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hardware || !enrolled) {
      cachedInfo = { available: false, enrolled: Boolean(enrolled), kind: 'none', label: 'Biometric' };
      return cachedInfo;
    }
    const types = (await LocalAuthentication.supportedAuthenticationTypesAsync()) || [];
    const kind: BiometricKind = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
      ? 'face'
      : types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ? 'fingerprint'
        : types.includes(LocalAuthentication.AuthenticationType.IRIS)
          ? 'iris'
          : 'none';
    const label = kind === 'face' ? 'Face ID' : kind === 'fingerprint' ? 'Fingerprint' : kind === 'iris' ? 'Iris' : 'Biometric';
    cachedInfo = { available: true, enrolled: true, kind, label };
    return cachedInfo;
  } catch {
    cachedInfo = fallback;
    return fallback;
  }
}

export async function unlockWithBiometric(reason = 'Unlock your private records') {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Use PIN',
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: true,
    });
    if (result.success) {
      unlockedAt = Date.now();
      emitSession();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------- session --- */

export function isUnlocked() {
  return !config.required || unlockedAt !== null;
}

export function unlockSession() {
  unlockedAt = Date.now();
  emitSession();
}

export function lockSession() {
  unlockedAt = null;
  emitSession();
}

/** Watches the app lifecycle so the gate closes when the app is put away. */
export function startLockWatch() {
  if (watching) return () => undefined;
  watching = true;
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      if (backgroundedAt !== null && config.relockMinutes > 0) {
        const away = Date.now() - backgroundedAt;
        if (away >= config.relockMinutes * 60_000) lockSession();
      }
      backgroundedAt = null;
      return;
    }
    if (state === 'background' || state === 'inactive') {
      backgroundedAt = Date.now();
      if (config.relockMinutes === 0) lockSession();
    }
  });
  return () => {
    subscription.remove();
    watching = false;
  };
}
