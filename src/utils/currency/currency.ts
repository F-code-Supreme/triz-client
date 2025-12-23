/**
 * Currency utility functions for Trizilium
 */

import i18n from '@/configs/i18next';

/**
 * Gets the current locale for number formatting
 * @returns The locale code (e.g., 'vi-VN' or 'en-US')
 */
export function getLocale(): string {
  const language = i18n.language || 'vi';
  return language === 'vi' ? 'vi-VN' : 'en-US';
}

/**
 * Formats a number as Trizilium currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted string with Trizilium
 */
export function formatTrizilium(
  amount: number,
  options?: {
    showSymbol?: boolean;
    symbolPosition?: 'before' | 'after';
  },
): string {
  const { showSymbol = true, symbolPosition = 'after' } = options || {};

  const formattedNumber = amount.toLocaleString(getLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!showSymbol) {
    return formattedNumber;
  }

  return symbolPosition === 'before'
    ? `Trizilium ${formattedNumber}`
    : `${formattedNumber} Trizilium`;
}

/**
 * Formats a number as Trizilium with short form
 * @param amount - The amount to format
 * @returns Formatted string with Trizilium symbol (Ƶ)
 */
export function formatTriziliumShort(amount: number): string {
  const formattedNumber = amount.toLocaleString(getLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formattedNumber} Ƶ`;
}

/**
 * Formats daily Trizilium tokens
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted string for daily tokens
 */
export function formatDailyTrizilium(
  amount: number,
  options?: {
    shortForm?: boolean;
  },
): string {
  const { shortForm = false } = options || {};
  const language = i18n.language || 'vi';

  const formattedNumber = amount.toLocaleString(getLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (shortForm) {
    return `${formattedNumber}/${language === 'vi' ? 'ngày' : 'day'}`;
  }

  return language === 'vi'
    ? `${formattedNumber}/ngày`
    : `${formattedNumber}/day`;
}

/**
 * Formats VND currency (for backward compatibility and topup)
 * @param amount - The amount to format
 * @returns Formatted string with VND
 */
export function formatVND(amount: number, locale?: string): string {
  return new Intl.NumberFormat(locale || getLocale(), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
