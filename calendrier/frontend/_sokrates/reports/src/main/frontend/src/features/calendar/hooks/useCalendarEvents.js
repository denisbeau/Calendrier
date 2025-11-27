// src/features/calendar/hooks/useCalendarEvents.js
import { useState, useMemo } from "react";
import { getCurrentDateTime, getOneHourFromNow, formatDateTimeLocal } from "../../../utils/dateUtils";
import { DEFAULT_EVENT_COLOR, DEFAULT_CATEGORY_NAME } from "../../../utils/constants";

export function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic id generator for demo purposes
  const nextId = useMemo(() => {
    return () => Math.max(0, ...events.map((e) => e.id || 0)) + 1;
  }, [events]);

  function validateEvent(event) {
    const newErrors = {};
    
    if (!event.title.trim()) {
      newErrors.title = "Event title is required";
    }
    
    if (!event.start) {
      newErrors.start = "Start time is required";
    }
    
    if (!event.end) {
      newErrors.end = "End time is required";
    }
    
    if (event.start && event.end) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      if (isNaN(startDate.getTime())) {
        newErrors.start = "Invalid start date";
      }
      
      if (isNaN(endDate.getTime())) {
        newErrors.end = "Invalid end date";
      }
      
      if (startDate >= endDate) {
        newErrors.end = "End time must be after start time";
      }
    }
    
    return newErrors;
  }

  async function handleFormSubmit(formEvent, isEditing, editingEventId, onSuccess) {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const validationErrors = validateEvent(formEvent);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const startDate = new Date(formEvent.start);
      const endDate = new Date(formEvent.end);

      if (isEditing) {
        // Update existing event
        const updatedEvent = {
          id: editingEventId,
          title: formEvent.title.trim(),
          start: startDate,
          end: endDate,
          color: formEvent.color || DEFAULT_EVENT_COLOR,
          categoryName: formEvent.categoryName?.trim() || DEFAULT_CATEGORY_NAME,
        };

        setEvents(prev => prev.map(event => 
          event.id === editingEventId ? updatedEvent : event
        ));
        
        onSuccess?.();
      } else {
        // Create new event
        const newEventObj = {
          id: nextId(),
          title: formEvent.title.trim(),
          start: startDate,
          end: endDate,
          color: formEvent.color || DEFAULT_EVENT_COLOR,
          categoryName: formEvent.categoryName?.trim() || DEFAULT_CATEGORY_NAME,
        };

        setEvents(prev => [...prev, newEventObj]);
        onSuccess?.();
      }
      
    } catch (error) {
      console.error("Error saving event:", error);
      setErrors({ general: "Failed to save event. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectEvent(event, onSelect) {
    // Populate the form with the event data for editing
    const eventData = {
      title: event.title,
      start: formatDateTimeLocal(event.start),
      end: formatDateTimeLocal(event.end),
      color: event.color || DEFAULT_EVENT_COLOR,
      categoryName: event.categoryName || DEFAULT_CATEGORY_NAME
    };
    onSelect?.(eventData, event.id);
    setErrors({});
  }

  function handleDeleteEvent(editingEventId, onSuccess) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== editingEventId));
      onSuccess?.();
    }
  }

  function handleSelectSlot(slotInfo, defaultColor, defaultCategoryName) {
    try {
      // Format the selected time range for display
      const startTime = slotInfo.start.toLocaleString();
      const endTime = slotInfo.end.toLocaleString();
      
      const title = prompt(`Enter event title for:\n${startTime} - ${endTime}`);
      if (!title || !title.trim()) return;
      
      const newEventObj = {
        id: nextId(),
        title: title.trim(),
        start: slotInfo.start,
        end: slotInfo.end,
        color: defaultColor || DEFAULT_EVENT_COLOR,
        categoryName: defaultCategoryName?.trim() || DEFAULT_CATEGORY_NAME,
      };
      
      setEvents(prev => [...prev, newEventObj]);
      
      // Show success message
      console.log(`Event "${title.trim()}" created successfully!`);
      
    } catch (error) {
      console.error("Error creating event from slot:", error);
      console.error("SlotInfo:", slotInfo);
      console.error("Events array:", events);
      alert("Failed to create event. Please try again.");
    }
  }

  function getInitialFormState() {
    return {
      title: "",
      start: getCurrentDateTime(),
      end: getOneHourFromNow(),
      color: DEFAULT_EVENT_COLOR,
      categoryName: DEFAULT_CATEGORY_NAME,
    };
  }

  return {
    events,
    setEvents,
    isSubmitting,
    errors,
    setErrors,
    handleFormSubmit,
    handleSelectEvent,
    handleDeleteEvent,
    handleSelectSlot,
    getInitialFormState,
  };
}

