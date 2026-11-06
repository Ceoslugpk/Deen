/**
 * The worship guides in Chinese.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the Chinese
 * wording, so a guide that has not been written here yet simply reads in
 * English rather than showing an empty screen.
 *
 * The register is the one a Chinese Muslim prays in, and it is what the rest of
 * the Chinese interface is written in: 小净 for the washing, 礼拜 for the
 * prayer, 鞠躬 and 叩头 and 中坐 for its parts, 殡礼 for the funeral prayer,
 * 泰拉威哈拜 for the Ramadan night prayer, 求善拜, 封斋饭 and 开斋, 开斋捐 for
 * the Eid charity, and 斋戒 for the fast. The testimony is 清真言 — the word a
 * Chinese household uses for it, and the word the copy table uses elsewhere, so
 * the guides and the rest of the interface agree.
 *
 * God is 真主 throughout. That is the name Chinese Muslims have used for
 * centuries, and it is the name in the Ma Jian translation the app serves; a
 * generic word for a deity would read as another religion entirely.
 *
 * The Prophet ﷺ is never named without the blessing.
 *
 * Chinese is written left-to-right, so these guides are only reachable through a
 * language code: the old `rtl` boolean could never have found them.
 *
 * The script is Simplified, matching the preset edition `tr_zh_ma_jian`.
 */

export type WorshipGuideZh = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_ZH: Record<string, WorshipGuideZh> = {
  'Wudu Guide': {
    title: '小净指南',
    subtitle: '用心为礼拜做准备',
    introduction: '依据古兰经的训示与先知ﷺ所传的做法而定的简明次第。',
    steps: [
      '以举意开始，并念太斯米。',
      '洗双手。',
      '漱口与呛鼻。',
      '洗脸。',
      '洗双臂至肘，从右侧开始。',
      '抹头与抹耳。',
      '洗双足至踝，从右侧开始。',
    ],
    note: '水必须到达规定须洗的部位。关于石膏、伤口、抹靴，或持续的疑虑，请向合格的学者请教。',
  },
  'Salah Guide': {
    title: '礼拜指南',
    subtitle: '礼拜的清晰概览',
    introduction: '先学习主要次第，再研习你所奉教法学派的详细判例。',
    steps: [
      '举意面向朝向。',
      '以开拜的大赞词开始。',
      '站立并诵读开端章，以及规定诵读的其他经文。',
      '从容地鞠躬。',
      '起身站直。',
      '做两次叩头，其间有一次坐定。',
      '完成必需的拜数、中坐与赞圣。',
      '以向右向左道安结束。',
    ],
    note: '本概览不能替代直接向合格教师学习礼拜。',
  },
  'Janazah Guide': {
    title: '殡礼指南',
    subtitle: '殡礼一览',
    introduction: '殡礼是一项集体义务，站立进行，没有鞠躬与叩头。',
    steps: [
      '心中举意，面向朝向。',
      '第一次大赞词之后，诵读开端章。',
      '第二次之后，为先知ﷺ祝福。',
      '第三次之后，为亡人诚心祈祷。',
      '第四次之后，稍作停顿，以道安结束。',
    ],
    note: '各教法学派的细节有所不同；跟随伊玛目，并寻求当地学者的指导。',
  },
  'Eid Prayer Guide': {
    title: '会礼拜指南',
    subtitle: '为集体礼拜做准备',
    introduction: '节日以记念、感恩、集体礼拜与慷慨为标志。',
    steps: [
      '做大净并穿着洁净衣物。',
      '开斋节出发前先进食；宰牲节各地做法可能不同。',
      '途中念诵大赞词。',
      '跟随伊玛目礼两拜及额外的大赞词。',
      '聆听呼图白，并恭敬地离开。',
    ],
  },
  'Istikhara Guide': {
    title: '求善拜指南',
    subtitle: '在决定中寻求真主的引导',
    introduction: '求善拜将两拜副功拜与先知寻求至善的祈祷结合在一起。',
    steps: [
      '考虑合法的选择，并寻求可靠的意见。',
      '礼两拜副功拜。',
      '诵念所传的求善都阿，并言明所求之事。',
      '凭信托前行；无需以梦境为凭。',
      '对真主如何促成或扭转此事保持开放。',
    ],
  },
  'Taraweeh Guide': {
    title: '泰拉威哈拜指南',
    subtitle: '斋月期间的夜间拜',
    introduction: '斋月夜间拜是在宵礼之后进行的自愿功修。',
    steps: [
      '宵礼之后礼拜，单独或随众皆可。',
      '以每两拜为一组礼拜。',
      '专注地诵读，而非匆忙。',
      '需要时休息，以保持专注。',
      '按你的做法以维特尔拜结束。',
    ],
  },
  Shahada: {
    title: '清真言',
    subtitle: '信仰的作证',
    introduction: '我作证：除真主外，绝无应受崇拜的；我又作证：穆罕默德是真主的使者。',
    steps: [
      '理解作证词的含义。',
      '诚心乐意地确信它。',
      '若要正式入教，请联系你信任的当地清真寺以获得支持与学习。',
    ],
  },
  'Ramadan Guide': {
    title: '斋月指南',
    subtitle: '斋戒与古兰经的一月',
    introduction: '斋月以斋戒、礼拜、古兰经、施舍、忏悔与美德为核心。',
    steps: [
      '制定切实可行的功修计划。',
      '从破晓至日落守斋。',
      '谨守言语与行为，如同谨守饮食。',
      '以封斋饭、礼拜与开斋作为支点。',
      '增加古兰经、都阿、施舍与服务。',
      '在后十夜寻求盖德尔之夜。',
    ],
  },
  'Fasting Guide': {
    title: '斋戒指南',
    subtitle: '斋戒基本指导',
    introduction: '有效的斋戒需要真诚的举意，并在斋戒日内远离坏斋之事。',
    steps: [
      '明确此斋戒是主命还是自愿。',
      '在相应时间之前做出必需的举意。',
      '进食封斋饭，于破晓前停止。',
      '避免饮食、夫妻同房及故意的坏斋之事，直到日落。',
      '日落后立即开斋。',
      '患病、旅行、怀孕、服药或慢性病时，请寻求专业意见。',
    ],
    note: '健康状况因人而异。适当时应同时咨询合格的学者与医生。',
  },
  'Laylatul Qadr': {
    title: '盖德尔之夜',
    subtitle: '寻求盖德尔之夜',
    introduction: '盖德尔之夜胜于一千个月，应在斋月的后几夜寻求。',
    steps: [
      '在后十日增加夜间拜。',
      '诵读并思考古兰经。',
      '多做都阿与记念。',
      '出散施舍，与他人和解。',
      '不要断言某一夜就是盖德尔之夜。',
    ],
  },
  'Zakat al-Fitr': {
    title: '开斋捐',
    subtitle: '会礼拜前的施舍',
    introduction: '开斋捐在斋月结束时对应缴纳者成为义务，并应在会礼拜之前送达受施者。',
    steps: [
      '确认对自己及所抚养者的责任。',
      '采用当地所接受的主食计量方式，或你所信任的当地学者所依循的货币观点。',
      '确定合资格的接受者。',
      '及早出散，以便会礼拜前送达。',
      '若有需要，可保留一份私密的本地记录。',
    ],
    note: '数额以及是否接受现金，因学者观点与地区而异。',
  },
};

/**
 * Rewrites the English reference labels into Chinese.
 *
 * The references themselves are not translated — a reader follows `5:6` or
 * `bukhari-164` to the source — only the words naming them are, so the label
 * reads in the language of the page around it.
 */
export function chineseReference(label: string): string {
  return label
    .replace('Qur’an', '古兰经')
    .replace('Sahih al-Bukhari', '布哈里圣训实录')
    .replace('Sahih Muslim', '穆斯林圣训实录');
}
