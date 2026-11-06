/**
 * The Umrah and Hajj journey in Chinese.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Chinese is
 * written left-to-right, so the old boolean could not reach it at all and these
 * screens would have stayed in English.
 *
 * The wording follows the vocabulary a Chinese Muslim actually uses: 受戒, 戒
 * 关, 环游, 奔走, 应召词, 石柱, 阿拉法特, 米那, 穆兹代里法, 牺牲, 正朝环游, 晒
 * 肉日, 禁寺, 渗渗泉, 易卜拉欣立足处. Where the schools of law differ — on what
 * breaks ihram, on whether the sa‘i of Hajj comes before or after Tawaf
 * al-Ifādah — the text says so and sends the reader to someone qualified,
 * instead of quietly picking one ruling and presenting it as the only one.
 *
 * The short lines are the same strings the rest of the interface uses, so the
 * wording a person reads on the journey screen is the wording they meet
 * everywhere else.
 *
 * The Prophet ﷺ is never named without the blessing. God is 真主, matching the
 * Ma Jian translation the app serves.
 *
 * The script is Simplified.
 */

export type JourneyStepZh = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_ZH: Record<string, { intro: string }> = {
  umrah: {
    intro: '小朝：受戒、环游、奔走，以及剃发或剪发。一年中任何时候都可以进行。',
  },
  hajj: {
    intro: '大朝，在都尔黑哲月八日至十三日，以阿拉法特的驻站为核心。',
  },
};

export const JOURNEY_STEPS_ZH: Record<string, JourneyStepZh> = {
  prepare: {
    title: '准备与举意',
    short: '在越过戒关之前进入受戒状态',
    detail:
      '修剪指甲与毛发，沐浴，并在越过你行进方向的戒关之前穿上戒衣。然后在心中为副朝举意，并开始念应召词。进入受戒之后，不得剪发剪甲、不得穿缝制衣物或使用香料（男子）、不得狩猎、不得缔结婚约 — 何者破坏受戒、何者为之罚赎，各学派细节不同，因此请向你信任的学者确认你自己的情况。',
  },
  talbiyah: {
    title: '应召词',
    short: '反复念诵，直到抵达禁寺',
    detail:
      '「主啊，我应召而来，我应召而来；我应召而来，你绝无伙伴，我应召而来。一切赞颂、恩典与权柄都归于你，你绝无伙伴。」男子高声念诵，女子低声念诵。持续念诵，直到你开始环游。',
  },
  tawaf: {
    title: '环游天房',
    short: '七圈，自黑石起',
    detail:
      '自黑石进入，举意开始，围绕天房七圈，天房在你的左侧。每次经过黑石时触摸或以手示意，并诵念你容易记住的记念或古兰经 — 每一圈并没有规定特定的祈祷词。男子在前三圈快步行走。完成之后，若方便，在易卜拉欣立足处后方礼两拜，然后饮渗渗泉水。',
  },
  sai: {
    title: '萨法与麦尔瓦之间的奔走',
    short: '两丘之间的七趟',
    detail:
      '从萨法走到麦尔瓦 — 这是一趟 — 再折返，共七趟，终点在麦尔瓦。奔走是独立的仪式，不可缩短。以你自己的步速行走；只有两个绿色标记之间的那一段需加快脚步。',
  },
  halq: {
    title: '剃发或剪发',
    short: '使你脱离受戒状态的步骤',
    detail:
      '男性剃发或普遍剪短；剃发更佳。女性从发梢剪去一个指尖的长度。至此副朝完成，受戒所禁的一切重归合法。',
  },
  closing: {
    title: '记念，并结束旅程',
    short: '礼两拜并感恩',
    detail:
      '在禁寺中尽你所能礼拜，有能力则出散施舍，并保持完成仪式后的祈祷。许多人随后从坦伊姆再次做副朝，或代他人再做一次 — 这取决于你自己的举意与能力。',
  },
  intention: {
    title: '选择你的朝觐方式',
    short: '享受朝、连朝或单朝',
    detail:
      '享受朝：为副朝受戒，完成副朝后开戒，再于八日为朝觐重新受戒；它需宰一只牺牲。连朝：以一次受戒同时完成副朝与朝觐。单朝：只为朝觐受戒，并全程保持受戒。哪一种更优越、各需什么，取决于你的处境与学派 — 出发前应以知识作出决定。',
  },
  ihram: {
    title: '进入受戒',
    short: '沐浴、着装、举意，并开始念应召词',
    detail:
      '沐浴并穿上戒衣，然后为你所选的仪式举意，并开始念应召词。受戒的禁戒自此生效，直到你射石、宰牲并剃发或剪发。',
  },
  qudum: {
    title: '到达环游与奔走',
    short: '到达环游，然后为享受朝而奔走',
    detail:
      '抵达麦加后，环游七圈作为到达环游，并礼两拜。若为享受朝，则随之进行朝觐的奔走（或将奔走留至正朝环游之后 — 不同学派均认为两者有效）。此后你仍处于受戒状态。',
  },
  tarwiyah: {
    title: '都尔黑哲月八日 — 米那',
    short: '渗渗日，在米那度过',
    detail:
      '若已脱离受戒，则为朝觐重新进入受戒，并前往米那，在那里礼晌礼、晡礼、昏礼、宵礼与晨礼，每番缩短为两拜但不合并。在米那过夜，然后前往阿拉法特。',
  },
  arafah: {
    title: '都尔黑哲月九日 — 阿拉法特',
    short: '驻站，即朝觐之核心',
    detail:
      '日出之后前往阿拉法特，从正午驻站至日落，晌礼与晡礼合并并缩短。整个阿拉法特都是驻站之地，不过人们多聚集在慈悯山的岩石处。让这一天充满应召词、记念、古兰经、忏悔与祈祷 — 朝觐正系于这一天。',
  },
  muzdalifah: {
    title: '穆兹代里法之夜',
    short: '日落后出发、礼拜并捡拾石子',
    detail:
      '日落后 — 破晓前 — 离开阿拉法特，前往穆兹代里法，在那里合并礼昏礼与宵礼并过夜。在此捡拾射石用的石子，然后在破晓前后前往米那。',
  },
  aqaba: {
    title: '初十日 — 射大石柱',
    short: '在阿格白石柱投七颗石子',
    detail:
      '在米那，以七颗石子射大石柱（阿格白，最靠近麦加的一根），每投一次念「真主至大」。此次射石后，受戒的大部分禁戒即告解除。',
  },
  hady: {
    title: '初十日 — 宰牲与剃发',
    short: '宰牲，然后剃发或剪发',
    detail:
      '为享受朝与连朝献上应宰的牺牲 — 如今多数朝觐者委托授权代理，这是被接受的。然后剃发或剪短头发；女性从发梢剪去一个指尖的长度。射石、宰牲与剃发完成后，除夫妻同房之外，受戒所禁的一切重归合法。',
  },
  ifadah: {
    title: '初十至十二日 — 正朝环游',
    short: '朝觐的支柱，若奔走仍未完成则补之',
    detail:
      '返回麦加进行正朝环游，共七圈，若尚未为朝觐完成奔走则随之进行。此环游是核心支柱：没有它，朝觐不成立。',
  },
  tashreeq: {
    title: '十一日至十三日 — 晒肉日',
    short: '每日下午射三根石柱，然后前往米那',
    detail:
      '每日午后，依次射三根石柱 — 小柱、中柱，然后大柱 — 每柱七颗石子，每投一次念「真主至大」。这几夜在米那度过。在十二日射石后离开者，毫无罪过；留至十三日者，也毫无罪过。',
  },
  wada: {
    title: '辞朝环游',
    short: '离开麦加之前的辞朝环游',
    detail:
      '启程回家之前，环游七圈作为辞朝环游，然后礼两拜并离开。这是任何离开麦加之人的最后一项朝觐仪式。',
  },
};
