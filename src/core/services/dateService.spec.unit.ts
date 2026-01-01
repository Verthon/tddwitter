import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDateService } from './dateService';

describe('dateService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('now', () => {
    it('returns current date', () => {
      const mockDate = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      const service = createDateService();
      const result = service.now();

      expect(result).toEqual(mockDate);
    });
  });

  describe('toISOString', () => {
    it('converts current date to ISO string when no argument provided', () => {
      const mockDate = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      const service = createDateService();
      const result = service.toISOString();

      expect(result).toBe('2024-01-15T12:00:00.000Z');
    });

    it('converts provided date to ISO string', () => {
      const service = createDateService();
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = service.toISOString(date);

      expect(result).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('toDisplayFormat', () => {
    it('converts timestamp to locale string', () => {
      const service = createDateService();
      const timestamp = '2024-01-15T12:00:00.000Z';
      const result = service.toDisplayFormat(timestamp);

      expect(result).toContain('2024');
      expect(result).toContain('15');
    });
  });

  describe('toRelativeTime', () => {
    it('returns "just now" for timestamps less than 60 seconds ago', () => {
      const mockNow = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const service = createDateService();
      const timestamp = new Date('2024-01-15T11:59:30.000Z').toISOString();
      const result = service.toRelativeTime(timestamp);

      expect(result).toBe('just now');
    });

    it('returns minutes for timestamps less than 60 minutes ago', () => {
      const mockNow = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const service = createDateService();
      const timestamp = new Date('2024-01-15T11:45:00.000Z').toISOString();
      const result = service.toRelativeTime(timestamp);

      expect(result).toBe('15m');
    });

    it('returns hours for timestamps less than 24 hours ago', () => {
      const mockNow = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const service = createDateService();
      const timestamp = new Date('2024-01-15T09:00:00.000Z').toISOString();
      const result = service.toRelativeTime(timestamp);

      expect(result).toBe('3h');
    });

    it('returns days for timestamps less than 7 days ago', () => {
      const mockNow = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const service = createDateService();
      const timestamp = new Date('2024-01-13T12:00:00.000Z').toISOString();
      const result = service.toRelativeTime(timestamp);

      expect(result).toBe('2d');
    });

    it('returns full date for timestamps more than 7 days ago', () => {
      const mockNow = new Date('2024-01-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const service = createDateService();
      const timestamp = new Date('2024-01-01T12:00:00.000Z').toISOString();
      const result = service.toRelativeTime(timestamp);

      expect(result).toContain('2024');
      expect(result).toContain('1');
    });
  });

  describe('parse', () => {
    it('parses ISO string to Date object', () => {
      const service = createDateService();
      const timestamp = '2024-01-15T12:00:00.000Z';
      const result = service.parse(timestamp);

      expect(result).toEqual(new Date('2024-01-15T12:00:00.000Z'));
    });
  });
});
