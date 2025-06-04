
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useLocationContext } from '../../contexts/LocationContext';
import WeatherHeader from './WeatherHeader';
import CurrentWeather from './CurrentWeather';
import WeatherDetails from './WeatherDetails';
import ForecastToggle from './ForecastToggle';
import WeatherForecast from './WeatherForecast';
import { getGradientByCondition } from '../../utils/weatherUtils';

const WeatherWidget = () => {
  const { weather, loading, error, lastUpdated, refetch, handleLocationChange } = useWeatherData();
  const { setSelectedLocationId } = useLocationContext();
  const [showHourly, setShowHourly] = useState(true);

  const onLocationChange = (locationId: string | null) => {
    setSelectedLocationId(locationId);
    handleLocationChange(locationId);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-white/20 rounded w-24"></div>
            <div className="h-8 bg-white/20 rounded w-16"></div>
          </div>
          <div className="h-12 bg-white/20 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-16 bg-white/20 rounded"></div>
            <div className="h-16 bg-white/20 rounded"></div>
            <div className="h-16 bg-white/20 rounded"></div>
          </div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">Weather Unavailable</div>
          <div className="text-sm opacity-90 mb-4">{error}</div>
          <button 
            onClick={refetch} 
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`bg-gradient-to-br ${getGradientByCondition(weather.condition)} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <WeatherHeader 
          location={weather.location}
          county={weather.county}
          onRefresh={refetch}
          onLocationChange={onLocationChange}
        />
        
        <CurrentWeather 
          temperature={weather.temperature}
          condition={weather.condition}
          description={weather.description}
          feelsLike={weather.feelsLike}
        />
        
        <WeatherDetails 
          humidity={weather.humidity}
          windSpeed={weather.windSpeed}
          windDirection={weather.windDirection}
          sunset={weather.sunset}
        />
        
        <ForecastToggle 
          showHourly={showHourly}
          onToggle={setShowHourly}
        />
        
        <WeatherForecast 
          showHourly={showHourly}
          hourlyForecast={weather.hourlyForecast}
          dailyForecast={weather.dailyForecast}
        />
        
        {lastUpdated && (
          <div className="text-xs opacity-60 mt-4 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
