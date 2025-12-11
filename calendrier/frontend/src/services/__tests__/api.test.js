// src/services/__tests__/api.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEvent } from '../api';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should throw error if title is missing', async () => {
      await expect(createEvent({})).rejects.toThrow('payload.title is required');
      await expect(createEvent({ start: '2024-12-25T10:00:00Z' })).rejects.toThrow('payload.title is required');
    });

    it('should create a personal event when groupId is not provided', async () => {
      const mockData = { id: 1, title: 'Test Event', start: '2024-12-25T10:00:00Z', end: '2024-12-25T11:00:00Z' };
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      const result = await createEvent({
        title: 'Test Event',
        start: '2024-12-25T10:00:00Z',
        end: '2024-12-25T11:00:00Z',
        userId: 'user-123',
      });

      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'Test Event',
          start: '2024-12-25T10:00:00Z',
          end: '2024-12-25T11:00:00Z',
          user_id: 'user-123',
        }),
      ]);
    });

    it('should create a group event when groupId is provided', async () => {
      const mockData = [{ id: 1, title: 'Group Event', group_id: 'group-123' }];
      const mockInsert = vi.fn().mockResolvedValue({ data: mockData, error: null });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      const result = await createEvent({
        title: 'Group Event',
        start: '2024-12-25T10:00:00Z',
        end: '2024-12-25T11:00:00Z',
        groupId: 'group-123',
      });

      expect(supabase.from).toHaveBeenCalledWith('group_events');
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'Group Event',
          start_at: '2024-12-25T10:00:00Z',
          end_at: '2024-12-25T11:00:00Z',
          group_id: 'group-123',
        }),
      ]);
    });

    it('should handle Date objects for start and end', async () => {
      const startDate = new Date('2024-12-25T10:00:00Z');
      const endDate = new Date('2024-12-25T11:00:00Z');
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        }),
      });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      await createEvent({
        title: 'Test Event',
        start: startDate,
        end: endDate,
      });

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        }),
      ]);
    });

    it('should include optional fields when provided', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        }),
      });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      await createEvent({
        title: 'Test Event',
        start: '2024-12-25T10:00:00Z',
        end: '2024-12-25T11:00:00Z',
        category: 'Work',
        color: '#FF5733',
        allDay: true,
      });

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          category: 'Work',
          color: '#FF5733',
          all_day: true,
        }),
      ]);
    });

    it('should throw error if Supabase returns an error', async () => {
      const mockError = { message: 'Database error', code: '23505' };
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      await expect(
        createEvent({
          title: 'Test Event',
          start: '2024-12-25T10:00:00Z',
          end: '2024-12-25T11:00:00Z',
        })
      ).rejects.toEqual(mockError);
    });

    it('should include optional userId and allDay fields for group events', async () => {
      const mockData = [{ id: 1, title: 'Group Event', group_id: 'group-123' }];
      const mockInsert = vi.fn().mockResolvedValue({ data: mockData, error: null });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      await createEvent({
        title: 'Group Event',
        start: '2024-12-25T10:00:00Z',
        end: '2024-12-25T11:00:00Z',
        groupId: 'group-123',
        userId: 'user-456',
        allDay: true,
      });

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          created_by: 'user-456',
          all_day: true,
        }),
      ]);
    });

    it('should handle error in group_events insert', async () => {
      const mockError = { message: 'Group event error', code: '23505' };
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: mockError });

      supabase.from = vi.fn().mockReturnValue({
        insert: mockInsert,
      });

      await expect(
        createEvent({
          title: 'Group Event',
          start: '2024-12-25T10:00:00Z',
          end: '2024-12-25T11:00:00Z',
          groupId: 'group-123',
        })
      ).rejects.toEqual(mockError);
    });
  });
});

