import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sun, Thermometer, Sunrise as SunriseIcon, Sunset as SunsetIcon } from 'lucide-react';
import { WeatherData } from '../../../types/weather';

interface WeatherStatsProps {
  weather: WeatherData;
}

const kmToMiles = (km: number) => km * 0.621371;

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

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
      value: `${kmToMiles(weather.windSpeed).toFixed(1)} mph`,
      description: weather.windDirection,
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${kmToMiles(weather.visibility).toFixed(1)} miles`,
      description: 'Clear visibility',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: SunriseIcon,
      label: 'Sunrise',
      value: `${formatTime(weather.sunrise)}`,
      description: 'Today',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${weather.feelsLike}°`,
      description: 'Apparent temperature',
      color: 'from-red-400 to-red-600'
    },
    {
      icon: SunsetIcon,
      label: 'Sunset',
      value: weather.sunset,
      description: 'Today',
      color: 'from-orange-400 to-orange-600'
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
