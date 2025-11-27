import { describe, it, expect } from 'vitest';

import {
  formatTrizilium,
  formatTriziliumShort,
  formatDailyTrizilium,
  formatVND,
} from './currency';

describe('Currency Utils', () => {
  const ZERO_MESSAGE = 'should handle zero';

  describe('formatTrizilium', () => {
    it('should format with Trizilium after by default', () => {
      expect(formatTrizilium(1000)).toBe('1,000 Trizilium');
      expect(formatTrizilium(1000000)).toBe('1,000,000 Trizilium');
    });

    it('should format with Trizilium before when specified', () => {
      expect(formatTrizilium(1000, { symbolPosition: 'before' })).toBe(
        'Trizilium 1,000',
      );
    });

    it('should format without symbol when showSymbol is false', () => {
      expect(formatTrizilium(1000, { showSymbol: false })).toBe('1,000');
    });

    it(ZERO_MESSAGE, () => {
      expect(formatTrizilium(0)).toBe('0 Trizilium');
    });

    it('should handle large numbers', () => {
      expect(formatTrizilium(1234567890)).toBe('1,234,567,890 Trizilium');
    });
  });

  describe('formatTriziliumShort', () => {
    it('should format with Ƶ symbol', () => {
      expect(formatTriziliumShort(1000)).toBe('1,000 Ƶ');
      expect(formatTriziliumShort(500)).toBe('500 Ƶ');
    });

    it(ZERO_MESSAGE, () => {
      expect(formatTriziliumShort(0)).toBe('0 Ƶ');
    });
  });

  describe('formatDailyTrizilium', () => {
    it('should format with /day suffix', () => {
      expect(formatDailyTrizilium(100)).toBe('100 Trizilium/day');
      expect(formatDailyTrizilium(1000)).toBe('1,000 Trizilium/day');
    });

    it(ZERO_MESSAGE, () => {
      expect(formatDailyTrizilium(0)).toBe('0 Trizilium/day');
    });
  });

  describe('formatVND', () => {
    it('should format Vietnamese currency', () => {
      expect(formatVND(1000)).toBe('1.000\u00A0₫');
      expect(formatVND(10000)).toBe('10.000\u00A0₫');
    });

    it(ZERO_MESSAGE, () => {
      expect(formatVND(0)).toBe('0\u00A0₫');
    });

    it('should handle large numbers', () => {
      expect(formatVND(1000000)).toBe(`1.000.000\u00A0₫`);
    });
  });
});
