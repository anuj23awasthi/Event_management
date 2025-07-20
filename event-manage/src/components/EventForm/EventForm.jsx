
import React, { useState } from 'react';
import './EventForm.css';

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const defaultColors = ['#90cdf4', '#f6ad55', '#68d391', '#fc8181', '#f687b3'];



const EventForm = ({ date, event, onAddEvent, onUpdateEvent, events = [] }) => {
  const isEdit = !!event;
  const [title, setTitle] = useState(event ? event.title : '');
  const [eventDate, setEventDate] = useState(event ? event.date.slice(0, 10) : (date ? date.toISOString().slice(0, 10) : ''));
  const [eventTime, setEventTime] = useState(event ? event.date.slice(11, 16) : '12:00');
  const [description, setDescription] = useState(event ? event.description : '');
  const [recurrence, setRecurrence] = useState(event ? event.recurrence : 'none');
  const [color, setColor] = useState(event ? event.color : defaultColors[0]);
  const [customInterval, setCustomInterval] = useState(event && event.custom ? event.custom.interval : 2);
  const [customUnit, setCustomUnit] = useState(event && event.custom ? event.custom.unit : 'weeks');
  const [conflict, setConflict] = useState('');

  const checkConflict = (dateTime) => {
    return events.some(e => {
      if (isEdit && e.id === event.id) return false;
      return e.date === dateTime;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const eventObj = {
      id: isEdit ? event.id : Date.now(),
      title,
      date: eventDate + 'T' + eventTime,
      description,
      recurrence,
      color,
      custom: recurrence === 'custom' ? { interval: customInterval, unit: customUnit } : null,
    };
    if (checkConflict(eventObj.date)) {
      setConflict('There is already an event at this date and time.');
      return;
    }
    setConflict('');
    if (isEdit && onUpdateEvent) {
      onUpdateEvent(eventObj);
    } else if (onAddEvent) {
      onAddEvent(eventObj);
    }
  };

  return (
    <form className="event-form-container" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Event' : 'Add Event'}</h2>
      {conflict && <div style={{ color: 'red', fontWeight: 'bold' }}>{conflict}</div>}
      <label>Title
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>Date
        <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
      </label>
      <label>Time
        <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} required />
      </label>
      <label>Description
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>Recurrence
        <select value={recurrence} onChange={e => setRecurrence(e.target.value)}>
          {recurrenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </label>
      {recurrence === 'custom' && (
        <div className="custom-recurrence">
          <label>Every
            <input type="number" min="1" value={customInterval} onChange={e => setCustomInterval(Number(e.target.value))} style={{ width: 60 }} />
          </label>
          <select value={customUnit} onChange={e => setCustomUnit(e.target.value)}>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      )}
      <label>Color
        <div className="color-options">
          {defaultColors.map(c => (
            <span
              key={c}
              className={`color-dot${color === c ? ' selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </label>
      <button type="submit">{isEdit ? 'Update Event' : 'Add Event'}</button>
    </form>
  );
};

export default EventForm;
