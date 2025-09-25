import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";


const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function MyBigCalendar() {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getOneHourFromNow = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    start: getCurrentDateTime(), 
    end: getOneHourFromNow(), 
    allDay: false 
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState('week');

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

  async function handleAddEvent(e) {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const validationErrors = validateEvent(newEvent);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);

      const newEventObj = {
        id: nextId(),
        title: newEvent.title.trim(),
        start: startDate,
        end: endDate,
        allDay: newEvent.allDay,
      };

      setEvents(prev => [...prev, newEventObj]);
      setNewEvent({ 
        title: "", 
        start: getCurrentDateTime(), 
        end: getOneHourFromNow(), 
        allDay: false 
      });
      
    } catch (error) {
      console.error("Error adding event:", error);
      setErrors({ general: "Failed to add event. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateEvent(e) {
    e.preventDefault();
    
    if (isSubmitting || !editingEvent) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const validationErrors = validateEvent(editingEvent);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const startDate = new Date(editingEvent.start);
      const endDate = new Date(editingEvent.end);

      const updatedEvent = {
        ...editingEvent,
        title: editingEvent.title.trim(),
        start: startDate,
        end: endDate,
      };

      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      ));
      
      setEditingEvent(null);
      
    } catch (error) {
      console.error("Error updating event:", error);
      setErrors({ general: "Failed to update event. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectEvent(event) {
    // Set the event for editing
    setEditingEvent({
      ...event,
      start: formatDateTimeLocal(event.start),
      end: formatDateTimeLocal(event.end)
    });
  }

  function handleDeleteEvent(eventId) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      if (editingEvent && editingEvent.id === eventId) {
        setEditingEvent(null);
      }
    }
  }

  function handleCancelEdit() {
    setEditingEvent(null);
    setErrors({});
  }

  function handleSelectSlot(slotInfo) {
    try {
      const title = prompt("New event title for selected range:");
      if (!title || !title.trim()) return;
      
      const isAllDay = slotInfo.slots && slotInfo.slots.length === 1;
      
      const newEventObj = {
        id: nextId(),
        title: title.trim(),
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: isAllDay,
      };
      
      setEvents(prev => [...prev, newEventObj]);
    } catch (error) {
      console.error("Error creating event from slot:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400">Manage your events and schedule</p>
        </div>

        {/* Add event form */}
        <div className="simple-card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Event</h2>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                className={`simple-input ${errors.title ? 'border-red-500' : ''}`}
                value={newEvent.title}
                onChange={(e) => {
                  setNewEvent({ ...newEvent, title: e.target.value });
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: null }));
                  }
                }}
                placeholder="Enter event title"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                className={`simple-input ${errors.start ? 'border-red-500' : ''}`}
                value={newEvent.start}
                onChange={(e) => {
                  setNewEvent({ ...newEvent, start: e.target.value });
                  if (errors.start) {
                    setErrors(prev => ({ ...prev, start: null }));
                  }
                }}
                disabled={isSubmitting}
              />
              {errors.start && (
                <p className="text-red-400 text-xs mt-1">{errors.start}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                className={`simple-input ${errors.end ? 'border-red-500' : ''}`}
                value={newEvent.end}
                onChange={(e) => {
                  setNewEvent({ ...newEvent, end: e.target.value });
                  if (errors.end) {
                    setErrors(prev => ({ ...prev, end: null }));
                  }
                }}
                disabled={isSubmitting}
              />
              {errors.end && (
                <p className="text-red-400 text-xs mt-1">{errors.end}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                  className="simple-checkbox"
                  disabled={isSubmitting}
                />
                <label htmlFor="allDay" className="text-sm text-gray-300">
                  All day event
                </label>
              </div>
              <button 
                type="submit" 
                className="simple-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Calendar */}
        <div className="simple-card">
          <h3 className="text-xl font-semibold text-white mb-4">Calendar</h3>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            view={currentView}
            onView={setCurrentView}
            views={['month', 'week', 'day', 'agenda']}
            popup
          />
        </div>

        {editingEvent && (
          <div className="simple-card">
            <h3 className="text-xl font-semibold mb-4 text-white">Edit Event</h3>
            
            <form onSubmit={handleUpdateEvent}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    className="simple-input"
                    placeholder="Enter event title..."
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, title: e.target.value }))}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-start" className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="edit-start"
                    className="simple-input"
                    value={editingEvent.start}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, start: e.target.value }))}
                  />
                  {errors.start && (
                    <p className="text-red-400 text-sm mt-1">{errors.start}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-end" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="edit-end"
                    className="simple-input"
                    value={editingEvent.end}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, end: e.target.value }))}
                  />
                  {errors.end && (
                    <p className="text-red-400 text-sm mt-1">{errors.end}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="text-red-400 text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="simple-button flex-1"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Event'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="simple-button bg-red-600 hover:bg-red-700 flex-1"
                  >
                    Delete Event
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="simple-button bg-gray-600 hover:bg-gray-700 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
