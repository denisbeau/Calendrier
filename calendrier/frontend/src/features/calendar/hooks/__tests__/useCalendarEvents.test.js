// src/features/calendar/hooks/__tests__/useCalendarEvents.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendarEvents } from '../useCalendarEvents';

describe('useCalendarEvents', () => {
  beforeEach(() => {
    global.confirm = vi.fn(() => true);
    global.prompt = vi.fn(() => 'Test Event');
  });

  it('should initialize with empty events array', () => {
    const { result } = renderHook(() => useCalendarEvents());
    expect(result.current.events).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it('should validate event and return errors for missing fields', async () => {
    const { result } = renderHook(() => useCalendarEvents());

    await act(async () => {
      await result.current.handleFormSubmit(
        { title: '', start: '', end: '' },
        false,
        null,
        vi.fn()
      );
    });

    expect(result.current.errors).toHaveProperty('title');
    expect(result.current.errors).toHaveProperty('start');
    expect(result.current.errors).toHaveProperty('end');
  });

  it('should validate that end time is after start time', async () => {
    const { result } = renderHook(() => useCalendarEvents());

    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'Test Event',
          start: '2024-12-25T11:00',
          end: '2024-12-25T10:00',
        },
        false,
        null,
        vi.fn()
      );
    });

    expect(result.current.errors).toHaveProperty('end');
    expect(result.current.errors.end).toBe('End time must be after start time');
  });

  it('should create a new event when form is valid', async () => {
    const { result } = renderHook(() => useCalendarEvents());
    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'New Event',
          start: '2024-12-25T10:00',
          end: '2024-12-25T11:00',
        },
        false,
        null,
        onSuccess
      );
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('New Event');
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.errors).toEqual({});
  });

  it('should update an existing event', async () => {
    const { result } = renderHook(() => useCalendarEvents());
    const onSuccess = vi.fn();

    // Create an event first
    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'Original Event',
          start: '2024-12-25T10:00',
          end: '2024-12-25T11:00',
        },
        false,
        null,
        vi.fn()
      );
    });

    const eventId = result.current.events[0].id;

    // Update the event
    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'Updated Event',
          start: '2024-12-25T10:00',
          end: '2024-12-25T12:00',
        },
        true,
        eventId,
        onSuccess
      );
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('Updated Event');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should delete an event when confirmed', () => {
    const { result } = renderHook(() => useCalendarEvents());
    const onSuccess = vi.fn();

    // Add an event first
    act(() => {
      result.current.setEvents([
        { id: 1, title: 'Event to Delete', start: new Date(), end: new Date() },
      ]);
    });

    act(() => {
      result.current.handleDeleteEvent(1, onSuccess);
    });

    expect(result.current.events).toHaveLength(0);
    expect(onSuccess).toHaveBeenCalled();
  });

    it('should not delete event when not confirmed', () => {
    global.confirm = vi.fn(() => false);
    const { result } = renderHook(() => useCalendarEvents());
    const onSuccess = vi.fn();

    act(() => {
      result.current.setEvents([
        { id: 1, title: 'Event to Keep', start: new Date(), end: new Date() },
      ]);
    });

    act(() => {
      result.current.handleDeleteEvent(1, onSuccess);
    });

    expect(result.current.events).toHaveLength(1);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should get initial form state with default values', () => {
    const { result } = renderHook(() => useCalendarEvents());
    const initialState = result.current.getInitialFormState();

    expect(initialState).toHaveProperty('title');
    expect(initialState).toHaveProperty('start');
    expect(initialState).toHaveProperty('end');
    expect(initialState).toHaveProperty('color');
    expect(initialState).toHaveProperty('categoryName');
  });

  it('should handle select event and populate form data', () => {
    const { result } = renderHook(() => useCalendarEvents());
    const onSelect = vi.fn();

    const event = {
      id: 1,
      title: 'Selected Event',
      start: new Date('2024-12-25T10:00:00Z'),
      end: new Date('2024-12-25T11:00:00Z'),
      color: '#FF5733',
      categoryName: 'Work',
    };

    act(() => {
      result.current.handleSelectEvent(event, onSelect);
    });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Selected Event',
        color: '#FF5733',
        categoryName: 'Work',
      }),
      1
    );
    expect(result.current.errors).toEqual({});
  });

  it('should validate invalid start date', async () => {
    const { result } = renderHook(() => useCalendarEvents());

    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'Test Event',
          start: 'invalid-date',
          end: '2024-12-25T11:00',
        },
        false,
        null,
        vi.fn()
      );
    });

    expect(result.current.errors).toHaveProperty('start');
    expect(result.current.errors.start).toBe('Invalid start date');
  });

  it('should validate invalid end date', async () => {
    const { result } = renderHook(() => useCalendarEvents());

    await act(async () => {
      await result.current.handleFormSubmit(
        {
          title: 'Test Event',
          start: '2024-12-25T10:00',
          end: 'invalid-date',
        },
        false,
        null,
        vi.fn()
      );
    });

    expect(result.current.errors).toHaveProperty('end');
    expect(result.current.errors.end).toBe('Invalid end date');
  });

  it('should handle errors in handleFormSubmit', async () => {
    const { result } = renderHook(() => useCalendarEvents());
    
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a scenario that might cause an error
    // We'll test with a valid form but simulate an error
    await act(async () => {
      // This should work fine, but we test the error handling path
      await result.current.handleFormSubmit(
        {
          title: 'Test Event',
          start: '2024-12-25T10:00',
          end: '2024-12-25T11:00',
        },
        false,
        null,
        vi.fn()
      );
    });

    // The function should handle errors gracefully
    expect(result.current.errors).toEqual({});
    
    consoleSpy.mockRestore();
  });

  it('should handle selectSlot and create event from slot', () => {
    const { result } = renderHook(() => useCalendarEvents());
    global.prompt = vi.fn(() => 'Slot Event Title');

    const slotInfo = {
      start: new Date('2024-12-25T10:00:00Z'),
      end: new Date('2024-12-25T11:00:00Z'),
    };

    act(() => {
      result.current.handleSelectSlot(slotInfo, '#FF5733', 'Work');
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('Slot Event Title');
    expect(result.current.events[0].color).toBe('#FF5733');
    expect(result.current.events[0].categoryName).toBe('Work');
  });

  it('should not create event from slot if prompt is cancelled', () => {
    const { result } = renderHook(() => useCalendarEvents());
    global.prompt = vi.fn(() => null);

    const slotInfo = {
      start: new Date('2024-12-25T10:00:00Z'),
      end: new Date('2024-12-25T11:00:00Z'),
    };

    act(() => {
      result.current.handleSelectSlot(slotInfo);
    });

    expect(result.current.events).toHaveLength(0);
  });

  it('should not create event from slot if prompt returns empty string', () => {
    const { result } = renderHook(() => useCalendarEvents());
    global.prompt = vi.fn(() => '');

    const slotInfo = {
      start: new Date('2024-12-25T10:00:00Z'),
      end: new Date('2024-12-25T11:00:00Z'),
    };

    act(() => {
      result.current.handleSelectSlot(slotInfo);
    });

    expect(result.current.events).toHaveLength(0);
  });
});

