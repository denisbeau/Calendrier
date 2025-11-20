import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import addMonths from "date-fns/addMonths";
import subDays from "date-fns/subDays";
import subWeeks from "date-fns/subWeeks";
import subMonths from "date-fns/subMonths";
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
  const [categories, setCategories] = useState({
    '#2563EB': 'Category #1',
    '#DC2626': 'Category #2',
    '#059669': 'Category #3',
    '#F59E0B': 'Category #4',
    '#9333EA': 'Category #5',
    '#4B5563': 'Category #6',
  });
  const [editingColor, setEditingColor] = useState(null);
  const [formEvent, setFormEvent] = useState({ 
    title: "", 
    start: getCurrentDateTime(), 
    end: getOneHourFromNow(),  
    color: '#2563EB', // default blue
    categoryName: 'Category #1',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  async function handleFormSubmit(e) {
    e.preventDefault();
    
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
          color: formEvent.color || '#2563EB',
          categoryName: formEvent.categoryName?.trim() || 'Category #1',
        };

        setEvents(prev => prev.map(event => 
          event.id === editingEventId ? updatedEvent : event
        ));
        
        // Reset to create mode
        handleCancelEdit();
      } else {
        // Create new event
        const newEventObj = {
          id: nextId(),
          title: formEvent.title.trim(),
          start: startDate,
          end: endDate,
          color: formEvent.color || '#2563EB',
          categoryName: formEvent.categoryName?.trim() || 'Category #1',
        };

        setEvents(prev => [...prev, newEventObj]);
        setFormEvent({ 
          title: "", 
          start: getCurrentDateTime(), 
          end: getOneHourFromNow(), 
          color: '#2563EB',
          categoryName: 'Category #1',
        });
      }
      
    } catch (error) {
      console.error("Error saving event:", error);
      setErrors({ general: "Failed to save event. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }



  function handleSelectEvent(event) {
    // Populate the main form with the event data for editing
    setFormEvent({
      title: event.title,
      start: formatDateTimeLocal(event.start),
      end: formatDateTimeLocal(event.end),
      color: event.color || '#2563EB',
      categoryName: event.categoryName || 'Category #1'
    });
    setIsEditing(true);
    setEditingEventId(event.id);
    setErrors({});
  }

  function handleDeleteEvent() {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== editingEventId));
      handleCancelEdit();
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditingEventId(null);
    setFormEvent({ 
      title: "", 
      start: getCurrentDateTime(), 
      end: getOneHourFromNow(), 
      color: '#2563EB',
      categoryName: 'Category #1',
    });
    setErrors({});
  }

  function handleSelectSlot(slotInfo) {
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
        color: formEvent.color || '#2563EB',
        categoryName: formEvent.categoryName?.trim() || 'Category #1',
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

  // Navigation functions
  function handleToday() {
    setCurrentDate(new Date());
  }

  function handleNavigateBack() {
    setCurrentDate(prevDate => {
      switch (currentView) {
        case 'day':
          return subDays(prevDate, 1);
        case 'week':
          return subWeeks(prevDate, 1);
        case 'month':
          return subMonths(prevDate, 1);
        case 'agenda':
          return subWeeks(prevDate, 1);
        default:
          return subWeeks(prevDate, 1);
      }
    });
  }

  function handleNavigateNext() {
    setCurrentDate(prevDate => {
      switch (currentView) {
        case 'day':
          return addDays(prevDate, 1);
        case 'week':
          return addWeeks(prevDate, 1);
        case 'month':
          return addMonths(prevDate, 1);
        case 'agenda':
          return addWeeks(prevDate, 1);
        default:
          return addWeeks(prevDate, 1);
      }
    });
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto">

        <div className="simple-card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          
          {errors.general && (
            <div className="mb-4 p-3 border border-red-500 rounded text-sm bg-red-50 text-red-700">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Title *
              </label>
              <input
                className={`simple-input ${errors.title ? 'border-red-500' : ''}`}
                value={formEvent.title}
                onChange={(e) => {
                  setFormEvent({ ...formEvent, title: e.target.value });
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
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Categorie
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(categories).map(c => (
                    <div key={c} className="relative">
                      {editingColor === c ? (
                        <input
                          type="text"
                          autoFocus
                          className="simple-input text-xs px-2 py-1 w-32"
                          value={categories[c]}
                          onChange={(e) => setCategories({ ...categories, [c]: e.target.value })}
                          onBlur={() => setEditingColor(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') {
                              setEditingColor(null);
                            }
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          aria-label={`Select ${categories[c]}`}
                          onClick={() => {
                            setFormEvent({ ...formEvent, color: c, categoryName: categories[c] });
                          }}
                          onDoubleClick={() => setEditingColor(c)}
                          disabled={isSubmitting}
                          title={`${categories[c]} (double-click to rename)`}
                          style={{
                            backgroundColor: c,
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: formEvent.color === c ? '3px solid #00000040' : '2px solid #ffffff',
                            boxShadow: formEvent.color === c ? '0 0 0 2px rgba(0,0,0,0.25)' : '0 0 0 1px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-600">Selected: {formEvent.categoryName}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Start Time *
              </label>
              <input
                type="datetime-local"
                className={`simple-input ${errors.start ? 'border-red-500' : ''}`}
                value={formEvent.start}
                onChange={(e) => {
                  setFormEvent({ ...formEvent, start: e.target.value });
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
              <label className="block text-sm font-medium mb-2 text-gray-700">
                End Time *
              </label>
              <input
                type="datetime-local"
                className={`simple-input ${errors.end ? 'border-red-500' : ''}`}
                value={formEvent.end}
                onChange={(e) => {
                  setFormEvent({ ...formEvent, end: e.target.value });
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
              {isEditing ? (
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="simple-button flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Event'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="simple-button bg-red-600 hover:bg-red-700 flex-1"
                    disabled={isSubmitting}
                  >
                    Delete Event
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="simple-button bg-gray-600 hover:bg-gray-700 flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  type="submit" 
                  className="simple-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Calendar */}
        <div className="simple-card">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Calendar</h3>
          {/* Custom event component to show a small colored box + title */}
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
            eventPropGetter={(event) => {
              const hex = (event.color || '#2563EB').replace('#','');
              // Compute brightness for contrast (simple RGB average weighted)
              const r = parseInt(hex.substring(0,2),16);
              const g = parseInt(hex.substring(2,4),16);
              const b = parseInt(hex.substring(4,6),16);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000; // 0-255
              const textColor = brightness < 130 ? '#FFFFFF' : '#000000';
              return {
                style: {
                  backgroundColor: '#' + hex,
                  color: textColor,
                  borderRadius: '6px',
                  border: 'none',
                  padding: '2px 6px',
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  overflow: 'hidden',
                  whiteSpace: 'normal'
                }
              };
            }}
            components={{
              week: {
                header: ({ date }) => (
                  <div className="rbc-header-custom">
                    <span className="rbc-header-day-number">{date.getDate()}</span>
                    <span className="rbc-header-day-name">{format(date, 'EEE')}</span>
                  </div>
                )
              },
              day: {
                header: ({ date }) => (
                  <div className="rbc-header-custom">
                    <span className="rbc-header-day-number">{date.getDate()}</span>
                    <span className="rbc-header-day-name">{format(date, 'EEE')}</span>
                  </div>
                )
              }
            }}
            date={currentDate}
            onNavigate={setCurrentDate}
            scrollToTime={new Date(1970, 1, 1, 8)}
          />
        </div>



      </div>
    </div>
  );
}
