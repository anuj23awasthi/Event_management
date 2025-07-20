

import React from 'react';
import { useDrag } from 'react-dnd';
import './EventItem.css';

const EventItem = ({ event, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: { id: event.id, event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [event]);

  return (
    <div
      ref={drag}
      className="event-item"
      style={{ background: event.color || '#90cdf4', opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">{event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
      <div className="event-actions">
        <button className="edit-btn" onClick={e => { e.stopPropagation(); onEdit(event); }}>Edit</button>
        <button className="delete-btn" onClick={e => { e.stopPropagation(); onDelete(event); }}>Delete</button>
      </div>
    </div>
  );
};

export default EventItem;
