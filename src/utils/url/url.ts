/**
 * URL utility functions
 */

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(string_: string): boolean {
  if (!string_ || string_.trim() === '') return false;

  try {
    const url = new URL(string_);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid image URL
 * Checks if URL is valid and ends with common image extensions
 */
export function isValidImageUrl(string_: string): boolean {
  if (!isValidUrl(string_)) return false;

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.svg',
    '.webp',
    '.ico',
  ];

  try {
    const url = new URL(string_);
    const pathname = url.pathname.toLowerCase();

    // Check if URL ends with image extension
    return imageExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid URL with optional image validation
 * @param url - The URL string to validate
 * @param requireImage - Whether to validate as an image URL
 * @returns Error message if invalid, empty string if valid
 */
export function validateUrl(url: string, requireImage = false): string {
  if (!url || url.trim() === '') {
    return 'URL is required';
  }

  if (!isValidUrl(url)) {
    return 'Please enter a valid URL (must start with http:// or https://)';
  }

  if (requireImage && !isValidImageUrl(url)) {
    return 'Please enter a valid image URL (must end with .jpg, .png, .gif, .webp, etc.)';
  }

  return '';
}

/**
 * Gets the domain from a URL
 */
export function getDomain(url: string): string {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return '';
  }
}

/**
 * Adds query parameters to a URL
 */
export function addQueryParams(
  url: string,
  parameters: Record<string, string>,
): string {
  try {
    const urlObject = new URL(url);
    for (const [key, value] of Object.entries(parameters)) {
      urlObject.searchParams.set(key, value);
    }
    return urlObject.toString();
  } catch {
    return url;
  }
}
