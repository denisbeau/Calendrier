// src/pages/CalendarPage.jsx
import React, { useState } from "react";
import { useCalendarEvents } from "../features/calendar/hooks/useCalendarEvents";
import EventForm from "../features/calendar/components/EventForm";
import CalendarView from "../features/calendar/components/CalendarView";
import { DEFAULT_CATEGORIES } from "../utils/constants";
import PropTypes from "prop-types";

export default function CalendarPage({ groupId }) {
  const {
    events,
    isSubmitting,
    errors,
    setErrors,
    handleFormSubmit,
    handleSelectEvent,
    handleDeleteEvent,
    handleSelectSlot,
    getInitialFormState,
  } = useCalendarEvents();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [formEvent, setFormEvent] = useState(getInitialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const onSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit(
      formEvent,
      isEditing,
      editingEventId,
      () => {
        if (isEditing) {
          handleCancelEdit();
        } else {
          setFormEvent(getInitialFormState());
        }
      }
    );
  };

  const onSelectEvent = (event) => {
    handleSelectEvent(event, (eventData, eventId) => {
      setFormEvent(eventData);
      setIsEditing(true);
      setEditingEventId(eventId);
    });
  };

  const onDelete = () => {
    handleDeleteEvent(editingEventId, () => {
      handleCancelEdit();
    });
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditingEventId(null);
    setFormEvent(getInitialFormState());
    setErrors({});
  };

  const onSelectSlot = (slotInfo) => {
    handleSelectSlot(slotInfo, formEvent.color, formEvent.categoryName);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <EventForm
          formEvent={formEvent}
          setFormEvent={setFormEvent}
          categories={categories}
          setCategories={setCategories}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          errors={errors}
          setErrors={setErrors}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onCancel={onCancelEdit}
        />

        <CalendarView
          events={events}
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
        />
      </div>
    </div>
  );
}

CalendarPage.propTypes = {
  groupId: PropTypes.string,
};

