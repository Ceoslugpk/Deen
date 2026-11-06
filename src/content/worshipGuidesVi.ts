/**
 * The worship guides in Vietnamese.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the
 * Vietnamese wording, so a guide that has not been written here yet simply
 * reads in English rather than showing an empty screen.
 *
 * The register is the one a Vietnamese Muslim prays in, and it is the
 * terminology of the Ruwwad Center edition the reader is given
 * (`tr_vi_translation_pioneers_center`): lễ nguyện for the prayer, wudu for the
 * washing, ghusl for the full washing, ruku and sujood and tashahhud for its
 * parts, Salat al-Janazah for the funeral prayer, Taraweeh for the Ramadan
 * night prayer, istikhara, suhoor and iftar, Zakat al-Fitr for the Eid charity,
 * and nhịn chay for the fast. The testimony is Shahada — the word the copy
 * table uses elsewhere, so the guides and the rest of the interface agree.
 * Wudu, Zakat, Dhikr and Dua stay in their Arabic form, because the Vietnamese
 * editions carry no loanword for them and Vietnamese readers meet them that
 * way.
 *
 * The Prophet ﷺ is never named without the blessing.
 *
 * Vietnamese is written left-to-right, so these guides are only reachable
 * through a language code: the old `rtl` boolean could never have found them.
 *
 * Arabic numerals are kept, as the rest of the Vietnamese interface keeps them
 * — no digit conversion belongs here.
 */

export type WorshipGuideVi = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_VI: Record<string, WorshipGuideVi> = {
  'Wudu Guide': {
    title: 'Cẩm nang Wudu',
    subtitle: 'Chuẩn bị cho lễ nguyện một cách cẩn trọng',
    introduction: 'Một trình tự ngắn gọn dựa trên mệnh lệnh của Kinh Quran và thực hành được thuật lại của Thiên Sứ ﷺ.',
    steps: [
      'Bắt đầu với niyyah và nói Bismillah.',
      'Rửa cả hai tay.',
      'Súc miệng và xịt mũi.',
      'Rửa mặt.',
      'Rửa hai cánh tay đến khuỷu tay, bắt đầu từ bên phải.',
      'Lau đầu và hai tai.',
      'Rửa hai bàn chân đến mắt cá chân, bắt đầu từ bên phải.',
    ],
    note: 'Nước phải chạm tới những vùng bắt buộc. Hãy tham khảo một học giả đủ năng lực về bó bột, vết thương, lau lên giày dép, hoặc sự nghi ngờ dai dẳng.',
  },
  'Salah Guide': {
    title: 'Cẩm nang Salah',
    subtitle: 'Một cái nhìn tổng quan rõ ràng về lễ nguyện',
    introduction: 'Hãy học trình tự chính trước khi nghiên cứu các phán quyết chi tiết của trường phái jurisprudence của bạn.',
    steps: [
      'Hướng về Qibla với niyyah.',
      'Bắt đầu với takbir mở đầu.',
      'Đứng và đọc Al-Fatihah cùng thêm Kinh Quran ở nơi được quy định.',
      'Cúi người trong ruku một cách điềm tĩnh.',
      'Đứng lên và đứng thẳng.',
      'Thực hiện hai lần quỳ lạy với một khoảng nghỉ khi ngồi.',
      'Hoàn tất các đơn vị bắt buộc, tashahhud và salawat.',
      'Kết thúc bằng salam sang bên phải và bên trái.',
    ],
    note: 'Cái nhìn tổng quan này không thay thế cho việc học lễ nguyện trực tiếp từ một người thầy đủ năng lực.',
  },
  'Janazah Guide': {
    title: 'Cẩm nang Janazah',
    subtitle: 'Lễ nguyện tang lễ trong nháy mắt',
    introduction: 'Salat al-Janazah là một nghĩa vụ của cộng đồng và được thực hiện khi đang đứng, không cúi người và không quỳ lạy.',
    steps: [
      'Hình thành niyyah và hướng về Qibla.',
      'Sau takbir đầu tiên, hãy đọc Al-Fatihah.',
      'Sau takbir thứ hai, hãy gửi lời chúc phúc đến Thiên Sứ ﷺ.',
      'Sau takbir thứ ba, hãy thành tâm cầu xin cho người đã mất.',
      'Sau takbir thứ tư, hãy dừng lại một chút và kết thúc bằng salam.',
    ],
    note: 'Các chi tiết khác nhau giữa các trường phái pháp lý; hãy theo imam và tìm kiếm sự hướng dẫn của học giả địa phương.',
  },
  'Eid Prayer Guide': {
    title: 'Cẩm nang lễ nguyện Eid',
    subtitle: 'Chuẩn bị cho lễ nguyện tập thể',
    introduction: 'Eid được đánh dấu bằng sự tưởng nhớ, lòng biết ơn, lễ nguyện tập thể và sự rộng rãi.',
    steps: [
      'Thực hiện ghusl và mặc quần áo sạch sẽ.',
      'Với Eid al-Fitr, hãy ăn trước khi ra đi; với Eid al-Adha, thực hành địa phương có thể khác.',
      'Đọc takbir trên đường đi.',
      'Theo imam cho lễ nguyện hai rak ‘ah và các takbir thêm.',
      'Lắng nghe bài khutbah và ra về một cách tôn trọng.',
    ],
  },
  'Istikhara Guide': {
    title: 'Cẩm nang Istikhara',
    subtitle: 'Tìm kiếm sự hướng dẫn của Allah trong một quyết định',
    introduction: 'Istikhara kết hợp hai rak ‘ah tự nguyện với lời cầu xin của Thiên Sứ cho điều tốt nhất.',
    steps: [
      'Hãy xem xét các lựa chọn hợp pháp và tìm kiếm lời khuyên đúng đắn.',
      'Cầu nguyện hai rak ‘ah không bắt buộc.',
      'Đọc lời dua của istikhara đã được thuật lại, nêu rõ vấn đề.',
      'Tiến hành với sự tin tưởng; một giấc mơ là không bắt buộc.',
      'Hãy cởi mở với cách Allah làm cho vấn đề thuận lợi hoặc xoay nó đi.',
    ],
  },
  'Taraweeh Guide': {
    title: 'Cẩm nang Taraweeh',
    subtitle: 'Lễ nguyện ban đêm trong tháng Ramadan',
    introduction: 'Lễ nguyện ban đêm của Ramadan là một sự thờ phụng tự nguyện được thực hiện sau Isha.',
    steps: [
      'Cầu nguyện sau Isha, một mình hoặc cùng với cộng đồng.',
      'Cầu nguyện theo từng nhóm hai rak ‘ah.',
      'Hãy tụng đọc với sự chú tâm thay vì vội vã.',
      'Nghỉ ngơi khi cần và giữ sự tập trung.',
      'Kết thúc bằng Witr theo cách thực hành của bạn.',
    ],
  },
  Shahada: {
    title: 'Shahada',
    subtitle: 'Lời chứng của đức tin',
    introduction: 'Tôi làm chứng rằng không có thần linh nào xứng đáng được thờ phụng ngoại trừ Allah, và tôi làm chứng rằng Muhammad là Thiên Sứ của Allah.',
    steps: [
      'Hãy hiểu ý nghĩa của lời chứng.',
      'Hãy xác nhận nó một cách thành tâm và tự nguyện.',
      'Để chính thức bước vào Islam, hãy kết nối với một thánh đường địa phương đáng tin cậy để được hỗ trợ và học hỏi.',
    ],
  },
  'Ramadan Guide': {
    title: 'Cẩm nang Ramadan',
    subtitle: 'Một tháng của việc nhịn chay và Kinh Quran',
    introduction: 'Ramadan xoay quanh việc nhịn chay, lễ nguyện, Kinh Quran, bố thí, sự hối cải và phẩm hạnh tốt đẹp.',
    steps: [
      'Hãy đặt một kế hoạch thờ phụng thực tế.',
      'Giữ việc nhịn chay từ lúc bình minh thật sự đến khi mặt trời lặn.',
      'Hãy giữ gìn lời nói và cách cư xử cũng như thức ăn và thức uống.',
      'Hãy dùng suhoor, các lễ nguyện và iftar làm những điểm neo.',
      'Hãy tăng thêm Kinh Quran, dua, bố thí và phục vụ.',
      'Hãy tìm kiếm Laylatul Qadr trong mười đêm cuối.',
    ],
  },
  'Fasting Guide': {
    title: 'Cẩm nang nhịn chay',
    subtitle: 'Hướng dẫn thiết yếu về việc nhịn chay',
    introduction: 'Một ngày chay hợp lệ đòi hỏi niyyah thành tâm và sự kiêng cữ khỏi những điều làm hỏng nó trong suốt ngày chay.',
    steps: [
      'Hãy biết ngày chay đó là bắt buộc hay tự nguyện.',
      'Hãy thực hiện niyyah bắt buộc trước thời điểm áp dụng của nó.',
      'Hãy dùng suhoor và dừng lại trước lúc bình minh thật sự.',
      'Tránh thức ăn, thức uống, quan hệ vợ chồng và những điều cố ý làm hỏng cho đến khi mặt trời lặn.',
      'Hãy xả chay ngay khi mặt trời lặn.',
      'Hãy tìm kiếm lời khuyên đủ năng lực về bệnh tật, đi đường, thai kỳ, thuốc men hoặc các tình trạng mãn tính.',
    ],
    note: 'Hoàn cảnh sức khỏe là khác nhau. Hãy tham khảo cả một học giả đủ năng lực và một bác sĩ lâm sàng khi thích hợp.',
  },
  'Laylatul Qadr': {
    title: 'Laylatul Qadr',
    subtitle: 'Tìm kiếm Đêm Định Đoạt',
    introduction: 'Đêm Định Đoạt tốt hơn một nghìn tháng và được tìm kiếm trong những đêm cuối của Ramadan.',
    steps: [
      'Hãy tăng thêm lễ nguyện ban đêm trong mười đêm cuối.',
      'Tụng đọc và suy ngẫm về Kinh Quran.',
      'Làm nhiều dua và tưởng nhớ.',
      'Bố thí và làm hòa với người khác.',
      'Tránh khẳng định chắc chắn về một đêm cụ thể.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'Zakat al-Fitr',
    subtitle: 'Bố thí trước lễ nguyện Eid',
    introduction: 'Zakat al-Fitr đến hạn vào cuối tháng Ramadan đối với những người Muslim đủ điều kiện và nên đến tay người nhận trước lễ nguyện Eid.',
    steps: [
      'Hãy xác nhận trách nhiệm cho bản thân và những người phụ thuộc vào bạn.',
      'Hãy dùng thước đo lương thực chủ yếu được chấp nhận tại địa phương hoặc quan điểm bằng tiền mà các học giả địa phương đáng tin tưởng theo.',
      'Hãy xác định những người nhận đủ điều kiện.',
      'Hãy cho sớm để nó đến tay họ trước lễ nguyện Eid.',
      'Hãy giữ một hồ sơ địa phương riêng tư nếu điều đó hữu ích.',
    ],
    note: 'Số lượng và việc tiền mặt có được chấp nhận hay không là khác nhau theo quan điểm học giả và địa phương.',
  },
};

/**
 * Reference labels in Vietnamese.
 *
 * The numbers are left as they are: Vietnamese is written in Arabic numerals
 * throughout this app, so a reference reads "Kinh Quran 5:6" and not some other
 * digits. Only the words before the number change.
 */
export function vietnameseReference(label: string): string {
  return label
    .replace('Qur’an', 'Kinh Quran')
    .replace('Sahih al-Bukhari', 'Sahih al-Bukhari')
    .replace('Sahih Muslim', 'Sahih Muslim');
}
