/**
 * The Umrah and Hajj journey in Vietnamese.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Vietnamese is
 * written left-to-right, so the old boolean could not reach it at all and
 * these screens would have stayed in English.
 *
 * The wording follows the vocabulary a Vietnamese Muslim actually uses, in
 * Latin script with full diacritics: ihrām, mīqāt, Tawaf, Sa‘i, vòng (the
 * circuit), talbiyah, cột đá (the pillar), Arafah, Mina, Muzdalifah, vật tế
 * (the sacrifice), Tawaf al-Ifādah, những ngày Tashreeq. Where the schools of
 * law differ — on what breaks ihram, on whether the sa'i of Hajj comes before
 * or after Tawaf al-Ifadah — the text says so and sends the reader to someone
 * qualified, instead of quietly picking one ruling and presenting it as the
 * only one.
 *
 * The short lines are the same strings the rest of the interface uses, so the
 * wording a person reads on the journey screen is the wording they meet
 * everywhere else.
 *
 * The Prophet ﷺ is never named without the blessing.
 */

export type JourneyStepVi = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_VI: Record<string, { intro: string }> = {
  umrah: {
    intro: 'Cuộc hành hương nhỏ: Ihram, Tawaf, Sa‘i, và cạo hoặc tỉa tóc. Nó có thể được thực hiện vào bất kỳ thời điểm nào trong năm.',
  },
  hajj: {
    intro: 'Cuộc hành hương lớn, diễn ra từ ngày 8 đến ngày 13 của tháng Dhul-Hijjah, với việc hiện diện tại ‘Arafah là trung tâm.',
  },
};

export const JOURNEY_STEPS_VI: Record<string, JourneyStepVi> = {
  // umrah
  prepare: {
    title: 'Chuẩn bị và niyyah',
    short: 'Vào Ihram trước khi vượt qua mīqāt',
    detail:
      'Hãy cắt móng và tỉa lông, làm lễ ghusl, và mặc trang phục Ihram trước khi vượt qua mīqāt phù hợp với hướng đi của bạn. Sau đó hãy niyyah thực hiện Umrah trong lòng và bắt đầu đọc talbiyah. Sau khi vào Ihram, không được cắt tóc hay cắt móng, (nam giới) không được mặc đồ may hay dùng nước hoa, không được săn bắn và không được kết hôn — điều gì làm hỏng Ihram và điều gì phải đền bù cho nó là khác nhau giữa các madhab, nên hãy xác nhận trường hợp của riêng bạn với một học giả mà bạn tin tưởng.',
  },
  talbiyah: {
    title: 'Talbiyah',
    short: 'Tiếp tục lặp lại cho đến khi bạn đến Haram',
    detail:
      '“Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa an-ni‘mata laka wa al-mulk, lā sharīka lak.” Nam giới đọc to; nữ giới đọc nhỏ. Hãy tiếp tục cho đến khi bạn bắt đầu Tawaf.',
  },
  tawaf: {
    title: 'Tawaf quanh Ka‘bah',
    short: 'Bảy vòng, bắt đầu từ Hòn Đá Đen',
    detail:
      'Hãy bắt đầu với niyyah tại Hòn Đá Đen và đi vòng quanh bảy lần, để Ka‘bah ở bên trái bạn. Mỗi lần đi ngang Hòn Đá Đen, hãy chạm vào nó hoặc ra hiệu về phía nó, và đọc bất kỳ lời dhikr hay Kinh Quran nào bạn có thể — không có lời cầu xin riêng nào được ấn định cho mỗi vòng. Nam giới đi nhanh trong ba vòng đầu. Khi hoàn tất, nếu có thể, hãy cầu nguyện hai rak‘ah phía sau Maqam Ibrahim, rồi uống nước Zamzam.',
    counterLabel: 'Vòng',
  },
  sai: {
    title: 'Sa‘i giữa Safa và Marwah',
    short: 'Bảy lượt giữa hai ngọn đồi',
    detail:
      'Đi bộ từ Safa đến Marwah — đó là một lượt — và quay lại, tổng cộng bảy lượt, kết thúc tại Marwah. Sa‘i là một nghi thức tự thân và không được rút ngắn. Hãy đi với nhịp độ của riêng bạn; chỉ đoạn giữa hai cột xanh mới đi nhanh.',
    counterLabel: 'Lượt',
  },
  halq: {
    title: 'Cạo hoặc tỉa tóc',
    short: 'Bước đưa bạn ra khỏi Ihram',
    detail:
      'Nam giới cạo đầu hoặc tỉa đều toàn bộ tóc; cạo là tốt hơn. Nữ giới cắt một đoạn bằng đầu ngón tay ở phần ngọn tóc. Với điều này, Umrah hoàn tất và mọi điều mà Ihram đã cấm lại trở nên hợp pháp.',
  },
  closing: {
    title: 'Ghi nhớ và kết thúc hành trình',
    short: 'Cầu nguyện hai rak‘ah và tỏ lòng biết ơn',
    detail:
      'Hãy cầu nguyện tại nơi bạn có thể trong khu Haram, bố thí nếu bạn có khả năng, và giữ lời cầu xin được đọc sau một nghi thức đã hoàn tất. Nhiều người sau đó lặp lại Umrah từ Al-Tan‘īm hoặc thực hiện lại cho người khác — đó là vấn đề thuộc về niyyah và khả năng của riêng bạn.',
  },

  // hajj
  intention: {
    title: 'Chọn loại Hajj',
    short: 'Tamattu‘, Qirān hoặc Ifrād',
    detail:
      'Tamattu‘: vào Ihram cho Umrah và hoàn tất nó, ra khỏi Ihram, rồi vào Ihram lại cho Hajj vào ngày thứ 8; trong trường hợp này có vật tế. Qirān: thực hiện Umrah và Hajj trong cùng một lần Ihram. Ifrād: chỉ vào Ihram cho Hajj và ở trong Ihram cho đến cuối. Loại nào tốt hơn và điều gì bắt buộc đối với mỗi loại phụ thuộc vào hoàn cảnh và madhab của bạn — hãy tìm hiểu và quyết định trước khi lên đường.',
  },
  ihram: {
    title: 'Vào Ihram',
    short: 'Làm ghusl, mặc trang phục, niyyah rồi bắt đầu talbiyah',
    detail:
      'Hãy làm lễ ghusl, mặc trang phục Ihram, rồi niyyah cho các nghi thức bạn đã chọn và bắt đầu đọc talbiyah. Các điều cấm của Ihram vẫn có hiệu lực cho đến khi bạn ném đá, làm vật tế và cạo hoặc tỉa tóc.',
  },
  qudum: {
    title: 'Tawaf đến nơi và Sa‘i',
    short: 'Tawaf Qudūm, rồi Sa‘i cho Tamattu‘',
    detail:
      'Khi đến Makkah, hãy thực hiện Tawaf đến nơi gồm bảy vòng và cầu nguyện hai rak‘ah. Với Tamattu‘, hãy tiếp nối bằng Sa‘i của Hajj (hoặc để dành Sa‘i cho sau Tawaf al-Ifādah — cả hai đều được các trường phái khác nhau coi là hợp lệ). Sau đó bạn vẫn ở trong tình trạng Ihram.',
    counterLabel: 'Vòng',
  },
  tarwiyah: {
    title: 'Ngày 8 Dhul-Hijjah — Mina',
    short: 'Ngày Tarwiyah, trải qua tại Mina',
    detail:
      'Nếu bạn đã ra khỏi Ihram, hãy vào Ihram lại cho Hajj và đi đến Mina; hãy cầu nguyện Dhuhr, Asr, Maghrib, Isha và Fajr ở đó — mỗi lễ nguyện được rút ngắn còn hai rak‘ah, nhưng không được gộp lại. Hãy trải qua đêm tại Mina trước khi đi tiếp đến Arafah.',
  },
  arafah: {
    title: 'Ngày 9 Dhul-Hijjah — Arafah',
    short: 'Việc hiện diện, chính là Hajj',
    detail:
      'Sau khi mặt trời mọc, hãy đi đến Arafah và ở lại đó từ sau Dhuhr cho đến khi mặt trời lặn; hãy gộp và rút ngắn Dhuhr với Asr. Toàn bộ Arafah là nơi để hiện diện, nhưng mọi người tụ tập gần tảng đá trên đồi Rahmah. Hãy lấp đầy ngày bằng talbiyah, dhikr, Kinh Quran, sự hối cải và lời cầu xin — Hajj tựa vào ngày này.',
  },
  muzdalifah: {
    title: 'Đêm tại Muzdalifah',
    short: 'Rời đi sau khi mặt trời lặn, cầu nguyện và nhặt sỏi',
    detail:
      'Hãy rời Arafah sau khi mặt trời lặn — trước lúc bình minh — và đi đến Muzdalifah; hãy gộp Maghrib với Isha tại đó và trải qua đêm. Hãy nhặt những viên sỏi để ném đá từ nơi này, rồi hướng về Mina trước hoặc vào lúc bình minh.',
  },
  aqaba: {
    title: 'Ngày 10 — Ném đá cột lớn',
    short: 'Bảy viên sỏi tại Jamrat al-‘Aqabah',
    detail:
      'Tại Mina, hãy ném bảy viên sỏi vào cột lớn (al-‘Aqabah), cột gần Makkah nhất, và nói “Allāhu akbar” với mỗi lần ném. Với lần ném đá này, việc thoát khỏi Ihram lớn hơn bắt đầu có hiệu lực.',
    counterLabel: 'Viên sỏi',
  },
  hady: {
    title: 'Ngày 10 — Vật tế và cạo tóc',
    short: 'Làm vật tế, rồi cạo hoặc tỉa tóc',
    detail:
      'Hãy làm vật tế bắt buộc cho Tamattu‘ và Qirān — ngày nay hầu hết người hành hương ủy quyền cho một đại diện được ủy nhiệm, và điều đó được chấp nhận. Sau đó hãy cạo đầu hoặc tỉa tóc; nữ giới cắt một đoạn bằng đầu ngón tay. Khi việc ném đá, vật tế và cạo tóc đã hoàn tất, mọi điều mà Ihram đã cấm đều trở nên hợp pháp ngoại trừ việc gần gũi vợ chồng.',
  },
  ifadah: {
    title: 'Từ ngày 10 đến 12 — Tawaf al-Ifādah',
    short: 'Trụ cột của Hajj, và Sa‘i nếu vẫn còn mắc nợ',
    detail:
      'Hãy quay lại Makkah để thực hiện Tawaf al-Ifādah, bảy vòng, tiếp nối bằng Sa‘i nếu bạn chưa thực hiện nó cho Hajj. Tawaf này là trụ cột thiết yếu: Hajj không hoàn tất nếu thiếu nó.',
    counterLabel: 'Vòng',
  },
  tashreeq: {
    title: 'Từ ngày 11 đến 13 — Những ngày Tashreeq',
    short: 'Ba cột mỗi buổi chiều, rồi ở lại Mina',
    detail:
      'Mỗi ngày sau Dhuhr, hãy ném đá ba cột theo thứ tự — cột nhỏ, rồi cột giữa, rồi cột lớn — bảy viên sỏi mỗi cột, và nói “Allāhu akbar” với mỗi lần ném. Hãy trải qua những đêm này tại Mina. Người ném đá xong và rời đi vào ngày 12 thì ra đi không có lỗi; người ở lại đến ngày 13 cũng không có lỗi.',
    counterLabel: 'Viên sỏi',
  },
  wada: {
    title: 'Tawaf giã biệt',
    short: 'Tawaf al-Wadā‘ trước khi rời Makkah',
    detail:
      'Trước khi trở về nhà, hãy thực hiện bảy vòng như Tawaf giã biệt, rồi cầu nguyện hai rak‘ah và ra về. Với bất kỳ ai rời khỏi Makkah, đây là nghi thức cuối cùng của Hajj.',
    counterLabel: 'Vòng',
  },

};
