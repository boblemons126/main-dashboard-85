
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  location?: string;
  attendees?: number;
  type: 'meeting' | 'personal' | 'reminder';
  date: number;
}

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      time: '09:00 AM',
      duration: '30 min',
      location: 'Conference Room A',
      attendees: 5,
      type: 'meeting',
      date: new Date().getDate()
    },
    {
      id: '2',
      title: 'Home Maintenance Check',
      time: '02:00 PM',
      duration: '1 hour',
      type: 'personal',
      date: new Date().getDate()
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'personal',
      date: new Date().getDate() + 2
    },
    {
      id: '4',
      title: 'Project Review',
      time: '03:00 PM',
      duration: '2 hours',
      attendees: 3,
      type: 'meeting',
      date: new Date().getDate() + 5
    }
  ]);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: false
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    const hasEvents = events.some(event => event.date === day);
    
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      hasEvents
    });
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: false
    });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/20 border-l-blue-500';
      case 'personal':
        return 'bg-green-500/20 border-l-green-500';
      case 'reminder':
        return 'bg-orange-500/20 border-l-orange-500';
      default:
        return 'bg-gray-500/20 border-l-gray-500';
    }
  };

  const getTodaysEvents = () => {
    return events.filter(event => event.date === today.getDate());
  };

  // Simulate Google Calendar API call
  useEffect(() => {
    const fetchCalendarEvents = () => {
      console.log('Fetching calendar events...');
      // This would be replaced with actual Google Calendar API call
    };
    
    fetchCalendarEvents();
    const interval = setInterval(fetchCalendarEvents, 900000); // Update every 15 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-medium min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-white/60 font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => (
            <div
              key={index}
              className={`
                relative h-8 flex items-center justify-center text-sm rounded cursor-pointer
                transition-all duration-200 hover:bg-white/10
                ${dayInfo.isCurrentMonth 
                  ? dayInfo.isToday 
                    ? 'bg-blue-500 text-white font-bold' 
                    : 'text-white hover:bg-white/10'
                  : 'text-white/30'
                }
              `}
            >
              {dayInfo.day}
              {dayInfo.hasEvents && dayInfo.isCurrentMonth && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Events */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Today's Events</h3>
        <div className="space-y-2">
          {getTodaysEvents().length > 0 ? (
            getTodaysEvents().map((event) => (
              <div
                key={event.id}
                className={`rounded-xl p-3 border-l-4 ${getEventTypeColor(event.type)} hover:bg-white/10 transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm">{event.title}</h4>
                </div>
                <div className="flex items-center text-xs text-white/70 space-x-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <span>•</span>
                  <span>{event.duration}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-white/60 text-sm">No events scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
