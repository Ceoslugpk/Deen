import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Umrah and Hajj journeys.
 *
 * A journey is a private checklist kept on this device: which rites are done,
 * how many circuits or pebbles have been counted, and any note worth keeping.
 * Nothing here rulings — schools differ on details, so the text describes the
 * rite and points to the verses; it never decides a case for anyone.
 */

/** The language a journey's date is written in. */
let journeyDateLocale: string | undefined;
export function setJourneyDateLocale(code?: string) { journeyDateLocale = code; }

export type JourneyKind = 'umrah' | 'hajj';

export type JourneyStep = {
  id: string;
  title: string;
  short: string;
  detail: string;
  icon: string;
  /** Steps that are counted, e.g. seven circuits or seven pebbles. */
  counter?: { max: number; label: string };
  /** Verse keys fetched live from Al Quran Cloud when the step is opened. */
  verseKeys?: string[];
};

export const JOURNEY_META: Record<JourneyKind, { title: string; arabic: string; intro: string; icon: string }> = {
  umrah: {
    title: 'Umrah',
    arabic: 'عُمْرَة',
    intro: 'The lesser pilgrimage: Ihram, Tawaf, Sa‘i, and shaving or trimming. It can be performed at any time of year.',
    icon: 'pilgrimage',
  },
  hajj: {
    title: 'Hajj',
    arabic: 'حَجّ',
    intro: 'The greater pilgrimage, on the 8th to the 13th of Dhul-Hijjah, with its standing at ‘Arafah at its centre.',
    icon: 'pilgrimage',
  },
};

export const JOURNEY_STEPS: Record<JourneyKind, JourneyStep[]> = {
  umrah: [
    {
      id: 'prepare',
      title: 'Prepare and intend',
      short: 'Take Ihram before you cross the Miqat',
      detail: 'Trim the nails and hair, bathe, and put on the Ihram garments before passing the Miqat for your direction of travel. Then intend the Umrah in your heart and begin the Talbiyah. Once in Ihram, do not cut hair or nails, wear sewn clothing or perfume (for men), hunt, or contract a marriage — the details of what breaks Ihram and what expiates it differ between schools, so confirm your own case with a scholar you trust.',
      icon: 'ritual-ihram',
      verseKeys: ['2:196'],
    },
    {
      id: 'talbiyah',
      title: 'The Talbiyah',
      short: 'Keep repeating it until you reach the Haram',
      detail: '“Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa an-ni‘mata laka wa al-mulk, lā sharīka lak.” Men recite it aloud; women recite it quietly. Continue until you begin Tawaf.',
      icon: 'ritual-ihram',
    },
    {
      id: 'tawaf',
      title: 'Tawaf of the Ka‘bah',
      short: 'Seven circuits, starting at the Black Stone',
      detail: 'Enter at the Black Stone, intending to begin, and circle the Ka‘bah seven times with the Ka‘bah on your left. Touch or gesture to the Black Stone each time you pass it, and recite whatever remembrance or Qur’an comes easily — no specific supplication is fixed for each circuit. Men walk briskly for the first three circuits. When you finish, pray two rak‘ahs behind Maqam Ibrāhīm if you can, then drink Zamzam.',
      icon: 'ritual-tawaf',
      counter: { max: 7, label: 'circuits' },
      verseKeys: ['2:125'],
    },
    {
      id: 'sai',
      title: 'Sa‘i between Safa and Marwah',
      short: 'Seven lengths between the two hills',
      detail: 'Walk from Safa to Marwah — that is one length — and back, seven lengths in all, finishing at Marwah. The Sa‘i is a rite of its own and is not shortened. Walk at your own pace; only the stretch between the two green markers is hurried.',
      icon: 'ritual-sai',
      counter: { max: 7, label: 'lengths' },
      verseKeys: ['2:158'],
    },
    {
      id: 'halq',
      title: 'Shave or trim the hair',
      short: 'The step that releases you from Ihram',
      detail: 'Men shave the head or trim the hair all over; a shave is preferable. Women cut a fingertip’s length from the ends of the hair. With this, the Umrah is complete and everything Ihram had forbidden becomes lawful again.',
      icon: 'ritual-ihram',
      verseKeys: ['48:27'],
    },
    {
      id: 'closing',
      title: 'Remember, and close the journey',
      short: 'Pray two rak‘ahs and give thanks',
      detail: 'Pray where you can in the Haram, give charity if you are able, and keep the supplication that is offered after a completed rite. Many then repeat the Umrah from Al-Tan‘īm or perform it again for someone else — that is a matter of your own intention and capacity.',
      icon: 'pilgrimage',
      verseKeys: ['2:200'],
    },
  ],
  hajj: [
    {
      id: 'intention',
      title: 'Choose your type of Hajj',
      short: 'Tamattu‘, Qirān, or Ifrād',
      detail: 'Tamattu‘: enter Ihram for Umrah, complete it, leave Ihram, then enter Ihram again for Hajj on the 8th; it carries a sacrificial animal. Qirān: hold both Umrah and Hajj in one Ihram. Ifrād: enter Ihram for Hajj alone and stay in Ihram throughout. Which is preferable, and what each requires, depends on your circumstances and school — decide with knowledge before you travel.',
      icon: 'ritual-ihram',
      verseKeys: ['2:196'],
    },
    {
      id: 'ihram',
      title: 'Enter Ihram',
      short: 'Bathe, dress, intend, and begin the Talbiyah',
      detail: 'Bathe and dress in the Ihram garments, then make the intention for the rites you have chosen and begin the Talbiyah. The prohibitions of Ihram now apply until you have stoned, sacrificed and shaved or trimmed.',
      icon: 'ritual-ihram',
      verseKeys: ['2:197'],
    },
    {
      id: 'qudum',
      title: 'Arrival Tawaf and Sa‘i',
      short: 'Tawaf al-Qudūm, then Sa‘i for Tamattu‘',
      detail: 'On reaching Makkah, perform the arrival Tawaf of seven circuits and pray two rak‘ahs. For Tamattu‘, follow it with the Sa‘i of Hajj (or keep the Sa‘i for after Tawaf al-Ifādah — both are held valid by different schools). You then remain in Ihram.',
      icon: 'ritual-tawaf',
      counter: { max: 7, label: 'circuits' },
      verseKeys: ['2:125'],
    },
    {
      id: 'tarwiyah',
      title: '8th of Dhul-Hijjah — Mina',
      short: 'The Day of Tarwiyah, spent at Mina',
      detail: 'Enter Ihram for Hajj if you have left it, and go to Mina, praying Dhuhr, ‘Asr, Maghrib, ‘Isha and Fajr there, each shortened to two rak‘ahs but not joined. Spend the night at Mina before going on to ‘Arafah.',
      icon: 'ritual-mina',
    },
    {
      id: 'arafah',
      title: '9th of Dhul-Hijjah — ‘Arafah',
      short: 'The standing that is the Hajj',
      detail: 'After sunrise, go to ‘Arafah and stand there from noon until sunset, praying Dhuhr and ‘Asr together and shortened. The whole of ‘Arafah is a place of standing, though the rock at Jabal al-Raḥmah is where people gather. Fill the day with the Talbiyah, remembrance, Qur’an, repentance and supplication — this is the day the pilgrimage turns on.',
      icon: 'ritual-arafat',
      verseKeys: ['2:198'],
    },
    {
      id: 'muzdalifah',
      title: 'Night at Muzdalifah',
      short: 'Leave after sunset, pray, and gather pebbles',
      detail: 'Leave ‘Arafah after sunset — before dawn — and go to Muzdalifah, where you pray Maghrib and ‘Isha together and spend the night. Gather the pebbles for the stoning here, then leave for Mina before or around dawn.',
      icon: 'ritual-mina',
    },
    {
      id: 'aqaba',
      title: '10th — Stoning the large pillar',
      short: 'Seven pebbles at Jamarat al-‘Aqabah',
      detail: 'At Mina, stone the large pillar (al-‘Aqabah, the one nearest Makkah) with seven pebbles, saying “Allāhu akbar” with each throw. With this stoning the greater release from Ihram takes effect.',
      icon: 'ritual-jamarat',
      counter: { max: 7, label: 'pebbles' },
    },
    {
      id: 'hady',
      title: '10th — Sacrifice and shaving',
      short: 'The Hady, then shave or trim',
      detail: 'Offer the sacrificial animal that is due for Tamattu‘ and Qirān — today most pilgrims appoint an authorised agent, which is accepted. Then shave the head or trim the hair; women cut a fingertip’s length. With stoning, sacrifice and shaving done, everything Ihram had forbidden becomes lawful apart from intimacy with a spouse.',
      icon: 'ritual-ihram',
    },
    {
      id: 'ifadah',
      title: '10th to 12th — Tawaf al-Ifādah',
      short: 'The pillar of Hajj, and Sa‘i if it is still owed',
      detail: 'Return to Makkah for Tawaf al-Ifādah, seven circuits, followed by the Sa‘i if you have not already performed it for the Hajj. This Tawaf is the essential pillar: the Hajj is not complete without it.',
      icon: 'ritual-tawaf',
      counter: { max: 7, label: 'circuits' },
      verseKeys: ['22:29'],
    },
    {
      id: 'tashreeq',
      title: '11th to 13th — the days of Tashrīq',
      short: 'Three pillars each afternoon, then Mina',
      detail: 'On each afternoon after noon, stone the three pillars in order — the small, then the middle, then the large — with seven pebbles each, saying “Allāhu akbar” with every throw. Spend these nights at Mina. The one who leaves after the 12th, having stoned that day, does so without blame; the one who stays for the 13th also does so without blame.',
      icon: 'ritual-jamarat',
      counter: { max: 21, label: 'pebbles' },
      verseKeys: ['2:203'],
    },
    {
      id: 'wada',
      title: 'Farewell Tawaf',
      short: 'Tawaf al-Wadā‘ before you leave Makkah',
      detail: 'Before travelling home, perform seven circuits as the farewell Tawaf, then pray two rak‘ahs and leave. It is the last rite of the Hajj for anyone leaving Makkah.',
      icon: 'ritual-tawaf',
      counter: { max: 7, label: 'circuits' },
      verseKeys: ['2:200'],
    },
  ],
};

export type Journey = {
  id: string;
  kind: JourneyKind;
  label: string;
  startedAt: string;
  completedAt?: string;
  done: Record<string, string>;
  counts: Record<string, number>;
  notes: Record<string, string>;
};

export type JourneyState = {
  active: Record<JourneyKind, Journey | null>;
  history: Journey[];
};

const KEY = 'deen-journeys-v1';
const HISTORY_LIMIT = 8;

const EMPTY: JourneyState = { active: { umrah: null, hajj: null }, history: [] };
let state: JourneyState = EMPTY;
const listeners = new Set<(next: JourneyState) => void>();

function emit() {
  listeners.forEach((listener) => listener(state));
}

export async function loadJourneys(): Promise<JourneyState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as JourneyState;
      state = { active: { umrah: parsed.active?.umrah ?? null, hajj: parsed.active?.hajj ?? null }, history: parsed.history ?? [] };
    }
  } catch {}
  return state;
}

async function persist() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  emit();
}

export function subscribeJourneys(listener: (next: JourneyState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useJourneys(): JourneyState {
  const [value, setValue] = useState<JourneyState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeJourneys(setValue);
  }, []);
  return value;
}

export function startJourney(kind: JourneyKind, label: string) {
  state = { ...state, active: { ...state.active, [kind]: { id: `${kind}-${Date.now()}`, kind, label, startedAt: new Date().toISOString(), done: {}, counts: {}, notes: {} } } };
  void persist();
}

export function toggleStep(kind: JourneyKind, stepId: string) {
  const journey = state.active[kind];
  if (!journey) return;
  const done = { ...journey.done };
  if (done[stepId]) delete done[stepId];
  else done[stepId] = new Date().toISOString();
  state = { ...state, active: { ...state.active, [kind]: { ...journey, done } } };
  void persist();
}

export function setStepCount(kind: JourneyKind, stepId: string, value: number, max: number) {
  const journey = state.active[kind];
  if (!journey) return;
  const counts = { ...journey.counts, [stepId]: Math.max(0, Math.min(max, value)) };
  state = { ...state, active: { ...state.active, [kind]: { ...journey, counts } } };
  void persist();
}

export function setStepNote(kind: JourneyKind, stepId: string, note: string) {
  const journey = state.active[kind];
  if (!journey) return;
  const notes = { ...journey.notes, [stepId]: note };
  state = { ...state, active: { ...state.active, [kind]: { ...journey, notes } } };
  void persist();
}

export function completeJourney(kind: JourneyKind) {
  const journey = state.active[kind];
  if (!journey) return;
  const finished: Journey = { ...journey, completedAt: new Date().toISOString() };
  state = { active: { ...state.active, [kind]: null }, history: [finished, ...state.history].slice(0, HISTORY_LIMIT) };
  void persist();
}

export function clearJourney(kind: JourneyKind) {
  state = { ...state, active: { ...state.active, [kind]: null } };
  void persist();
}

export function journeyProgress(journey: Journey | null) {
  const steps = journey ? JOURNEY_STEPS[journey.kind] : [];
  const done = steps.filter((step) => journey?.done[step.id]).length;
  return { done, total: steps.length, percent: steps.length ? Math.round((done / steps.length) * 100) : 0 };
}

export function readableDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(journeyDateLocale, { day: 'numeric', month: 'long', year: 'numeric' });
}
