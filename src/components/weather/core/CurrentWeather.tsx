
import React from 'react';
import { getWeatherIcon } from '@/utils/weatherUtils';

interface CurrentWeatherProps {
  temperature: number;
  condition: string;
  description: string;
  feelsLike: number;
  temperatureUnit?: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  temperature,
  condition,
  description,
  feelsLike,
  temperatureUnit = 'celsius'
}) => {
  const displayTemperature = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round(temp * 9 / 5 + 32);
    }
    return Math.round(temp);
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      {getWeatherIcon(condition, "w-16 h-16")}
      <div>
        <div className="text-4xl font-bold">{displayTemperature(temperature)}°</div>
        <div className="text-sm opacity-80 capitalize">{description}</div>
        <div className="text-sm opacity-70">Feels like {displayTemperature(feelsLike)}°</div>
      </div>
    </div>
  );
};

export default CurrentWeather;
