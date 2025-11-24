import * as principlesImages from '@/assets/images/principles';

interface PrincipleBlock {
  text: string;
  examples: string[];
}

interface Principle {
  number: number;
  title: string;
  image?: string; // Optional image URL
  content: PrincipleBlock[];
}

// Detailed Data based on your screenshot
export const principlesData: Principle[] = [
  {
    number: 1,
    title: 'Nguyên tắc phân nhỏ (Segmentation)',
    image: principlesImages.PhanNho,
    content: [
      {
        text: 'Chia đối tượng thành các phần độc lập.',
        examples: [
          'Thay máy tính mainframe khổ lớn bằng các máy tính cá nhân nối mạng.',
          'Chia xe tải lớn thành xe đầu kéo và rơ-moóc.',
          'Chia dự án lớn thành các gói công việc nhỏ (WBS).',
        ],
      },
      {
        text: 'Làm đối tượng trở nên dễ tháo lắp.',
        examples: [
          'Đồ nội thất dạng lắp ghép (như IKEA).',
          'Sử dụng các khớp nối nhanh trong đường ống nước.',
        ],
      },
      {
        text: 'Tăng mức độ phân nhỏ hoặc phân đoạn của đối tượng.',
        examples: [
          'Thay rèm vải liền bằng rèm sáo (nhiều mảnh nhỏ).',
          'Sử dụng kim loại dạng bột để hàn thay vì dùng que hàn hay lá kim loại.',
        ],
      },
    ],
  },
  {
    number: 2,
    title: 'Nguyên tắc tách khỏi (Taking out)',
    image: principlesImages.TachKhoi,
    content: [
      {
        text: 'Tách phần gây phiền toái (tính chất gây hại) ra khỏi đối tượng, hoặc chỉ giữ lại những phần cần thiết.',
        examples: [
          'Đặt máy nén khí ồn ào ra bên ngoài toà nhà, chỉ dẫn khí nén vào trong.',
          'Sử dụng cáp quang hoặc ống dẫn sáng để tách nguồn nhiệt nóng ra khỏi nơi cần chiếu sáng.',
          'Sử dụng tiếng chó sủa để báo động chống trộm mà không cần nuôi chó thật.',
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'Nguyên tắc phẩm chất cục bộ (Local Quality)',
    image: principlesImages.PhamChatCucBo,
    content: [
      {
        text: 'Chuyển cấu trúc của đối tượng (hoặc môi trường bên ngoài) từ đồng nhất sang không đồng nhất.',
        examples: [
          'Sử dụng gradient nhiệt độ, mật độ hoặc áp suất thay vì để hằng số.',
        ],
      },
      {
        text: 'Làm cho mỗi phần của đối tượng hoạt động trong các điều kiện thích hợp nhất.',
        examples: [
          'Hộp cơm trưa có các ngăn riêng biệt cho đồ ăn nóng, đồ ăn lạnh và chất lỏng.',
        ],
      },
      {
        text: 'Làm cho mỗi phần của đối tượng thực hiện một chức năng hữu ích khác nhau.',
        examples: [
          'Bút chì có gắn cục tẩy.',
          'Búa có đầu nhổ đinh.',
          'Kìm đa năng (dao Thụy Sĩ): vừa là kìm, dao, tuốc nơ vít, dũa móng tay...',
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Nguyên tắc phản đối xứng (Asymmetry)',
    image: principlesImages.PhanDoiXung,
    content: [
      {
        text: 'Chuyển hình dạng của đối tượng từ đối xứng sang không đối xứng.',
        examples: [
          'Cánh khuấy không đối xứng trong máy trộn bê tông giúp trộn đều hơn.',
          'Làm vát một mặt trục tròn để gắn núm vặn chắc chắn hơn.',
        ],
      },
      {
        text: 'Nếu đối tượng đã không đối xứng, hãy tăng mức độ không đối xứng của nó lên.',
        examples: [
          'Chuyển doăng cao su từ hình tròn sang hình bầu dục hoặc hình thù đặc biệt để làm kín tốt hơn.',
          'Sử dụng kính quang học phi cầu (astigmatic) để hội tụ màu sắc tốt hơn.',
        ],
      },
    ],
  },
  {
    number: 5,
    title: 'Nguyên tắc kết hợp (Merging)',
    image: principlesImages.KetHop,
    content: [
      {
        text: 'Kết hợp các đối tượng đồng nhất hoặc các đối tượng dùng cho các hoạt động kế cận.',
        examples: [
          'Hệ thống máy tính song song (Cluster).',
          'Các cánh tản nhiệt được ghép lại với nhau.',
        ],
      },
      {
        text: 'Kết hợp về mặt thời gian các hoạt động đồng nhất hoặc kế cận.',
        examples: [
          'Vừa ăn vừa xem tivi.',
          'Kết hợp sưởi ấm không khí khi đang thông gió.',
        ],
      },
    ],
  },
  // ... Bạn có thể thêm tiếp các nguyên tắc 6-40 theo cấu trúc này
  {
    number: 6,
    title: 'Nguyên tắc vạn năng (Universality)',
    image: principlesImages.VanNang,
    content: [
      {
        text: 'Đối tượng thực hiện nhiều chức năng khác nhau, do đó không cần các đối tượng khác.',
        examples: [
          'Ghế sofa chuyển thành giường ngủ.',
          'Minivan: ghế ngồi có thể gập lại để chở hàng.',
        ],
      },
    ],
  },
  {
    number: 7,
    title: 'Nguyên tắc chứa trong (Nested Doll)',
    image: principlesImages.ChuaTrong,
    content: [
      {
        text: 'Đặt đối tượng này bên trong đối tượng khác.',
        examples: [
          'Búp bê Nga.',
          'Ống kính máy ảnh zoom (ống này nằm trong ống kia).',
        ],
      },
    ],
  },
  {
    number: 8,
    title: 'Nguyên tắc phản trọng lượng (Anti-weight)',
    image: principlesImages.PhanTrongLuc,
    content: [
      {
        text: 'Để bù đắp trọng lượng của một vật thể, hãy kết hợp nó với các vật thể khác có khả năng nâng.',
        examples: [
          'Bơm chất tạo bọt vào một bó gỗ để giúp vật thể nổi tốt hơn.',
          'Khinh khí cầu quảng cáo.',
        ],
      },
      {
        text: 'Để bù đắp trọng lượng của một vật thể, hãy để nó tương tác với môi trường (ví dụ: sử dụng lực khí động học, lực thủy động, lực nổi và các lực khác)',
        examples: [
          'Hình dạng cánh máy bay làm giảm mật độ không khí phía trên cánh, tăng mật độ phía dưới cánh để tạo lực nâng. (Điều này cũng minh họa cho Nguyên lý 4, Tính bất đối xứng.)',
          'Các dải xoáy cải thiện lực nâng của cánh máy bay.',
          'Cánh ngầm nâng tàu lên khỏi mặt nước để giảm lực cản.',
        ],
      },
    ],
  },
  {
    number: 9,
    title: 'Nguyên tắc gây ứng suất sơ bộ (Preliminary Anti-action)',
    image: principlesImages.UngXuatSoBo,
    content: [
      {
        text: 'Gây tác động ngược chiều trước khi thực hiện tác động chính.',
        examples: [
          'Bê tông cốt thép ứng lực trước.',
          'Uốn cong thanh kim loại theo chiều ngược lại trước khi chịu lực.',
        ],
      },
    ],
  },
  {
    number: 10,
    title: 'Nguyên tắc thực hiện sơ bộ (Preliminary Action)',
    image: principlesImages.ThucHienSoBo,
    content: [
      {
        text: 'Thực hiện thay đổi cần thiết đối với một vật thể trước khi cần thiết (toàn bộ hoặc một phần).',
        examples: ['Giấy dán tường dán sẵn.', 'Thực phẩm chế biến sẵn.'],
      },
      {
        text: 'Sắp xếp trước các vật thể sao cho chúng có thể hoạt động từ vị trí thuận tiện nhất và không mất thời gian giao hàng.',
        examples: [
          'Sắp xếp Kanban trong nhà máy Just-In-Time.',
          'Ô sản xuất linh hoạt.',
        ],
      },
    ],
  },
  {
    number: 11,
    title: 'Nguyên tắc dự phòng (Beforehand Cushioning)',
    image: principlesImages.DuPhong,
    content: [
      {
        text: 'Chuẩn bị trước các phương tiện khẩn cấp để bù đắp cho độ tin cậy tương đối thấp của đối tượng.',
        examples: [
          'Dải từ trên phim chụp ảnh để chỉ dẫn máy rửa phim bù trừ cho việc phơi sáng kém.',
          'Dù dự phòng.',
          'Hệ thống khí nén phụ trợ cho các thiết bị máy bay.',
        ],
      },
    ],
  },
  {
    number: 12,
    title: 'Nguyên tắc đẳng thế (Equipotentiality)',
    image: principlesImages.DangThe,
    content: [
      {
        text: 'Trong trường lực thế (ví dụ trọng trường), hạn chế thay đổi vị trí (ví dụ: thay đổi điều kiện làm việc để loại bỏ nhu cầu nâng hoặc hạ đối tượng).',
        examples: [
          'Hệ thống lò xo đẩy linh kiện trong nhà máy (để linh kiện luôn ở cùng độ cao tay với).',
          'Các âu thuyền (lock) trong kênh đào nối giữa hai vùng nước (Kênh đào Panama).',
          'Giá đỡ trong nhà máy ô tô đưa mọi công cụ đến đúng vị trí làm việc (cũng minh họa cho Nguyên tắc 10: Thực hiện sơ bộ).',
        ],
      },
    ],
  },
  {
    number: 13,
    title: 'Nguyên tắc đảo ngược (The Other Way Round)',
    image: principlesImages.DaoNguoc,
    content: [
      {
        text: 'Đảo ngược hành động được sử dụng để giải quyết vấn đề (ví dụ: thay vì làm lạnh, hãy làm nóng nó).',
        examples: [
          'Để nới lỏng các bộ phận bị kẹt, làm lạnh bộ phận bên trong thay vì nung nóng bộ phận bên ngoài.',
          'Đưa ngọn núi đến với Mohammed, thay vì đưa Mohammed đến ngọn núi.',
        ],
      },
      {
        text: 'Làm cho các bộ phận chuyển động (hoặc môi trường bên ngoài) trở nên cố định, và các bộ phận cố định trở nên chuyển động.',
        examples: [
          'Xoay chi tiết gia công thay vì xoay dụng cụ cắt.',
          'Băng chuyền di chuyển chở người đứng yên (thang cuốn phẳng).',
          'Máy chạy bộ (tạo cảm giác chạy trong khi đứng yên tại chỗ).',
        ],
      },
      {
        text: 'Lật ngược đối tượng (hoặc quy trình) từ trên xuống dưới.',
        examples: [
          'Lật ngược cụm lắp ráp để lắp ốc vít (đặc biệt là vít gầm).',
          'Đổ ngũ cốc ra khỏi container (tàu hoặc toa xe) bằng cách lật ngược chúng.',
        ],
      },
    ],
  },
  {
    number: 14,
    title: 'Nguyên tắc cầu hóa (Spheroidality - Curvature)',
    image: principlesImages.CauTronHoa,
    content: [
      {
        text: 'Thay vì sử dụng các bộ phận, bề mặt thẳng, hãy sử dụng các dạng cong; chuyển từ bề mặt phẳng sang bề mặt cầu; từ khối lập phương sang cấu trúc hình cầu.',
        examples: ['Sử dụng vòm và mái vòm để tăng độ bền trong kiến trúc.'],
      },
      {
        text: 'Sử dụng con lăn, viên bi, đường xoắn ốc, mái vòm.',
        examples: [
          'Bánh răng xoắn ốc (Nautilus) tạo lực kháng liên tục để nâng tạ.',
          'Bút bi và bút dạ bi để phân phối mực trơn tru.',
        ],
      },
      {
        text: 'Chuyển từ chuyển động tịnh tiến sang chuyển động quay, sử dụng lực ly tâm.',
        examples: [
          'Tạo chuyển động tịnh tiến của con trỏ trên màn hình máy tính bằng chuột bi (trackball) hoặc chuột quang.',
          'Thay việc vắt quần áo (ép nước) bằng cách quay ly tâm trong máy giặt.',
          'Sử dụng bánh xe cầu thay vì bánh xe trụ để di chuyển đồ nội thất.',
        ],
      },
    ],
  },
  {
    number: 15,
    title: 'Nguyên tắc linh động (Dynamics)',
    image: principlesImages.LinhDong,
    content: [
      {
        text: 'Cho phép (hoặc thiết kế) các đặc tính của đối tượng, môi trường bên ngoài hoặc quy trình thay đổi để tối ưu hóa điều kiện hoạt động.',
        examples: [
          'Vô lăng điều chỉnh được độ cao (hoặc ghế ngồi, tựa lưng, vị trí gương...).',
        ],
      },
      {
        text: 'Chia đối tượng thành các phần có khả năng chuyển động tương đối với nhau.',
        examples: [
          'Bàn phím máy tính dạng "cánh bướm" tách đôi (cũng minh họa cho Nguyên tắc 7: Chứa trong).',
        ],
      },
      {
        text: 'Nếu đối tượng (hoặc quy trình) cứng nhắc hoặc không linh hoạt, hãy làm cho nó có thể di chuyển hoặc thích ứng.',
        examples: [
          'Ống nội soi mềm để kiểm tra động cơ.',
          'Ống nội soi y tế mềm để kiểm tra đại tràng.',
        ],
      },
    ],
  },
  {
    number: 16,
    title: 'Nguyên tắc giải thiếu hoặc thừa (Partial or Excessive Actions)',
    image: principlesImages.GiaiThieuHoacThua,
    content: [
      {
        text: 'Nếu khó đạt được 100% hiệu quả mong muốn bằng một phương pháp nhất định, thì bằng cách sử dụng "ít hơn một chút" hoặc "nhiều hơn một chút" cùng phương pháp đó, vấn đề có thể được giải quyết dễ dàng hơn đáng kể.',
        examples: [
          'Phun sơn phủ tràn ra ngoài (Over spray), sau đó loại bỏ phần thừa. (Hoặc sử dụng khuôn tô/stencil - đây là ứng dụng của Nguyên tắc 3: Phẩm chất cục bộ và Nguyên tắc 9: Gây ứng suất sơ bộ).',
          'Đổ đầy bình, sau đó "rót thêm" (top off) khi đổ xăng cho xe hơi.',
        ],
      },
    ],
  },
  {
    number: 17,
    title: 'Nguyên tắc chuyển sang chiều khác (Another Dimension)',
    image: principlesImages.ChuyenSangChieuKhac,
    content: [
      {
        text: 'Di chuyển một đối tượng trong không gian hai hoặc ba chiều.',
        examples: [
          'Chuột máy tính hồng ngoại di chuyển trong không gian để thuyết trình, thay vì trên mặt phẳng.',
          'Công cụ cắt 5 trục có thể được định vị ở bất cứ đâu cần thiết.',
        ],
      },
      {
        text: 'Sử dụng sự sắp xếp đa tầng thay vì sắp xếp đơn tầng.',
        examples: [
          'Hộp đĩa (Cassette) chứa 6 CD để tăng thời gian phát nhạc và sự đa dạng.',
          'Các chip điện tử gắn trên cả hai mặt của bo mạch in.',
          'Nhân viên "biến mất" khỏi tầm mắt khách hàng trong công viên giải trí, đi xuống đường hầm và đi bộ đến nhiệm vụ tiếp theo, nơi họ quay lại mặt đất và xuất hiện một cách kỳ diệu.',
        ],
      },
      {
        text: 'Nghiêng hoặc định hướng lại đối tượng, đặt nó nằm nghiêng.',
        examples: ['Xe tải tự đổ (Dump truck).'],
      },
      {
        text: 'Sử dụng "mặt bên kia" của một diện tích nhất định.',
        examples: [
          'Xếp chồng các mạch lai ghép vi điện tử để cải thiện mật độ.',
        ],
      },
    ],
  },
  {
    number: 18,
    title: 'Nguyên tắc dao động cơ học (Mechanical Vibration)',
    image: principlesImages.CoDongHoc,
    content: [
      {
        text: 'Làm cho đối tượng dao động hoặc rung động.',
        examples: ['Dao khắc điện có lưỡi rung.'],
      },
      {
        text: 'Tăng tần số rung (thậm chí lên đến mức siêu âm).',
        examples: ['Phân phối bột bằng rung động.'],
      },
      {
        text: 'Sử dụng tần số cộng hưởng của đối tượng.',
        examples: ['Phá sỏi mật hoặc sỏi thận bằng cộng hưởng siêu âm.'],
      },
      {
        text: 'Sử dụng bộ rung áp điện thay vì bộ rung cơ học.',
        examples: [
          'Dao động tinh thể thạch anh vận hành đồng hồ độ chính xác cao.',
        ],
      },
      {
        text: 'Sử dụng kết hợp dao động siêu âm và trường điện từ.',
        examples: ['Trộn hợp kim trong lò cảm ứng.'],
      },
    ],
  },
  {
    number: 19,
    title: 'Nguyên tắc tác động theo chu kỳ (Periodic Action)',
    image: principlesImages.TacDongChuKy,
    content: [
      {
        text: 'Thay vì hành động liên tục, hãy sử dụng các hành động theo chu kỳ hoặc xung.',
        examples: [
          'Đóng đinh bằng cách gõ búa liên tục.',
          'Thay thế còi báo động liên tục bằng âm thanh ngắt quãng.',
        ],
      },
      {
        text: 'Nếu một hành động đã theo chu kỳ, hãy thay đổi biên độ hoặc tần số của chu kỳ đó.',
        examples: [
          'Sử dụng Điều chế Tần số (FM) để truyền thông tin, thay vì mã Morse.',
          'Thay thế còi báo động liên tục bằng âm thanh thay đổi biên độ và tần số.',
        ],
      },
      {
        text: 'Sử dụng khoảng nghỉ giữa các xung để thực hiện một hành động khác.',
        examples: [
          'Trong hồi sức tim phổi (CPR), thổi ngạt sau mỗi 5 lần ép ngực.',
        ],
      },
    ],
  },
  {
    number: 20,
    title: 'Nguyên tắc liên tục tác động có ích (Continuity of Useful Action)',
    image: principlesImages.LienTucTacDongCoIch,
    content: [
      {
        text: 'Tiến hành công việc liên tục; làm cho tất cả các bộ phận của đối tượng hoạt động hết công suất, mọi lúc.',
        examples: [
          'Bánh đà (hoặc hệ thống thủy lực) tích trữ năng lượng khi xe dừng, để động cơ có thể tiếp tục chạy ở công suất tối ưu.',
          'Vận hành các khâu nút thắt cổ chai trong nhà máy một cách liên tục để đạt tốc độ tối ưu (từ lý thuyết điểm hạn chế, hoặc vận hành theo nhịp sản xuất - takt time).',
        ],
      },
      {
        text: 'Loại bỏ tất cả các hành động hoặc công việc nhàn rỗi hoặc gián đoạn.',
        examples: [
          'In trong quá trình quay về của đầu in - máy in kim, máy in daisy wheel, máy in phun.',
        ],
      },
    ],
  },
  {
    number: 21,
    title: 'Nguyên tắc vượt nhanh (Skipping)',
    image: principlesImages.VuotNhanh,
    content: [
      {
        text: 'Thực hiện một quá trình hoặc các giai đoạn nhất định (ví dụ: các hoạt động có hại, nguy hiểm hoặc dễ gây hư hỏng) với tốc độ cao.',
        examples: [
          'Sử dụng mũi khoan nha khoa tốc độ cao để tránh làm nóng mô tế bào.',
          'Cắt nhựa nhanh hơn tốc độ truyền nhiệt của vật liệu để tránh làm biến dạng hình dáng.',
        ],
      },
    ],
  },
  {
    number: 22,
    title: 'Nguyên tắc biến hại thành lợi (Blessing in disguise)',
    image: principlesImages.BienHaiThanhLoi,
    content: [
      {
        text: 'Sử dụng các tác nhân gây hại (đặc biệt là tác động xấu của môi trường) để đạt được hiệu quả tích cực.',
        examples: [
          'Sử dụng nhiệt thải để phát điện.',
          'Tái chế vật liệu thải (phế liệu) từ quy trình này thành nguyên liệu mới cho quy trình khác.',
        ],
      },
      {
        text: 'Loại bỏ tác động có hại chính bằng cách thêm vào một tác động có hại khác để giải quyết vấn đề.',
        examples: [
          'Thêm chất đệm vào dung dịch ăn mòn.',
          'Sử dụng hỗn hợp Helium-Oxy khi lặn sâu để loại bỏ cả cơn mê nitơ và ngộ độc oxy từ không khí thường.',
        ],
      },
      {
        text: 'Tăng cường một yếu tố có hại đến mức nó không còn gây hại nữa.',
        examples: [
          'Sử dụng ngọn lửa ngược chiều (đốt chặn đầu) để loại bỏ nhiên liệu của đám cháy rừng.',
        ],
      },
    ],
  },
  {
    number: 23,
    title: 'Nguyên tắc phản hồi (Feedback)',
    image: principlesImages.QuanHePhanHoi,
    content: [
      {
        text: 'Đưa vào sự phản hồi (tham chiếu ngược, kiểm tra chéo) để cải thiện một quy trình hoặc hành động.',
        examples: [
          'Tự động điều chỉnh âm lượng trong các mạch âm thanh.',
          'Tín hiệu từ con quay hồi chuyển được dùng để điều khiển lái tự động máy bay.',
          'Kiểm soát quy trình thống kê (SPC) - Các phép đo được dùng để quyết định khi nào cần điều chỉnh quy trình.',
          'Ngân sách - Các phép đo được dùng để quyết định khi nào cần điều chỉnh quy trình chi tiêu.',
        ],
      },
      {
        text: 'Nếu phản hồi đã có sẵn, hãy thay đổi độ lớn hoặc ảnh hưởng của nó.',
        examples: [
          'Thay đổi độ nhạy của hệ thống lái tự động khi máy bay ở trong phạm vi 5 dặm quanh sân bay.',
          'Thay đổi độ nhạy của bộ điều nhiệt khi làm mát so với khi sưởi ấm.',
          'Thay đổi thước đo quản lý từ biến động ngân sách sang sự hài lòng của khách hàng.',
        ],
      },
    ],
  },
  {
    number: 24,
    title: 'Nguyên tắc trung gian (Intermediary)',
    image: principlesImages.SuDungTrungGian,
    content: [
      {
        text: 'Sử dụng một đối tượng trung gian hoặc một quy trình trung gian.',
        examples: [
          'Dụng cụ đóng đinh mồi (nailset) được sử dụng giữa búa và đinh (để tránh búa đập vào gỗ).',
        ],
      },
      {
        text: 'Kết hợp tạm thời một đối tượng với một đối tượng khác (mà có thể dễ dàng tháo rời).',
        examples: ['Miếng lót nồi để bê đĩa nóng ra bàn ăn.'],
      },
    ],
  },
  {
    number: 25,
    title: 'Nguyên tắc tự phục vụ (Self-service)',
    image: principlesImages.TuPhucVu,
    content: [
      {
        text: 'Làm cho một đối tượng tự phục vụ nó bằng cách thực hiện các chức năng phụ trợ hữu ích.',
        examples: [
          'Máy bơm nước ngọt (soda) chạy bằng chính áp suất của khí carbon dioxide dùng để tạo ga cho đồ uống.',
          'Đèn Halogen tái tạo dây tóc trong quá trình sử dụng.',
          'Để hàn thép với nhôm, tạo ra một lớp giao diện bằng cách xen kẽ các dải mỏng của 2 vật liệu.',
        ],
      },
      {
        text: 'Sử dụng các nguồn tài nguyên, năng lượng hoặc vật chất thải bỏ.',
        examples: [
          'Sử dụng nhiệt từ một quy trình để phát điện (Đồng phát năng lượng).',
          'Sử dụng phân động vật làm phân bón.',
          'Sử dụng rác thải thực phẩm và rác vườn để làm phân ủ (compost).',
        ],
      },
    ],
  },
  {
    number: 26,
    title: 'Nguyên tắc sao chép (Copying)',
    image: principlesImages.SaoChep,
    content: [
      {
        text: 'Thay vì sử dụng đối tượng không có sẵn, đắt tiền hoặc dễ vỡ, hãy sử dụng các bản sao đơn giản và rẻ tiền.',
        examples: [
          'Thực tế ảo qua máy tính thay vì một kỳ nghỉ đắt tiền.',
          'Nghe băng ghi âm thay vì tham dự hội thảo trực tiếp.',
        ],
      },
      {
        text: 'Thay thế một đối tượng hoặc quy trình bằng các bản sao quang học.',
        examples: [
          'Thực hiện khảo sát từ ảnh chụp vệ tinh thay vì trên mặt đất.',
          'Đo lường đối tượng bằng cách đo ảnh chụp của nó.',
          'Siêu âm (Sonogram) để đánh giá sức khỏe thai nhi, thay vì rủi ro khi xét nghiệm trực tiếp.',
        ],
      },
      {
        text: 'Nếu các bản sao quang học (nhìn thấy được) đã được sử dụng, hãy chuyển sang bản sao hồng ngoại hoặc tia cực tím.',
        examples: [
          'Tạo ảnh hồng ngoại để phát hiện các nguồn nhiệt, như bệnh tật ở cây trồng, hoặc kẻ xâm nhập trong hệ thống an ninh.',
        ],
      },
    ],
  },
  {
    number: 27,
    title: 'Nguyên tắc rẻ thay cho đắt (Cheap short-living objects)',
    image: principlesImages.ReThayChoDat,
    content: [
      {
        text: 'Thay thế một đối tượng đắt tiền bằng nhiều đối tượng rẻ tiền, chấp nhận giảm bớt một số phẩm chất nhất định (ví dụ như tuổi thọ).',
        examples: [
          'Sử dụng đồ vật bằng giấy dùng một lần để tránh chi phí làm sạch và bảo quản đồ bền.',
          'Ly nhựa trong nhà nghỉ, tã dùng một lần, nhiều loại vật tư y tế.',
        ],
      },
    ],
  },
  {
    number: 28,
    title: 'Nguyên tắc thay thế cơ học (Mechanics substitution)',
    image: principlesImages.SoDoCoHoc,
    content: [
      {
        text: 'Thay thế phương tiện cơ học bằng phương tiện cảm giác (quang học, âm thanh, vị giác hoặc khứu giác).',
        examples: [
          'Thay thế hàng rào vật lý giữ chó mèo bằng hàng rào âm thanh (tín hiệu nghe được với động vật).',
          'Sử dụng hợp chất có mùi hôi trong khí gas tự nhiên để cảnh báo rò rỉ, thay vì cảm biến cơ/điện.',
        ],
      },
      {
        text: 'Sử dụng điện trường, từ trường và trường điện từ để tương tác với đối tượng.',
        examples: [
          'Để trộn 2 loại bột, tích điện dương cho loại này và âm cho loại kia.',
        ],
      },
      {
        text: 'Chuyển từ các trường tĩnh sang trường động, từ trường không cấu trúc sang trường có cấu trúc.',
        examples: [
          'Liên lạc vô tuyến ban đầu dùng phát sóng đa hướng. Nay dùng ăng-ten với cấu trúc bức xạ rất chi tiết.',
        ],
      },
      {
        text: 'Sử dụng các trường kết hợp với các hạt được kích hoạt bởi trường (ví dụ: hạt sắt từ).',
        examples: [
          'Đun nóng một chất chứa vật liệu sắt từ bằng từ trường biến thiên. Khi nhiệt độ vượt quá điểm Curie, vật liệu trở nên thuận từ và không còn hấp thụ nhiệt nữa.',
        ],
      },
    ],
  },
  {
    number: 29,
    title: 'Nguyên tắc sử dụng kết cấu lỏng khí (Pneumatics and hydraulics)',
    image: principlesImages.SuDungLongKhi,
    content: [
      {
        text: 'Sử dụng các bộ phận khí và lỏng của đối tượng thay vì các bộ phận rắn (ví dụ: bơm hơi, chứa đầy chất lỏng, đệm khí, thủy tĩnh, phản lực nước).',
        examples: [
          'Miếng lót đế giày thoải mái chứa đầy gel.',
          'Tích trữ năng lượng từ việc giảm tốc xe vào hệ thống thủy lực, sau đó dùng năng lượng đó để tăng tốc lại.',
        ],
      },
    ],
  },
  {
    number: 30,
    title: 'Nguyên tắc vỏ dẻo và màng mỏng (Flexible shells and thin films)',
    image: principlesImages.VoDeoMangMong,
    content: [
      {
        text: 'Sử dụng vỏ dẻo và màng mỏng thay vì kết cấu ba chiều.',
        examples: [
          'Sử dụng cấu trúc bơm hơi (màng mỏng) làm mái che sân tennis vào mùa đông.',
        ],
      },
      {
        text: 'Cách ly đối tượng với môi trường bên ngoài bằng vỏ dẻo và màng mỏng.',
        examples: [
          'Thả một màng vật liệu lưỡng cực (một đầu ưa nước, một đầu kỵ nước) trên hồ chứa nước để hạn chế bốc hơi.',
        ],
      },
    ],
  },
  {
    number: 31,
    title: 'Nguyên tắc vật liệu nhiều lỗ (Porous materials)',
    image: principlesImages.VatLieuNhieuLo,
    content: [
      {
        text: 'Làm cho đối tượng trở nên xốp hoặc thêm các yếu tố xốp (miếng chèn, lớp phủ...).',
        examples: ['Khoan các lỗ trên cấu trúc để giảm trọng lượng.'],
      },
      {
        text: 'Nếu đối tượng đã xốp, hãy sử dụng các lỗ rỗng để đưa vào một chất hoặc chức năng hữu ích.',
        examples: [
          'Sử dụng lưới kim loại xốp để hút thiếc hàn thừa khỏi mối nối.',
          'Lưu trữ hydro trong các lỗ xốp của bọt biển Palladium (bình nhiên liệu cho xe chạy hydro - an toàn hơn nhiều so với chứa khí hydro).',
        ],
      },
    ],
  },
  {
    number: 32,
    title: 'Nguyên tắc thay đổi màu sắc (Color changes)',
    image: principlesImages.ThayDoiMauSac,
    content: [
      {
        text: 'Thay đổi màu sắc của đối tượng hoặc môi trường bên ngoài của nó.',
        examples: [
          'Sử dụng đèn an toàn (safe lights) trong phòng tối tráng phim.',
        ],
      },
      {
        text: 'Thay đổi độ trong suốt của đối tượng hoặc môi trường bên ngoài.',
        examples: [
          'Sử dụng kỹ thuật quang khắc để thay đổi vật liệu trong suốt thành mặt nạ rắn cho xử lý bán dẫn.',
        ],
      },
    ],
  },
  {
    number: 33,
    title: 'Nguyên tắc đồng nhất (Homogeneity)',
    image: principlesImages.DongNhat,
    content: [
      {
        text: 'Làm cho các đối tượng tương tác với một đối tượng nhất định được làm bằng cùng một vật liệu (hoặc vật liệu có tính chất giống hệt).',
        examples: [
          'Làm thùng chứa bằng cùng vật liệu với chất chứa bên trong để giảm phản ứng hóa học.',
          'Chế tạo dụng cụ cắt kim cương bằng chính kim cương.',
        ],
      },
    ],
  },
  {
    number: 34,
    title: 'Nguyên tắc phân hủy và tái sinh (Discarding and recovering)',
    image: principlesImages.PhanHuy,
    content: [
      {
        text: 'Làm cho các phần của đối tượng đã hoàn thành chức năng của chúng biến mất (tan, bay hơi...) hoặc thay đổi chúng trực tiếp trong quá trình vận hành.',
        examples: [
          'Sử dụng vỏ viên thuốc tự tan.',
          'Phun nước lên bao bì làm từ tinh bột ngô và xem nó giảm thể tích hơn 1000 lần.',
          'Cấu trúc băng: Dùng nước đá hoặc đá khô (CO2) để làm khuôn mẫu tạm thời.',
        ],
      },
      {
        text: 'Ngược lại, khôi phục các bộ phận tiêu hao của một đối tượng trực tiếp trong quá trình vận hành.',
        examples: [
          'Lưỡi máy cắt cỏ tự mài sắc.',
          'Động cơ ô tô tự điều chỉnh (tune-up) trong khi đang chạy.',
        ],
      },
    ],
  },
  {
    number: 35,
    title: 'Nguyên tắc thay đổi thông số hóa lý (Parameter changes)',
    image: principlesImages.ThongSoHoaLy,
    content: [
      {
        text: 'Thay đổi trạng thái vật lý của đối tượng (ví dụ: sang khí, lỏng, hoặc rắn).',
        examples: [
          'Làm đông lạnh nhân lỏng của kẹo, sau đó nhúng vào sô-cô-la nóng chảy, thay vì xử lý chất lỏng dính nhớt.',
          'Vận chuyển oxy hoặc nitơ hoặc khí dầu mỏ dưới dạng lỏng thay vì khí để giảm thể tích.',
        ],
      },
      {
        text: 'Thay đổi nồng độ hoặc độ đậm đặc.',
        examples: [
          'Xà phòng rửa tay dạng lỏng đậm đặc và nhớt hơn xà phòng bánh, giúp lấy đúng lượng cần thiết và vệ sinh hơn khi nhiều người dùng chung.',
        ],
      },
      {
        text: 'Thay đổi độ linh hoạt.',
        examples: [
          'Sử dụng bộ giảm chấn có thể điều chỉnh để giảm tiếng ồn của các bộ phận rơi vào thùng chứa.',
          'Lưu hóa cao su để thay đổi độ linh hoạt và độ bền.',
        ],
      },
      {
        text: 'Thay đổi nhiệt độ.',
        examples: [
          'Nâng nhiệt độ lên trên điểm Curie để thay đổi chất sắt từ thành chất thuận từ.',
          'Nấu chín thức ăn (thay đổi mùi vị, hương thơm, kết cấu, tính chất hóa học).',
          'Hạ nhiệt độ của các mẫu vật y tế để bảo quản phân tích sau này.',
        ],
      },
    ],
  },
  {
    number: 36,
    title: 'Nguyên tắc chuyển pha (Phase transitions)',
    image: principlesImages.SuDungChuyenPha,
    content: [
      {
        text: 'Sử dụng các hiện tượng xảy ra trong quá trình chuyển pha (ví dụ: thay đổi thể tích, mất hoặc hấp thụ nhiệt...).',
        examples: [
          'Nước nở ra khi đóng băng. Hannibal được cho là đã dùng cách này khi hành quân đến Rome: đổ nước vào các khe đá vào ban đêm, cái lạnh làm nước đóng băng và phá vỡ đá chặn đường.',
          'Máy bơm nhiệt sử dụng nhiệt hóa hơi và nhiệt ngưng tụ của một chu trình nhiệt động khép kín để thực hiện công việc hữu ích.',
        ],
      },
    ],
  },
  {
    number: 37,
    title: 'Nguyên tắc giãn nở nhiệt (Thermal expansion)',
    image: principlesImages.NoNhiet,
    content: [
      {
        text: 'Sử dụng sự giãn nở (hoặc co lại) do nhiệt của vật liệu.',
        examples: [
          'Lắp ghép mối nối chặt bằng cách làm lạnh phần bên trong để co lại, nung nóng phần bên ngoài để giãn ra, ghép lại và để về nhiệt độ cân bằng.',
        ],
      },
      {
        text: 'Nếu sự giãn nở nhiệt đang được sử dụng, hãy sử dụng nhiều vật liệu với hệ số giãn nở nhiệt khác nhau.',
        examples: [
          'Rơ-le nhiệt lá lò xo cơ bản: 2 kim loại với hệ số giãn nở khác nhau được liên kết sao cho nó uốn cong một chiều khi nóng hơn và chiều ngược lại khi lạnh hơn.',
        ],
      },
    ],
  },
  {
    number: 38,
    title: 'Nguyên tắc sử dụng chất oxy hóa mạnh (Strong oxidants)',
    image: principlesImages.OxyHoa,
    content: [
      {
        text: 'Thay thế không khí thông thường bằng không khí giàu oxy.',
        examples: [
          'Lặn biển với Nitrox hoặc các hỗn hợp phi không khí khác để tăng thời gian lặn.',
        ],
      },
      {
        text: 'Thay thế không khí giàu oxy bằng oxy tinh khiết.',
        examples: [
          'Cắt ở nhiệt độ cao hơn bằng mỏ hàn oxy-acetylene.',
          'Điều trị vết thương trong môi trường oxy áp suất cao để tiêu diệt vi khuẩn kỵ khí.',
        ],
      },
      {
        text: 'Cho không khí hoặc oxy tiếp xúc với bức xạ ion hóa.',
        examples: ['Không có ví dụ cụ thể trong ảnh gốc.'],
      },
      {
        text: 'Sử dụng oxy bị ion hóa.',
        examples: [
          'Ion hóa không khí để bẫy các chất ô nhiễm trong máy lọc không khí.',
        ],
      },
      {
        text: 'Thay thế oxy bị ozone hóa (hoặc ion hóa) bằng ozone.',
        examples: [
          'Tăng tốc các phản ứng hóa học bằng cách ion hóa khí trước khi sử dụng.',
        ],
      },
    ],
  },
  {
    number: 39,
    title: 'Nguyên tắc thay đổi độ trơ (Inert atmosphere)',
    image: principlesImages.DoTro,
    content: [
      {
        text: 'Thay thế môi trường bình thường bằng môi trường trơ.',
        examples: [
          'Ngăn chặn sự xuống cấp của dây tóc nóng bằng cách sử dụng môi trường khí Argon trong bóng đèn.',
        ],
      },
      {
        text: 'Thêm các phần trung tính hoặc chất phụ gia trơ vào đối tượng.',
        examples: [
          'Tăng thể tích của bột giặt bằng cách thêm các thành phần trơ. Điều này giúp dễ đo lường hơn bằng các dụng cụ thông thường.',
        ],
      },
    ],
  },
  {
    number: 40,
    title: 'Nguyên tắc vật liệu hợp thành (Composite materials)',
    image: principlesImages.VatLieuHopThanh,
    content: [
      {
        text: 'Chuyển từ vật liệu đồng nhất sang vật liệu composite (nhiều thành phần).',
        examples: [
          'Vỏ gậy golf bằng nhựa epoxy/sợi carbon nhẹ hơn, bền hơn và linh hoạt hơn kim loại. Tương tự cho các bộ phận máy bay.',
          'Ván lướt sóng bằng sợi thủy tinh nhẹ hơn, dễ điều khiển và dễ tạo hình hơn ván gỗ.',
        ],
      },
    ],
  },
];
