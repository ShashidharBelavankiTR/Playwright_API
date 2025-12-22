/**
 * DateTimeHelper - Utility class for date and time operations
 */
export class DateTimeHelper {
  /**
   * Get current date in specified format
   * @param format Format string (default: YYYY-MM-DD)
   * @returns Formatted date string
   */
  static getCurrentDate(format: string = 'YYYY-MM-DD'): string {
    const now = new Date();
    return this.formatDate(now, format);
  }

  /**
   * Format date to string
   * @param date Date object
   * @param format Format string
   * @returns Formatted date string
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get date with offset
   * @param days Number of days to add/subtract
   * @param format Format string
   * @returns Formatted date string
   */
  static getDateWithOffset(days: number, format: string = 'YYYY-MM-DD'): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.formatDate(date, format);
  }

  /**
   * Get timestamp in milliseconds
   * @returns Timestamp
   */
  static getTimestamp(): number {
    return Date.now();
  }

  /**
   * Parse date string to Date object
   * @param dateString Date string
   * @returns Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if date is in the past
   * @param date Date to check
   * @returns true if date is in the past
   */
  static isInPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is in the future
   * @param date Date to check
   * @returns true if date is in the future
   */
  static isInFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Get difference in days between two dates
   * @param date1 First date
   * @param date2 Second date
   * @returns Number of days difference
   */
  static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Add hours to current date
   * @param hours Number of hours to add
   * @returns Date object
   */
  static addHours(hours: number): Date {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  }

  /**
   * Add minutes to current date
   * @param minutes Number of minutes to add
   * @returns Date object
   */
  static addMinutes(minutes: number): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
}
