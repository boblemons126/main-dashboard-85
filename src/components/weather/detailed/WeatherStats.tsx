
import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sun, Thermometer } from 'lucide-react';
import { WeatherData } from '../../../types/weather';

interface WeatherStatsProps {
  weather: WeatherData;
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ weather }) => {
  const stats = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      description: 'Relative humidity',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${weather.windSpeed} mph`,
      description: weather.windDirection,
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.visibility} km`,
      description: 'Clear visibility',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      description: 'Atmospheric pressure',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Sun,
      label: 'Sunset',
      value: weather.sunset,
      description: 'Today',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${weather.feelsLike}°`,
      description: 'Apparent temperature',
      color: 'from-red-400 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherStats;
