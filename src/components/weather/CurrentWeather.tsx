
import React from 'react';
import { getWeatherIcon } from '../../utils/weatherUtils';

interface CurrentWeatherProps {
  temperature: number;
  condition: string;
  description: string;
  feelsLike: number;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  temperature, 
  condition, 
  description, 
  feelsLike 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {getWeatherIcon(condition, "w-16 h-16")}
        <div>
          <div className="text-5xl font-bold">{temperature}°</div>
          <div className="text-sm opacity-80 capitalize">{description}</div>
          <div className="text-sm opacity-70">Feels like {feelsLike}°</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
