import React, { useState } from 'react';
import { Calendar, Plus, Edit3, Trash2, Clock, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  label: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: '2024-01-15',
      time: '10:00',
      label: 'Work'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      date: '2024-01-16',
      time: '14:30',
      label: 'Health'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    label: ''
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', date: '', time: '', label: '' });
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      label: event.label
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id ? { ...editingEvent, ...formData } : event
      ));
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...formData
      };
      setEvents([...events, newEvent]);
    }
    setIsDialogOpen(false);
    setFormData({ title: '', description: '', date: '', time: '', label: '' });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/" className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 flex items-center justify-center">
                  <Home className="w-6 h-6" />
                  <span className="sr-only">Home</span>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Calendar</h1>
                  <p className="text-blue-200">Manage your events and schedules</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Event title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Input
                      placeholder="Label (e.g., Work, Personal, Health)"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button onClick={handleSaveEvent} className="w-full bg-blue-600 hover:bg-blue-700">
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Events List */}
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200 mb-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-300">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </span>
                    <span className="bg-blue-500/20 px-2 py-1 rounded-full text-xs">
                      {event.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
