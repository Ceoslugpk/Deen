import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { IslamicEdition, editionDisplayName, editionSubtitle, servableEditions } from '../services/islamicDataApi';
import { LanguageEntry, languagesOf } from '../services/languageFlags';

/**
 * The language and edition picker, shared by translations and Tafsir.
 *
 * The catalogue is large - 484 translations across 97 languages, 82 Tafsirs
 * across 33 - so the screen is built around one question asked in order: which
 * language, then which book. A flat list of 484 rows is not browsable, and a
 * search field on its own never tells you what is there to search.
 *
 * Languages are ordered by how many editions each has. Someone looking for a
 * Turkish translation is one tap away; someone looking for Zulu scrolls once.
 * The count on each pill is the honest answer to "how much is there in this
 * language", which is what decides whether a language is worth tapping.
 *
 * The flag is an emoji because it is the same character the person already sees
 * everywhere else, and it sits beside the language name rather than standing in
 * for it. That matters: Windows still renders no regional-indicator pairs, so
 * on a Windows machine the flag is absent and the name has to carry the row
 * alone. Beside a label it degrades; in place of one it would not.
 *
 * Colours arrive as a prop rather than through an import. The app's palette is
 * a mutable module-level object that the theme swaps at runtime, so a component
 * holding its own copy would freeze whichever theme was live at import.
 */

export type EditionPickerProps = {
  /** The live palette, so the picker follows the theme. */
  C: Record<string, string>;
  editions: IslamicEdition[];
  category: 'quran' | 'tafsir' | 'scripts' | 'transliteration';
  selectedId?: string;
  initialLanguage?: string;
  onPick: (edition: IslamicEdition) => void;
  searchPlaceholder?: string;
  /** Show only editions that have a surah route. */
  servableOnly?: boolean;
};

function LanguagePill({
  entry, selected, C, onPress,
}: {
  entry: LanguageEntry; selected: boolean; C: Record<string, string>; onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 9, borderRadius: 16,
        borderWidth: 1,
        borderColor: selected ? C.green : C.line,
        backgroundColor: selected ? C.mint : C.card,
      }}
    >
      <Text style={{ fontSize: 14 }}>{entry.flag}</Text>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 12.5,
          color: selected ? C.green : C.ink,
          fontFamily: selected ? 'DMSans_700Bold' : 'DMSans_600SemiBold',
        }}
      >
        {entry.label}
      </Text>
      <Text style={{ fontSize: 11, color: C.muted, fontFamily: 'DMSans_400Regular' }}>{entry.count}</Text>
    </Pressable>
  );
}

export default function EditionPicker({
  C, editions, category, selectedId, initialLanguage, onPick, searchPlaceholder, servableOnly = true,
}: EditionPickerProps) {
  const pool = useMemo(
    () => (servableOnly ? servableEditions(editions, category) : editions),
    [editions, category, servableOnly],
  );

  const languages = useMemo(() => languagesOf(pool), [pool]);

  /* Start on the language of the current choice, then the language asked for,
     then whichever has the most in it. Never open on an empty list. */
  const [language, setLanguage] = useState<string>(() => {
    const fromSelection = pool.find((e) => e.id === selectedId)?.language;
    if (fromSelection && languages.some((l) => l.code === fromSelection)) return fromSelection;
    if (initialLanguage && languages.some((l) => l.code === initialLanguage)) return initialLanguage;
    return languages[0]?.code ?? 'en';
  });
  const [query, setQuery] = useState('');

  const flagFor = useMemo(() => {
    const map = new Map(languages.map((l) => [l.code, l.flag]));
    return (code?: string) => map.get((code || '').toLowerCase()) ?? '\u{1F3F3}\u{FE0F}';
  }, [languages]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const inLanguage = pool.filter((e) => (e.language || '').toLowerCase() === language);
    if (!needle) return inLanguage;
    return inLanguage.filter((e) =>
      `${editionDisplayName(e)} ${editionSubtitle(e)} ${e.id}`.toLowerCase().includes(needle),
    );
  }, [pool, language, query]);

  if (!pool.length) return null;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        keyboardShouldPersistTaps="handled"
      >
        {languages.map((entry) => (
          <LanguagePill
            key={entry.code}
            C={C}
            entry={entry}
            selected={entry.code === language}
            onPress={() => { setLanguage(entry.code); setQuery(''); }}
          />
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          backgroundColor: C.bg, borderRadius: 16, paddingHorizontal: 12,
          marginTop: 12, borderWidth: 1, borderColor: C.line,
        }}
      >
        <Text style={{ fontSize: 13 }}>{'\u{1F50D}'}</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder || 'Search translator or edition'}
          placeholderTextColor={C.muted}
          style={{
            flex: 1, paddingVertical: 11, color: C.ink,
            fontFamily: 'DMSans_400Regular', fontSize: 14, outlineStyle: 'none',
          } as any}
        />
      </View>

      {!shown.length ? (
        <Text style={{ marginTop: 16, textAlign: 'center', fontSize: 12.5, color: C.muted, fontFamily: 'DMSans_400Regular' }}>
          Nothing here matches that search.
        </Text>
      ) : (
        <View style={{ marginTop: 12 }}>
          {shown.map((edition) => {
            const active = edition.id === selectedId;
            return (
              <Pressable
                key={edition.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onPick(edition)}
                style={{
                  minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12,
                  paddingHorizontal: 12, paddingVertical: 10,
                  borderBottomWidth: 1, borderColor: C.line,
                  backgroundColor: active ? C.mint : 'transparent',
                }}
              >
                <View
                  style={{
                    width: 44, height: 32, borderRadius: 12,
                    backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{flagFor(edition.language)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 14, fontFamily: 'DMSans_600SemiBold', color: C.ink }}
                  >
                    {editionDisplayName(edition)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 11.5, color: C.muted, fontFamily: 'DMSans_400Regular', marginTop: 2 }}
                  >
                    {editionSubtitle(edition)}
                  </Text>
                </View>
                <Text style={{ fontSize: 17, color: active ? C.green : C.muted }}>{active ? '\u2713' : '\u25CB'}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
