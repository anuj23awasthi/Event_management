import React, { useState } from 'react';
import Calendar from './components/Calendar/Calendar';
import { addDays, addWeeks, addMonths, isAfter, isBefore, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import EventForm from './components/EventForm/EventForm';
import Modal from './components/Modal/Modal';
import { useEvents } from './hooks/useEvents';
import './App.css';


function App() {
  const [events, setEvents] = useEvents();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
    setModalOpen(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setModalOpen(true);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event) => {
    setEvents(events.filter(e => e.id !== event.id));
  };


  const getExpandedEvents = (baseEvents = events) => {
   
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    let expanded = [];
    for (const event of baseEvents) {
      if (!event.recurrence || event.recurrence === 'none') {
        expanded.push(event);
        continue;
      }
      let start = new Date(event.date);
      let repeatEnd = monthEnd;
      if (isAfter(start, monthEnd)) continue;
      if (isBefore(start, monthStart)) start = monthStart;
      let current = new Date(event.date);
      while (!isAfter(current, monthEnd)) {
        if (!isBefore(current, monthStart)) {
          expanded.push({ ...event, date: current.toISOString() });
        }
        if (event.recurrence === 'daily') {
          current = addDays(current, 1);
        } else if (event.recurrence === 'weekly') {
          current = addWeeks(current, 1);
        } else if (event.recurrence === 'monthly') {
          current = addMonths(current, 1);
        } else if (event.recurrence === 'custom' && event.custom) {
          if (event.custom.unit === 'days') current = addDays(current, event.custom.interval);
          else if (event.custom.unit === 'weeks') current = addWeeks(current, event.custom.interval);
          else if (event.custom.unit === 'months') current = addMonths(current, event.custom.interval);
          else break;
        } else {
          break;
        }
      }
    }
    return expanded;
  };

  
  const handleEventDrop = (event, newDate) => {
   
    if (event.recurrence && event.recurrence !== 'none') return;
    const oldDate = new Date(event.date);
   
    const hours = oldDate.getHours();
    const minutes = oldDate.getMinutes();
    const updatedDate = new Date(newDate);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    setEvents(events.map(e => e.id === event.id ? { ...e, date: updatedDate.toISOString() } : e));
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="app-container">
      <h1>Event Manage Calendar</h1>
      <input
        type="text"
        placeholder="Search events by title or description..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <Calendar
        events={getExpandedEvents(filteredEvents)}
        onDayClick={handleDayClick}
        onEventEdit={handleEditEvent}
        onEventDelete={handleDeleteEvent}
        onEventDrop={handleEventDrop}
      />
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingEvent(null); }}>
        <EventForm
          date={selectedDate}
          event={editingEvent}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          events={events}
        />
      </Modal>
    </div>
  );
}

export default App;
