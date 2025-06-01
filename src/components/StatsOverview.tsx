
import React from 'react';
import { Thermometer, Newspaper, Calendar, Wifi } from 'lucide-react';

const StatsOverview = () => {
  const stats = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Temperature',
      value: '72°F',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      label: 'News Updates',
      value: '4 new',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Events Today',
      value: '4 events',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      label: 'System Status',
      value: 'All Online',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} backdrop-blur-md rounded-xl p-4 border ${stat.borderColor} hover:bg-white/20 transition-all duration-200`}
        >
          <div className="flex items-center space-x-3">
            <div className={stat.color}>
              {stat.icon}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{stat.value}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
