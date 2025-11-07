import { describe, expect, it } from 'vitest';

import {
  addQueryParams,
  getDomain,
  isValidImageUrl,
  isValidUrl,
  validateUrl,
} from './url';

describe('URL utilities', () => {
  describe('isValidUrl', () => {
    it('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
    });

    it('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('   ')).toBe(false);
    });
  });

  describe('isValidImageUrl', () => {
    it('should return true for valid image URLs', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.png')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.gif')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.webp')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.svg')).toBe(true);
    });

    it('should return false for URLs without image extensions', () => {
      expect(isValidImageUrl('https://example.com/document.pdf')).toBe(false);
      expect(isValidImageUrl('https://example.com/page')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidImageUrl('not a url')).toBe(false);
      expect(isValidImageUrl('')).toBe(false);
    });

    it('should handle case-insensitive extensions', () => {
      expect(isValidImageUrl('https://example.com/IMAGE.JPG')).toBe(true);
      expect(isValidImageUrl('https://example.com/IMAGE.PNG')).toBe(true);
    });
  });

  describe('validateUrl', () => {
    it('should return empty string for valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe('');
      expect(validateUrl('http://example.com/path')).toBe('');
    });

    it('should return error message for empty URLs', () => {
      expect(validateUrl('')).toBe('URL is required');
      expect(validateUrl('   ')).toBe('URL is required');
    });

    it('should return error message for invalid URLs', () => {
      expect(validateUrl('not a url')).toContain('valid URL');
      expect(validateUrl('example.com')).toContain('valid URL');
    });

    it('should validate image URLs when requireImage is true', () => {
      expect(validateUrl('https://example.com/image.jpg', true)).toBe('');
      expect(validateUrl('https://example.com/page', true)).toContain(
        'valid image URL',
      );
    });
  });

  describe('getDomain', () => {
    it('should extract domain from valid URLs', () => {
      expect(getDomain('https://example.com')).toBe('example.com');
      expect(getDomain('https://www.example.com/path')).toBe('www.example.com');
      expect(getDomain('http://subdomain.example.com')).toBe(
        'subdomain.example.com',
      );
    });

    it('should return empty string for invalid URLs', () => {
      expect(getDomain('not a url')).toBe('');
      expect(getDomain('')).toBe('');
    });
  });

  describe('addQueryParams', () => {
    it('should add query parameters to URL', () => {
      const result = addQueryParams('https://example.com', {
        key1: 'value1',
        key2: 'value2',
      });
      expect(result).toBe('https://example.com/?key1=value1&key2=value2');
    });

    it('should handle URLs with existing parameters', () => {
      const result = addQueryParams('https://example.com?existing=param', {
        new: 'value',
      });
      expect(result).toContain('existing=param');
      expect(result).toContain('new=value');
    });

    it('should return original URL for invalid URLs', () => {
      const invalid = 'not a url';
      expect(addQueryParams(invalid, { key: 'value' })).toBe(invalid);
    });
  });
});
