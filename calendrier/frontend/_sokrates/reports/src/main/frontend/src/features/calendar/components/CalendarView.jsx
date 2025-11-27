// src/features/calendar/components/CalendarView.jsx
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import { DEFAULT_EVENT_COLOR } from "../../../utils/constants";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarView({
  events,
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
  onSelectEvent,
  onSelectSlot,
}) {
  return (
    <div className="simple-card">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Calendar</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        view={currentView}
        onView={setCurrentView}
        views={['month', 'week', 'day', 'agenda']}
        popup
        eventPropGetter={(event) => {
          const hex = (event.color || DEFAULT_EVENT_COLOR).replace('#','');
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
  );
}

CalendarView.propTypes = {
  events: PropTypes.array.isRequired,
  currentView: PropTypes.string.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
};

