/**
 * How many times a remembrance is said.
 *
 * Hisn al-Muslim does not carry the repetition as its own field in this
 * corpus; it is written into the wording, as the printed book writes it -
 * "(Recite three times in Arabic.)", "[three times]", "(Recite seven times.)".
 * So the count is read back out of the text rather than added to it, which
 * means the number under the counter is always the same number the sentence
 * above it says. Nothing here rewrites a dua, and nothing is inferred from a
 * different edition.
 *
 * The rule that matters more than any pattern is when to say nothing:
 *
 *   - A virtue is not an instruction. "He would seek forgiveness a hundred
 *     times a day" praises the practice; it does not tell this reader to tap
 *     a hundred times. Those rows get no counter and keep their text as it is.
 *   - A compound is not a single count. "Glory to Allah (thirty-three), praise
 *     to Allah (thirty-three), Allah is greatest (thirty-four)" is three
 *     counts for three phrases; one target for the row would be wrong.
 *     Likewise "each three times" over several items.
 *   - An idiom is not a number: "in times of contentment" has no count in it.
 *   - Where the Arabic and the English disagree, neither is trusted. They are
 *     two renderings of one instruction, and a disagreement means the sentence
 *     has been read wrongly - so no counter.
 *
 * Everything that fails a rule simply has no counter. That is a smaller
 * feature than a guessed number, and the only honest one.
 */

/** The repetition of one dua, when the text states it plainly. */
export type Repetition = {
  count: number;
  /** Which language(s) the sentence stating it was written in. */
  statedIn: 'english' | 'arabic' | 'both';
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, twice: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const TENS = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const UNITS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** "three", "thirty-three", "one hundred", "a hundred", "100" -> a number. */
export function numberOf(phrase: string): number | null {
  const text = String(phrase || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!text) return null;
  if (/^\d{1,3}$/.test(text)) return Number(text);
  if (text === 'hundred' || text === 'one hundred' || text === 'a hundred') return 100;
  if (NUMBER_WORDS[text]) return NUMBER_WORDS[text];
  const hyphen = /^([a-z]+)-([a-z]+)$/.exec(text);
  if (hyphen && TENS.includes(hyphen[1]) && UNITS.includes(hyphen[2])) {
    return NUMBER_WORDS[hyphen[1]] + NUMBER_WORDS[hyphen[2]];
  }
  return null;
}

/** The phrase that may sit between a verb and the word "times". */
const COUNT_PHRASE = String.raw`(?:\d{1,3}|one hundred|a hundred|hundred|[a-z]+(?:-[a-z]+)?)`;

/**
 * A count written as an instruction.
 *
 * Two shapes qualify:
 *   1. bracketed - "(three times)", "[recite seven times]" - which is how the
 *      book marks an aside telling the reader what to do;
 *   2. a plain sentence with a verb of saying in it - "recite three times".
 *
 * A bare "a hundred times a day" in a sentence about the Prophet's habit
 * matches neither, which is what keeps narrations out.
 */
const BRACKETED = new RegExp(
  String.raw`[\(\[]\s*(?:(?:recite|say|repeat|read|do this|said)\s*)?(${COUNT_PHRASE})\s*(?:times|×)\b`,
  'gi',
);
const VERBED = new RegExp(
  String.raw`\b(?:recite|say|repeat|read)\s+(?:it\s+)?(?:in arabic\s+)?(${COUNT_PHRASE})\s*(?:times|×)\b`,
  'gi',
);

/**
 * Words that turn a number into something other than an instruction.
 *
 * "each" over several phrases, "a day" as a habit, "whoever" as a promise,
 * "thousand" as hyperbole. Any of these near the match and the row is left
 * without a count.
 */
const NOT_AN_INSTRUCTION = /\beach (?:said|one|of them|phrase|item)\b|\btimes each\b|\ba day\b|\bevery day\b|\bwill have\b|\bwhoever\b|\bmore than\b|\bthousand\b|\bthe prophet\b|\bmessenger of allah\b|\bused to\b|\bwould\b|\bsaid\b|\bnarrated\b|\breported\b/i;

/**
 * The same limits in Arabic.
 *
 * "كان يعد لرسول الله ... مائة مرة" - it was counted for the Messenger of
 * Allah a hundred times in one sitting - is a narration about him, not an
 * instruction to this reader. And a count followed by "كل" governs several
 * phrases at once ("ثلاث مرات كل واحدة"), which is not one number for the row.
 */
const ARABIC_NARRATION = /كان يعد|قال |عن ابن|عن أبي|رواه|أخرجه|كل واحدة|كل واحدة منه|كل مرة/i;

/** Arabic numerals written as words, as the printed book writes them. */
const ARABIC_NUMBERS: Array<[RegExp, number]> = [
  [/مائة|مئة/, 100],
  [/أربعين/, 40],
  [/ثلاثين/, 30],
  [/عشرين/, 20],
  [/عشر/, 10],
  [/تسع/, 9],
  [/ثمان/, 8],
  [/سبع/, 7],
  [/ست\b|ستة/, 6],
  [/خمس/, 5],
  [/أربع/, 4],
  [/ثلاث/, 3],
  [/مرتين|مرّتين/, 2],
];
const ARABIC_PHRASE = /[\(\[]?\s*(مائة|مئة|أربعين|ثلاثين|عشرين|عشر|تسع|ثمان|سبع|ست|ستة|خمس|أربع|ثلاث|مرتين|مرّتين)\s*(?:مرات|مرة|مرّة)[^\u0621-\u064A]*/g;

/**
 * A count written as one word - "ثلاثاً" - which is how the book writes it
 * inside brackets: "أستغفر الله (ثلاثاً)".
 *
 * Accepted only in brackets or immediately followed by punctuation, so an
 * ordinary number inside a sentence is not mistaken for an instruction.
 */
const ARABIC_ADVERBIAL = /[\(\[]\s*(ثلاثاً|ثلاثا|أربعاً|أربعا|خمساً|خمسا|ستاً|ستا|سبعاً|سبعا|ثمانياً|ثمانيا|تسعاً|تسعا|عشراً|عشرا|مائة|مئة)\s*[\)\]]/g;
const ARABIC_SINGLE: Array<[RegExp, number]> = [
  [/مائة|مئة/, 100], [/عشر/, 10], [/تسع/, 9], [/ثمان/, 8], [/سبع/, 7],
  [/ست/, 6], [/خمس/, 5], [/أربع/, 4], [/ثلاث/, 3],
];

/** A count where it was found, so the sentence around it can be judged. */
type CountAt = { count: number; end: number };

/** Every repetition the Arabic states, in order. */
export function arabicCounts(text: string): CountAt[] {
  const source = String(text || '');
  /* A narration about the Prophet, or a count that governs several phrases,
     is not an instruction for the row. */
  if (ARABIC_NARRATION.test(source)) return [];
  const out: CountAt[] = [];
  source.replace(ARABIC_PHRASE, (whole, word: string, offset: number) => {
    const hit = ARABIC_NUMBERS.find(([pattern]) => pattern.test(word));
    if (hit) out.push({ count: hit[1], end: offset + whole.length });
    return whole;
  });
  source.replace(ARABIC_ADVERBIAL, (whole, word: string, offset: number) => {
    const hit = ARABIC_SINGLE.find(([pattern]) => pattern.test(word));
    if (hit) out.push({ count: hit[1], end: offset + whole.length });
    return whole;
  });
  return out.sort((a, b) => a.end - b.end);
}

/** A sentence is the window a match is judged in. */
function sentenceAround(text: string, at: number): string {
  const before = Math.max(text.lastIndexOf('.', at - 1), text.lastIndexOf('\n', at - 1));
  const stops = [text.indexOf('.', at), text.indexOf('\n', at)].filter((i) => i !== -1);
  const after = stops.length ? Math.min(...stops) : text.length;
  return text.slice(Math.max(before + 1, 0), after + 1);
}

/** Every count an English body states as an instruction, in order. */
export function englishCounts(text: string): CountAt[] {
  const out: CountAt[] = [];
  for (const pattern of [BRACKETED, VERBED]) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      if (NOT_AN_INSTRUCTION.test(sentenceAround(text, match.index))) continue;
      const value = numberOf(match[1]);
      if (value) out.push({ count: value, end: match.index + match[0].length });
    }
  }
  /* The bracketed and the verbed patterns both match "(Recite three times)";
     one instruction is one count. */
  const seen = new Set<number>();
  return out
    .filter((c) => (seen.has(c.end) ? false : (seen.add(c.end), true)))
    .sort((a, b) => a.end - b.end);
}

/**
 * What may follow a count and still leave it describing the whole row.
 *
 * "…three times in Arabic upon rising in the morning." is a qualifier: the
 * count governs everything above it. "…(three times) Allāhumma antas-salām…"
 * is not: the count governs the four words before it, and a counter on the
 * card would then be counting the wrong thing. So a count is accepted only
 * near the end of the wording - the last clause a person reads before they
 * start - and nowhere else. That discards a few true counts that sit
 * mid-passage, and it is the right way round to be wrong.
 */
const MAX_TRAILING = 60;

/** The count that closes a text, if it is stated once and stated last. */
function closingCount(counts: CountAt[], text: string): number | null {
  if (!counts.length) return null;
  const distinct = [...new Set(counts.map((c) => c.count))];
  /* A compound - three of this, thirty-three of that - is not one number. */
  if (distinct.length > 1) return null;
  const last = counts[counts.length - 1];
  const trailing = text.slice(last.end).trim();
  if (trailing.length > MAX_TRAILING) return null;
  /* A second number-word in the qualifier means the sentence continues to
     another count ("or one time to ward off…"). */
  if (COUNT_WORDS.test(trailing)) return null;
  return distinct[0];
}

const COUNT_WORDS = /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|times)\b|\d|[ثلاثأربعخمسستسبعثمانتسععشرمائةمئة]/i;

/**
 * The repetition of one dua, or null.
 *
 * `english` and `arabic` are the plain wording of the card, without the
 * citation line: "Muslim 4/2083" is a reference, not a count, and is never
 * read as one.
 */
export function repetitionOf(english: string, arabic: string): Repetition | null {
  const en = closingCount(englishCounts(english), english);
  const ar = closingCount(arabicCounts(arabic), arabic);

  /* Neither language states one at the end: no counter. */
  if (en === null && ar === null) return null;
  /* Both state one and disagree: the row has been read wrongly, so neither. */
  if (en !== null && ar !== null) {
    if (en !== ar) return null;
    return acceptable(en) ? { count: en, statedIn: 'both' } : null;
  }
  const only = en ?? ar;
  if (!acceptable(only as number)) return null;
  return { count: only as number, statedIn: en !== null ? 'english' : 'arabic' };

  /** A counter for one tap is not worth having, and 200 is not a sitting. */
  function acceptable(count: number): boolean {
    return Number.isInteger(count) && count >= 2 && count <= 100;
  }
}
