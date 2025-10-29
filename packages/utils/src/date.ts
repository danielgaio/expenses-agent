import { format, parseISO, addDays, addMonths, addYears, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: string | Date, formatString: string = 'PP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

/**
 * Format date with locale
 */
export function formatDateLocale(
  date: string | Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get date range for timeframe
 */
export function getDateRange(
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual',
  referenceDate: Date = new Date()
): { start: Date; end: Date } {
  const start = startOfMonth(referenceDate);
  let end: Date;

  switch (timeframe) {
    case 'daily':
      end = addDays(start, 1);
      break;
    case 'weekly':
      end = addDays(start, 7);
      break;
    case 'monthly':
      end = endOfMonth(start);
      break;
    case 'quarterly':
      end = addMonths(start, 3);
      break;
    case 'annual':
      end = addYears(start, 1);
      break;
    default:
      end = endOfMonth(start);
  }

  return { start, end };
}

/**
 * Calculate days between dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
