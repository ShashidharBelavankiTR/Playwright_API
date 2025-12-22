/**
 * StringHelper - Utility class for string operations
 */
export class StringHelper {
  /**
   * Generate random string
   * @param length String length
   * @param includeNumbers Include numbers
   * @param includeSpecialChars Include special characters
   * @returns Random string
   */
  static generateRandomString(
    length: number = 10,
    includeNumbers: boolean = true,
    includeSpecialChars: boolean = false
  ): string {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSpecialChars) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   * @param domain Email domain (default: example.com)
   * @returns Random email address
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const username = this.generateRandomString(10, true, false).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Capitalize first letter
   * @param str Input string
   * @returns Capitalized string
   */
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert to camel case
   * @param str Input string
   * @returns Camel case string
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  /**
   * Convert to snake case
   * @param str Input string
   * @returns Snake case string
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  /**
   * Truncate string
   * @param str Input string
   * @param maxLength Maximum length
   * @param suffix Suffix to add (default: ...)
   * @returns Truncated string
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Remove special characters
   * @param str Input string
   * @returns Cleaned string
   */
  static removeSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Check if string is valid email
   * @param email Email string
   * @returns true if valid email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if string is valid URL
   * @param url URL string
   * @returns true if valid URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate slug from string
   * @param str Input string
   * @returns Slug string
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Reverse string
   * @param str Input string
   * @returns Reversed string
   */
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  /**
   * Count occurrences of substring
   * @param str Input string
   * @param search Substring to search for
   * @returns Number of occurrences
   */
  static countOccurrences(str: string, search: string): number {
    return (str.match(new RegExp(search, 'g')) || []).length;
  }

  /**
   * Mask string (e.g., for passwords)
   * @param str Input string
   * @param visibleChars Number of visible characters at start and end
   * @param maskChar Masking character
   * @returns Masked string
   */
  static mask(str: string, visibleChars: number = 2, maskChar: string = '*'): string {
    if (str.length <= visibleChars * 2) return maskChar.repeat(str.length);
    const start = str.substring(0, visibleChars);
    const end = str.substring(str.length - visibleChars);
    const masked = maskChar.repeat(str.length - visibleChars * 2);
    return start + masked + end;
  }
}
