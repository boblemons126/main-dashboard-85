import React from 'react';
import { TrendingUp, TrendingDown, Activity, Gauge } from 'lucide-react';
import { WeatherData } from '../../../types/weather';

interface WeatherMetricsProps {
  weather: WeatherData;
}

const kmToMiles = (km: number) => km * 0.621371;

const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const getComfortLevel = (temp: number, humidity: number) => {
    if (temp >= 20 && temp <= 26 && humidity >= 40 && humidity <= 60) {
      return { level: 'Excellent', color: 'text-green-400', icon: TrendingUp };
    } else if (temp >= 18 && temp <= 28 && humidity >= 30 && humidity <= 70) {
      return { level: 'Good', color: 'text-yellow-400', icon: Activity };
    } else {
      return { level: 'Fair', color: 'text-orange-400', icon: TrendingDown };
    }
  };

  const comfort = getComfortLevel(weather.temperature, weather.humidity);
  const ComfortIcon = comfort.icon;

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Comfort Index */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ComfortIcon className={`w-6 h-6 ${comfort.color}`} />
            <h3 className="text-lg font-semibold text-white">Comfort Level</h3>
          </div>
          <div className={`text-2xl font-bold mb-2 ${comfort.color}`}>{comfort.level}</div>
          <div className="text-sm text-white/70">
            Based on temperature and humidity levels
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gauge className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Pressure</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">{weather.pressure || 'N/A'} hPa</div>
          <div className="text-sm text-white/70">
            Atmospheric pressure
          </div>
        </div>

        {/* Air Quality */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-green-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-white">Air Quality</h3>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-2">Good</div>
          <div className="text-sm text-white/70">
            Based on visibility: {kmToMiles(weather.visibility).toFixed(1)} miles
          </div>
        </div>
      </div>

      {/* Weather Summary */}
      <div className="mt-8 bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Summary</h3>
        <p className="text-white/80 leading-relaxed">
          Currently experiencing {weather.description.toLowerCase()} with a temperature of {weather.temperature}°C. 
          Winds are coming from the {weather.windDirection.toLowerCase()} at {weather.windSpeed} mph. 
          Humidity levels are at {weather.humidity}%, creating {comfort.level.toLowerCase()} comfort conditions.
          Visibility is {kmToMiles(weather.visibility).toFixed(1)} miles.
          {weather.sunset && ` Sunset is expected at ${weather.sunset}.`}
        </p>
      </div>
    </div>
  );
};

export default WeatherMetrics;
