
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWeatherData } from '../hooks/useWeatherData';
import { useLocationContext } from '../contexts/LocationContext';
import { getGradientByCondition } from '../utils/weatherUtils';
import WeatherHero from '../components/weather/detailed/WeatherHero';
import WeatherStats from '../components/weather/detailed/WeatherStats';
import WeatherForecastDetailed from '../components/weather/detailed/WeatherForecastDetailed';
import WeatherMetrics from '../components/weather/detailed/WeatherMetrics';
import WeatherChart from '../components/weather/detailed/WeatherChart';

const WeatherPage = () => {
  const { weather, loading, error, refetch, handleLocationChange } = useWeatherData();
  const { setSelectedLocationId } = useLocationContext();
  const [showHourly, setShowHourly] = useState(true);

  const onLocationChange = (locationId: string | null) => {
    setSelectedLocationId(locationId);
    handleLocationChange(locationId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-10 w-10 bg-white/20 rounded-lg"></div>
              <div className="h-8 bg-white/20 rounded w-64"></div>
            </div>
            <div className="h-40 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-white/20 rounded-xl"></div>
              <div className="h-32 bg-white/20 rounded-xl"></div>
              <div className="h-32 bg-white/20 rounded-xl"></div>
            </div>
            <div className="h-64 bg-white/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Weather Unavailable</h1>
            <p className="text-white/90 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={refetch}
                className="w-full bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <Link
                to="/utilities"
                className="w-full bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Utilities</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGradientByCondition(weather.condition)}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/utilities"
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Utilities</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-white">Weather Forecast</h1>
          
          <button
            onClick={refetch}
            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Refresh weather data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Weather Content */}
        <div className="space-y-8">
          {/* Hero Section */}
          <WeatherHero weather={weather} onLocationChange={onLocationChange} />

          {/* Weather Stats Grid */}
          <WeatherStats weather={weather} />

          {/* Weather Chart */}
          <WeatherChart weather={weather} />

          {/* Detailed Metrics */}
          <WeatherMetrics weather={weather} />

          {/* Detailed Forecast */}
          <WeatherForecastDetailed 
            weather={weather} 
            showHourly={showHourly} 
            onToggle={setShowHourly} 
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
