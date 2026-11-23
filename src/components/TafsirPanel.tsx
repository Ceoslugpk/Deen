import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { hasTafsir, loadVerseTafsir, tafsirEditionFor, VerseTafsir } from '../services/tafsir';

/**
 * The commentary, under the verse it belongs to.
 *
 * Why under the verse and not beside it: a tafsir paragraph is sometimes four
 * lines (the concise Arabic books) and sometimes several screens (a classical
 * one). A panel next to the text would either be too narrow for the long case
 * or waste half the page on the short one. Underneath, it pushes nothing aside
 * and disappears when it is closed.
 *
 * It opens on a tap and fetches then, never before. Commentary is up to a
 * couple of hundred kilobytes a surah; downloading it for every verse on the
 * page because one panel might be opened would be a cost paid by everyone for
 * a feature used by some.
 *
 * The text is shown as it comes. Nothing is summarised, trimmed or reworded -
 * it is somebody's commentary, and a shortened tafsir is no longer theirs.
 */

export type TafsirPanelProps = {
  /** The verse whose commentary this is, e.g. `2:255`. */
  verseKey: string;
  /** The reader's language, which decides the book. */
  language: string;
  /** Live palette, passed in because the theme object is mutable. */
  C: Record<string, string>;
  /** Direction of the reader's interface, so the panel mirrors with it. */
  rtl?: boolean;
  /** Translation lookup, as used elsewhere in the app. */
  T?: (text: string) => string;
  /** The source's markup stripper, shared with the tafsir screen. */
  stripMarkup: (input: string) => string;
  /** True when the verse is the gold-highlighted "sounding" one. */
  compact?: boolean;
};

type Load = 'idle' | 'loading' | 'done' | 'failed';

export function TafsirPanel({ verseKey, language, C, rtl, T, stripMarkup, compact }: TafsirPanelProps) {
  const say = useCallback((text: string) => (T ? T(text) : text), [T]);
  const edition = tafsirEditionFor(language);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Load>('idle');
  const [data, setData] = useState<VerseTafsir | null>(null);
  const [error, setError] = useState('');

  /* A verse whose commentary is already in hand opens without a spinner. The
     cache behind this is the app's year-long tafsir cache, so returning to a
     verse costs nothing at all. */
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  /* A different verse is a different panel. Resetting here rather than in the
     press handler means a verse recycled by the list cannot show the previous
     verse's commentary for a moment. */
  useEffect(() => {
    setOpen(false);
    setState('idle');
    setData(null);
    setError('');
  }, [verseKey, language]);

  const load = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const result = await loadVerseTafsir(verseKey, language, { stripMarkup });
      if (!alive.current) return;
      setData(result);
      setState('done');
    } catch (e: any) {
      if (!alive.current) return;
      /* Kept, not swallowed: "could not be loaded" and "this book says nothing
         here" are different facts, and only one of them is worth retrying. */
      setError(e?.message || say('The commentary could not be loaded.'));
      setState('failed');
    }
  }, [verseKey, language, stripMarkup, say]);

  if (!edition) return null;

  const toggle = () => {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (state === 'idle' || state === 'failed') void load();
  };

  const text = data?.text ?? '';
  const label = say('Tafsir');
  const direction = rtl ? ({ textAlign: 'left' as const }) : ({ textAlign: 'right' as const });

  return <View style={{ marginTop: compact ? 8 : 6 }}>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }}
      accessibilityLabel={`${label} · ${verseKey}`} onPress={toggle}
      style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: open ? C.mint : 'transparent' }}>
      <Text style={{ color: C.green, fontSize: 12, fontWeight: '600' }}>{open ? say('Hide the commentary') : label}</Text>
      <Text style={{ color: C.muted, fontSize: 11 }}>{open ? '' : edition.title}</Text>
    </Pressable>

    {open ? <View style={{ marginTop: 8, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, backgroundColor: C.card }}>
      {state === 'loading' ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ActivityIndicator color={C.green} />
        <Text style={{ color: C.muted, fontSize: 12 }}>{say('Loading the commentary')}</Text>
      </View> : state === 'failed' ? <View style={{ gap: 8 }}>
        <Text style={{ color: C.muted, fontSize: 12 }}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={() => void load()} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ color: C.green, fontSize: 12, fontWeight: '600' }}>{say('Try again')}</Text>
        </Pressable>
      </View> : hasTafsir(text) ? <View style={{ gap: 8 }}>
        <Text style={{ color: C.muted, fontSize: 10, letterSpacing: 0.4 }}>{edition.title.toUpperCase()}</Text>
        <Text selectable style={{ color: C.body, fontSize: 14, lineHeight: 24, ...direction }}>{text}</Text>
      </View> : data?.pointer ? <Text style={{ color: C.muted, fontSize: 12 }}>{say('This edition points this verse to the commentary on another verse, which this panel cannot follow.')}</Text>
      : <Text style={{ color: C.muted, fontSize: 12 }}>{say('This edition has no commentary for this verse.')}</Text>}
    </View> : null}
  </View>;
}
