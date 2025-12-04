// Mock data for Step 4 & 5 combined flow

export const MOCK_PHYSICAL_CONTRADICTIONS = {
  physicalContradictions: [
    {
      element: 'Vật liệu điện cực (Anode/Cathode)',
      propertyDimension: 'diện tích bề mặt',
      stateA: 'diện tích bề mặt hoạt động lớn',
      stateB:
        'diện tích bề mặt hoạt động nhỏ (để duy trì độ toàn vẹn cấu trúc cao không nứt gãy)',
      benefitA:
        'tăng khả năng lưu trữ và phản ứng điện hóa, giúp duy trì năng lượng tối ưu theo thời gian',
      benefitB:
        'giữ độ toàn vẹn cấu trúc cao, tránh nứt gãy, duy trì độ bền và ổn định lâu dài của cell pin',
      contradictionStatement:
        'Vật liệu điện cực phải có diện tích bề mặt hoạt động lớn để tăng khả năng lưu trữ và phản ứng điện hóa giúp duy trì năng lượng tối ưu, nhưng đồng thời phải có diện tích bề mặt hoạt động nhỏ để giữ độ toàn vẹn cấu trúc cao và tránh nứt gãy.',
    },
    {
      element: 'Lớp màng SEI (Solid Electrolyte Interphase)',
      propertyDimension: 'độ dày',
      stateA: 'độ dày mỏng (tối thiểu)',
      stateB: 'độ dày lớn (để duy trì điện trở suất thấp và ổn định lâu dài)',
      benefitA:
        'giảm cản trở ion lithium, hỗ trợ tăng hiệu suất lưu trữ năng lượng của cell pin',
      benefitB:
        'đảm bảo điện trở suất thấp và độ bền màng, giúp duy trì hiệu suất pin ổn định qua thời gian',
      contradictionStatement:
        'Lớp màng SEI phải có độ dày mỏng để giảm cản trở ion lithium và tăng hiệu suất lưu trữ năng lượng, nhưng đồng thời phải có độ dày lớn để đảm bảo điện trở suất thấp và độ bền màng, duy trì hiệu suất ổn định qua thời gian.',
    },
    {
      element: 'Cấu trúc mạng tinh thể (Crystal Lattice)',
      propertyDimension: 'độ biến thiên thể tích',
      stateA: 'độ biến thiên thể tích thấp (lý tưởng = 0)',
      stateB:
        'độ biến thiên thể tích cao (liên quan đến hiệu quả phản ứng và lưu trữ ion)',
      benefitA:
        'giữ trạng thái ứng suất nội thấp và độ bền liên kết hóa học cao, duy trì ổn định cấu trúc cell pin',
      benefitB:
        'tăng khả năng lưu trữ và phản ứng ion, hỗ trợ duy trì năng lượng tối ưu trong thời gian dài',
      contradictionStatement:
        'Cấu trúc mạng tinh thể phải có độ biến thiên thể tích thấp để giữ trạng thái ứng suất nội thấp và độ bền liên kết hóa học cao, duy trì ổn định cấu trúc cell pin, nhưng đồng thời phải có độ biến thiên thể tích cao để tăng khả năng lưu trữ và phản ứng ion, giúp duy trì năng lượng tối ưu.',
    },
  ],
};

export const MOCK_TECHNICAL_CONTRADICTIONS = {
  technicalContradictions: [
    {
      element: 'Vật liệu điện cực (Anode/Cathode)',
      sourceML:
        'Vật liệu điện cực phải có diện tích bề mặt lớn để tối đa hóa khả năng lưu trữ năng lượng, nhưng đồng thời phải có diện tích bề mặt nhỏ để hạn chế các phản ứng phụ gây lão hóa pin.',
      MK1: {
        direction:
          'Tăng diện tích bề mặt tiếp xúc để cải thiện khả năng lưu trữ năng lượng và tốc độ sạc/xả',
        improvingParameter: {
          name: 'Diện tích đối tượng bất động',
          number: '6',
          reasoning:
            'Diện tích bề mặt tiếp xúc là thuộc tính diện tích của vật liệu điện cực, thường là thành phần cố định trong pin. Tăng diện tích giúp mở rộng không gian phản ứng hóa học, nâng cao khả năng lưu trữ năng lượng và tăng tốc độ sạc/xả.',
        },
        worseningParameter: {
          name: 'Các nhân tố có hại sinh ra bởi chính đối tượng',
          number: '31',
          reasoning:
            'Tăng diện tích bề mặt làm tăng khả năng xảy ra các phản ứng phụ không mong muốn với chất điện phân, tạo ra các nhân tố có hại gây phân rã vật liệu và suy giảm dung lượng pin.',
        },
        contradictionStatement:
          'Để tối đa hóa khả năng lưu trữ và tốc độ sạc/xả, cần tăng diện tích bề mặt tiếp xúc vật liệu điện cực (thông số 6 cải thiện), nhưng điều này làm tăng các phản ứng phụ có hại sinh ra trong pin (thông số 31 xấu đi), gây suy giảm dung lượng.',
      },
      MK2: {
        direction:
          'Giảm các phản ứng phụ có hại để tăng độ bền và tuổi thọ pin',
        improvingParameter: {
          name: 'Các nhân tố có hại sinh ra bởi chính đối tượng',
          number: '31',
          reasoning:
            'Giảm các nhân tố có hại sinh ra bởi phản ứng phụ trong pin sẽ làm chậm quá trình phân hủy vật liệu, cải thiện độ bền và tuổi thọ pin.',
        },
        worseningParameter: {
          name: 'Diện tích đối tượng bất động',
          number: '6',
          reasoning:
            'Giảm các phản ứng phụ có hại thường đồng nghĩa giảm diện tích bề mặt tiếp xúc, làm thu hẹp không gian phản ứng, giảm khả năng lưu trữ năng lượng và tốc độ sạc/xả.',
        },
        contradictionStatement:
          'Để tăng độ bền và tuổi thọ pin, cần giảm các phản ứng phụ có hại sinh ra (thông số 31 cải thiện), nhưng điều này làm giảm diện tích bề mặt tiếp xúc vật liệu điện cực (thông số 6 xấu đi), làm giảm khả năng lưu trữ năng lượng và tốc độ sạc/xả.',
      },
      matrixUsage: {
        MK1_lookup:
          'Tra ma trận TRIZ tại hàng 6 (Diện tích đối tượng bất động), cột 31 (Các nhân tố có hại sinh ra bởi chính đối tượng) để tìm nguyên lý phát minh giải quyết.',
        MK2_lookup:
          'Tra ma trận TRIZ tại hàng 31 (Các nhân tố có hại sinh ra bởi chính đối tượng), cột 6 (Diện tích đối tượng bất động) để tìm nguyên lý phát minh giải quyết.',
      },
    },
  ],
  unmappedML: null,
};
