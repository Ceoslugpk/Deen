import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

/**
 * Reporting a correction.
 *
 * A text this size will have mistakes in it: a mistranscribed diacritic, a
 * translation that renders an idiom too literally, a hadith graded against the
 * wrong collection. The reader is the person most likely to notice, so there
 * has to be a way to say so that costs one tap and no account.
 *
 * The report is written to the device first and only then offered as an email.
 * That order matters: if the mail app is missing, or the user is offline, or
 * they simply decide not to send, the report is still on the phone and can be
 * sent later from Settings. Nothing the user wrote is ever only in transit.
 */

/**
 * Where reports go. Change this one line to point at your own inbox — every
 * report in the app is addressed from here, so nothing else needs editing.
 */
export const CORRECTIONS_EMAIL = 'corrections@deencompanion.app';

export type CorrectionKind = 'ayah' | 'hadith';

/**
 * Which part is wrong. Kept separate from the kind because "the Arabic is
 * wrong" and "the translation is wrong" are different problems for different
 * people to fix, and a report that does not say which one is nearly useless.
 */
export type CorrectionIssue = 'arabic' | 'translation' | 'grading' | 'reference' | 'other';

export type CorrectionReport = {
  id: string;
  kind: CorrectionKind;
  issue: CorrectionIssue;
  /** Short and human: `2:255`, or `Sahih al-Bukhari · 52`. */
  reference: string;
  /** Surah name for a verse, collection name for a hadith. */
  source: string;
  /** The Arabic exactly as the app rendered it. */
  arabic?: string;
  /** The translation or English text exactly as the app rendered it. */
  text?: string;
  /** Which translation edition produced `text` — often explains a difference. */
  edition?: string;
  /** The user's own description of what is wrong. */
  note: string;
  /** Interface and content language at the time of the report. */
  appLanguage: string;
  createdAt: number;
  /** Set once the email has been handed to the mail app. */
  sent?: boolean;
};

const KEY = '@deen/reports/v1';

let reports: CorrectionReport[] = [];
let loaded = false;
const listeners = new Set<(next: CorrectionReport[]) => void>();

const publish = (next: CorrectionReport[]) => {
  reports = next;
  listeners.forEach((listener) => listener(next));
};

export async function loadReports(): Promise<CorrectionReport[]> {
  if (loaded) return reports;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    reports = raw ? JSON.parse(raw) : [];
  } catch {
    reports = [];
  }
  loaded = true;
  publish(reports);
  return reports;
}

async function persist(next: CorrectionReport[]) {
  publish(next);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* A report that cannot be stored is still worth sending now, so this
       swallows rather than blocks. */
  }
}

export async function saveReport(
  report: Omit<CorrectionReport, 'id' | 'createdAt' | 'sent'>,
): Promise<CorrectionReport> {
  if (!loaded) await loadReports();
  const full: CorrectionReport = {
    ...report,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    sent: false,
  };
  await persist([full, ...reports]);
  return full;
}

export async function deleteReport(id: string) {
  await persist(reports.filter((item) => item.id !== id));
}

export async function markReportSent(id: string) {
  await persist(reports.map((item) => (item.id === id ? { ...item, sent: true } : item)));
}

export function subscribeReports(listener: (next: CorrectionReport[]) => void) {
  listeners.add(listener);
  void loadReports().then(() => listener(reports));
  return () => {
    listeners.delete(listener);
  };
}


const ISSUE_LABEL: Record<CorrectionIssue, string> = {
  arabic: 'The Arabic text',
  translation: 'The translation',
  grading: 'The grading or authenticity',
  reference: 'The reference or numbering',
  other: 'Something else',
};

export function issueLabel(issue: CorrectionIssue): string {
  return ISSUE_LABEL[issue] || ISSUE_LABEL.other;
}

/**
 * The body of the report email.
 *
 * Deliberately plain and complete: whoever reads it was not there, so every
 * fact the app can supply goes in. Line length is kept short because mail
 * clients reflow unpredictably.
 */
export function buildReportBody(report: CorrectionReport): string {
  const lines = [
    `What is wrong: ${issueLabel(report.issue)}`,
    '',
    `Source: ${report.source}`,
    `Reference: ${report.reference}`,
    report.edition ? `Translation: ${report.edition}` : '',
    `App language: ${report.appLanguage}`,
    '',
    '--- As the app shows it ---',
    report.arabic ? report.arabic : '',
    report.text ? `(${report.issue === 'arabic' ? 'current rendering' : 'current rendering'}) ${report.text}` : '',
    '',
    '--- What the reader said ---',
    report.note.trim() || '(no comment given)',
    '',
    '--- Please describe the correction ---',
    '',
    '',
  ].filter((line) => line !== undefined);
  return lines.join('\n');
}

export function buildReportSubject(report: CorrectionReport): string {
  const what = report.kind === 'hadith' ? 'Hadith' : 'Ayah';
  return `Correction: ${what} ${report.reference}`;
}

export function buildReportMailto(report: CorrectionReport): string {
  const subject = encodeURIComponent(buildReportSubject(report));
  const body = encodeURIComponent(buildReportBody(report));
  return `mailto:${CORRECTIONS_EMAIL}?subject=${subject}&body=${body}`;
}

/** Opens the mail app. Returns false when the device has no way to send mail. */
/** Put the whole report on the clipboard, so it can be pasted anywhere. */
export async function copyFeedback(report: CorrectionReport): Promise<void> {
  const text = `${buildReportSubject(report)}\n\n${buildReportBody(report)}`;
  try {
    const Clipboard = require('expo-clipboard');
    await Clipboard.setStringAsync(text);
  } catch {
    /* Clipboard unavailable — the report is still on screen and can be selected. */
  }
}

export async function openReportEmail(report: CorrectionReport): Promise<boolean> {
  const url = buildReportMailto(report);
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) return false;
    await Linking.openURL(url);
    await markReportSent(report.id);
    return true;
  } catch {
    return false;
  }
}
