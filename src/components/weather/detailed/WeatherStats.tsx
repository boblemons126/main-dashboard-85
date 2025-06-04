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
      color: 'from-blue-500/90 to-blue-700/90'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${kmToMiles(weather.windSpeed).toFixed(1)} mph`,
      description: weather.windDirection,
      color: 'from-green-500/90 to-green-700/90'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${kmToMiles(weather.visibility).toFixed(1)} miles`,
      description: 'Clear visibility',
      color: 'from-purple-500/90 to-purple-700/90'
    },
    {
      icon: SunriseIcon,
      label: 'Sunrise',
      value: `${formatTime(weather.sunrise)}`,
      description: 'Today',
      color: 'from-yellow-500/90 to-yellow-700/90'
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${weather.feelsLike}°`,
      description: 'Apparent temperature',
      color: 'from-red-500/90 to-red-700/90'
    },
    {
      icon: SunsetIcon,
      label: 'Sunset',
      value: weather.sunset,
      description: 'Today',
      color: 'from-orange-500/90 to-orange-700/90'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/25 transition-all duration-300 group shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}>
                    <IconComponent className="w-5 h-5 text-white drop-shadow" />
                  </div>
                  <div className="text-sm text-white font-medium drop-shadow">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{stat.value}</div>
                <div className="text-sm text-white/90 drop-shadow">{stat.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherStats;
