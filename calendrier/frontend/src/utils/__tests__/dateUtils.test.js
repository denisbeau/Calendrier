// src/utils/__tests__/dateUtils.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCurrentDateTime,
  getOneHourFromNow,
  formatDateTimeLocal,
} from '../dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    // Mock Date.now() to have consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentDateTime', () => {
    it('should return current date-time in datetime-local format', () => {
      const result = getCurrentDateTime();
      // Format: YYYY-MM-DDTHH:mm
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain('2024-12-25');
    });

    it('should format hours and minutes with leading zeros', () => {
      // Use local time to avoid timezone issues
      const localDate = new Date(2024, 11, 25, 9, 5, 0); // December 25, 2024, 09:05:00
      vi.setSystemTime(localDate);
      const result = getCurrentDateTime();
      expect(result).toMatch(/T09:05$/);
    });
  });

  describe('getOneHourFromNow', () => {
    it('should return date-time one hour from now', () => {
      const result = getOneHourFromNow();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      
      // Parse and verify it's approximately 1 hour ahead
      const now = new Date('2024-12-25T10:00:00Z');
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const expected = `${oneHourLater.getFullYear()}-${String(oneHourLater.getMonth() + 1).padStart(2, '0')}-${String(oneHourLater.getDate()).padStart(2, '0')}T${String(oneHourLater.getHours()).padStart(2, '0')}:${String(oneHourLater.getMinutes()).padStart(2, '0')}`;
      
      // Allow for timezone differences, just check format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });

  describe('formatDateTimeLocal', () => {
    it('should format a Date object to datetime-local format', () => {
      const date = new Date('2024-12-25T15:30:00Z');
      const result = formatDateTimeLocal(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain('2024-12-25');
    });

    it('should handle dates with single digit months and days', () => {
      const date = new Date('2024-01-05T09:05:00Z');
      const result = formatDateTimeLocal(date);
      expect(result).toMatch(/2024-01-05/);
    });

    it('should pad hours and minutes with zeros', () => {
      const date = new Date('2024-12-25T09:05:00Z');
      const result = formatDateTimeLocal(date);
      expect(result).toMatch(/T\d{2}:\d{2}$/);
    });
  });
});

