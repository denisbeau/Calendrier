// src/features/calendar/components/EventForm.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { DEFAULT_CATEGORIES, DEFAULT_EVENT_COLOR, DEFAULT_CATEGORY_NAME } from "../../../utils/constants";

export default function EventForm({
  formEvent,
  setFormEvent,
  categories,
  setCategories,
  isEditing,
  isSubmitting,
  errors,
  setErrors,
  onSubmit,
  onDelete,
  onCancel,
}) {
  const [editingColor, setEditingColor] = useState(null);

  return (
    <div className="simple-card mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      {errors.general && (
        <div className="mb-4 p-3 border border-red-500 rounded text-sm bg-red-50 text-red-700">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                onClick={onDelete}
                className="simple-button bg-red-600 hover:bg-red-700 flex-1"
                disabled={isSubmitting}
              >
                Delete Event
              </button>
              
              <button
                type="button"
                onClick={onCancel}
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
  );
}

EventForm.propTypes = {
  formEvent: PropTypes.object.isRequired,
  setFormEvent: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
  setCategories: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

