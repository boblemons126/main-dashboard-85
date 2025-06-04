
import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '../../../types/weather';

interface ChartLegendProps {
  showTemperature: boolean;
  showRain: boolean;
  showWind: boolean;
  showHumidity: boolean;
  showSunriseSunset: boolean;
  weather: WeatherData;
}

const ChartLegend: React.FC<ChartLegendProps> = ({
  showTemperature,
  showRain,
  showWind,
  showHumidity,
  showSunriseSunset,
  weather,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
      {showTemperature && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 bg-amber-400 rounded-full shadow-sm"></div>
          <span className="text-sm text-white/90 font-medium">Temperature (°C)</span>
        </div>
      )}
      {showRain && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 bg-blue-400 rounded-full border-2 border-dashed border-blue-400 shadow-sm"></div>
          <span className="text-sm text-white/90 font-medium">Rain Chance (%)</span>
        </div>
      )}
      {showWind && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 bg-emerald-400 rounded-full shadow-sm"></div>
          <span className="text-sm text-white/90 font-medium">Wind Speed (km/h)</span>
        </div>
      )}
      {showHumidity && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 bg-purple-400 rounded-full border-2 border-dashed border-purple-400 shadow-sm"></div>
          <span className="text-sm text-white/90 font-medium">Humidity (%)</span>
        </div>
      )}
      {showSunriseSunset && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sunrise className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/90 font-medium">
              {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/90 font-medium">
              {weather.sunset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartLegend;
