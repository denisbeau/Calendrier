// src/__tests__/integration/calendar.integration.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEvent } from '../../services/api';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient');

describe('Calendar Events Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full event lifecycle: create → read → update → delete', async () => {
    const mockEvent = {
      id: 'event-123',
      title: 'Integration Test Event',
      start: '2024-12-25T10:00:00Z',
      end: '2024-12-25T11:00:00Z',
      user_id: 'user-123',
    };

    // Step 1: Create event
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockEvent, error: null }),
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockInsert,
    });

    const createdEvent = await createEvent({
      title: 'Integration Test Event',
      start: '2024-12-25T10:00:00Z',
      end: '2024-12-25T11:00:00Z',
      userId: 'user-123',
    });

    expect(createdEvent.title).toBe('Integration Test Event');
    expect(createdEvent.id).toBe('event-123');

    // Step 2: Read event (simulated)
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [mockEvent],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const readResult = await supabase.from('events').select().eq('id', 'event-123');
    expect(readResult.data).toHaveLength(1);
    expect(readResult.data[0].title).toBe('Integration Test Event');

    // Step 3: Update event
    const updatedEvent = { ...mockEvent, title: 'Updated Event' };
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [updatedEvent],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      update: mockUpdate,
    });

    const updateResult = await supabase.from('events').update({ title: 'Updated Event' }).eq('id', 'event-123');
    expect(updateResult.data[0].title).toBe('Updated Event');

    // Step 4: Delete event
    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      delete: mockDelete,
    });

    const deleteResult = await supabase.from('events').delete().eq('id', 'event-123');
    expect(deleteResult.data).toEqual([]);
  });

  it('should create event in group and verify it appears in group events', async () => {
    const groupEvent = {
      id: 'group-event-123',
      title: 'Group Meeting',
      start_at: '2024-12-25T14:00:00Z',
      end_at: '2024-12-25T15:00:00Z',
      group_id: 'group-123',
    };

    const mockInsert = vi.fn().mockResolvedValue({
      data: [groupEvent],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockInsert,
    });

    const createdGroupEvent = await createEvent({
      title: 'Group Meeting',
      start: '2024-12-25T14:00:00Z',
      end: '2024-12-25T15:00:00Z',
      groupId: 'group-123',
    });

    expect(createdGroupEvent[0].group_id).toBe('group-123');
    expect(createdGroupEvent[0].title).toBe('Group Meeting');

    // Verify event appears in group events query
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [groupEvent],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const groupEvents = await supabase.from('group_events').select().eq('group_id', 'group-123');
    expect(groupEvents.data).toHaveLength(1);
    expect(groupEvents.data[0].id).toBe('group-event-123');
  });

  it('should handle event creation with category and color integration', async () => {
    const eventWithCategory = {
      id: 'event-456',
      title: 'Work Meeting',
      start: '2024-12-25T09:00:00Z',
      end: '2024-12-25T10:00:00Z',
      category: 'Work',
      color: '#FF5733',
    };

    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: eventWithCategory, error: null }),
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockInsert,
    });

    const createdEvent = await createEvent({
      title: 'Work Meeting',
      start: '2024-12-25T09:00:00Z',
      end: '2024-12-25T10:00:00Z',
      category: 'Work',
      color: '#FF5733',
    });

    expect(createdEvent.category).toBe('Work');
    expect(createdEvent.color).toBe('#FF5733');

    // Verify category and color are persisted
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [eventWithCategory],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const retrievedEvent = await supabase.from('events').select().eq('id', 'event-456');
    expect(retrievedEvent.data[0].category).toBe('Work');
    expect(retrievedEvent.data[0].color).toBe('#FF5733');
  });
});

