import React from 'react';
import { Calendar, Settings, List, Grid2x2 } from 'lucide-react';

export const statsData = [
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Upcoming Events',
    value: 'Calendar',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    linkTo: '/calendar'
  },
  {
    icon: <List className="w-5 h-5" />,
    label: 'Essential Tools', 
    value: 'Utilities',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    linkTo: '/utilities'
  },
  {
    icon: <Grid2x2 className="w-5 h-5" />,
    label: 'Application List',
    value: 'Apps',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'System Preferences',
    value: 'Settings',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    linkTo: '/settings'
  }
]; 