
import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from 'date-fns';

import EventItem from '../EventItem/EventItem';
import { useDrop } from 'react-dnd';
import './Calendar.css';

const CalendarDayCell = ({
  day,
  isToday,
  isCurrentMonth,
  formattedDate,
  events,
  onDayClick,
  onEventEdit,
  onEventDelete,
  onEventDrop
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item) => {
      if (isCurrentMonth && onEventDrop) {
        onEventDrop(item.event, day);
      }
    },
    canDrop: () => isCurrentMonth,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [isCurrentMonth, day, onEventDrop]);

  return (
    <div
      ref={drop}
      className={`calendar-cell${isToday ? ' today' : ''}${!isCurrentMonth ? ' disabled' : ''}${isOver && canDrop ? ' droppable' : ''}`}
      onClick={() => isCurrentMonth && onDayClick(day)}
    >
      <span>{formattedDate}</span>
      <div className="calendar-events">
        {events.map((e, idx) => (
          <EventItem
            key={e.id || idx}
            event={e}
            onEdit={onEventEdit}
            onDelete={onEventDelete}
          />
        ))}
      </div>
    </div>
  );
};

const Calendar = ({ events, onDayClick, onEventEdit, onEventDelete, onEventDrop }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{'<'}</button>
      <span>{format(currentMonth, 'MMMM yyyy')}</span>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{'>'}</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-name" key={i}>
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="calendar-days-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const isToday = isSameDay(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
        days.push(
          <CalendarDayCell
            key={day}
            day={day}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            formattedDate={formattedDate}
            events={dayEvents}
            onDayClick={onDayClick}
            onEventEdit={onEventEdit}
            onEventDelete={onEventDelete}
            onEventDrop={onEventDrop}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-cells">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
