export const features = [
  'Weight of moving object',
  'Weight of stationary object',
  'Length of moving object',
  'Length of stationary object',
  'Area of moving object',
  'Area of stationary object',
  'Volume of moving object',
  'Volume of stationary object',
  'Speed',
  'Force (Intensity)',
  'Stress or pressure',
  'Shape',
  'Stability of the object',
  'Strength',
  'Durability of moving object',
  'Durability of non moving object',
  'Temperature',
  'Illumination intensity',
  'Use of energy by moving object',
  'Use of energy by stationary object',
  'Power',
  'Loss of Energy',
  'Loss of substance',
  'Loss of Information',
  'Loss of Time',
  'Quantity of substance/the thing',
  'Reliability',
  'Measurement accuracy',
  'Manufacturing precision',
  'Object-affected harmful factors',
  'Object-generated harmful factors',
  'Ease of manufacture',
  'Ease of operation',
  'Ease of repair',
  'Adaptability or versatility',
  'Device complexity',
  'Difficulty of detecting and measuring',
  'Extent of automation',
  'Productivity',
];

// Dữ liệu mẫu (Bạn sẽ dùng script ở cuối bài để lấy full dữ liệu từ HTML cũ của bạn)
// Cấu trúc: matrixData[row_index][col_index] = "chuỗi nguyên tắc"
// Ví dụ dưới đây là hàng số 1 (Weight of moving object) cắt với các cột
export const sampleMatrixData: Record<number, Record<number, number[]>> = {
  1: {
    3: [15, 8, 29, 34],
    5: [29, 17, 38, 34],
    7: [29, 2, 40, 28],
    9: [2, 8, 15, 38],
    // ... dữ liệu này rất dài, chúng ta sẽ load động
  },
  // ...
};
