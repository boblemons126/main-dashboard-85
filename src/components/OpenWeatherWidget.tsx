
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, CloudSnow, Zap, RefreshCw, Clock, Calendar } from 'lucide-react';
import { getOpenWeatherData } from '../services/openWeatherService';

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  location: string;
  county: string;
  icon: string;
  feelsLike: number;
  uvIndex: number;
  sunset: string;
  hourlyForecast: Array<{
    time: string;
    hour: string;
    temperature: number;
    condition: string;
    icon: string;
    chanceOfRain: number;
  }>;
  dailyForecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    chanceOfRain: number;
  }>;
  windDirection: string;
}

const OpenWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showHourly, setShowHourly] = useState(true);
  const forecastScrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const getWeatherIcon = (condition: string, size: string = "w-8 h-8") => {
    const iconClass = `${size} text-white drop-shadow-md`;
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return <Sun className={iconClass} />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud className={iconClass} />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className={iconClass} />;
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow className={iconClass} />;
    } else if (conditionLower.includes('thunder')) {
      return <Zap className={iconClass} />;
    } else {
      return <Sun className={iconClass} />;
    }
  };

  const getGradientByCondition = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'from-orange-400 via-orange-500 to-orange-600';
    } else if (conditionLower.includes('cloud')) {
      return 'from-gray-400 via-gray-500 to-gray-600';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'from-blue-600 via-blue-700 to-blue-800';
    } else if (conditionLower.includes('snow')) {
      return 'from-blue-200 via-blue-300 to-blue-400';
    } else if (conditionLower.includes('thunder')) {
      return 'from-gray-700 via-gray-800 to-gray-900';
    } else {
      return 'from-orange-400 via-orange-500 to-orange-600';
    }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000
        });
      });
      const { latitude, longitude } = position.coords;
      console.log('Fetching OpenWeatherMap data for location:', { latitude, longitude });
      const weatherData = await getOpenWeatherData(latitude, longitude);
      console.log('OpenWeatherMap data received:', weatherData);
      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching OpenWeatherMap weather:', error);
      if (error instanceof GeolocationPositionError) {
        setError('Location access denied. Please enable location services.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  const startScroll = (direction: 'left' | 'right') => {
    if (scrollInterval.current) return;
    scrollInterval.current = setInterval(() => {
      if (forecastScrollRef.current) {
        forecastScrollRef.current.scrollBy({
          left: direction === 'left' ? -10 : 10,
          behavior: 'smooth'
        });
      }
    }, 16);
  };

  const stopScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-white/20 rounded w-32"></div>
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
          <div className="text-xl font-bold mb-2">OpenWeather Unavailable</div>
          <div className="text-sm opacity-90 mb-4">{error}</div>
          <button
            onClick={handleRefresh}
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
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-1 mt-1">
            <MapPin className="w-4 h-4 mt-0.5" />
            <div>
              <div className="font-semibold text-base leading-tight">{weather.location}</div>
              {weather.county && <div className="text-sm opacity-70">{weather.county}</div>}
              <div className="text-xs opacity-60 mt-1">OpenWeatherMap</div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Current weather */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.condition, "w-16 h-16")}
            <div>
              <div className="text-5xl font-bold">{weather.temperature}°</div>
              <div className="text-sm opacity-80 capitalize">{weather.description}</div>
              <div className="text-sm opacity-70">Feels like {weather.feelsLike}°</div>
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs opacity-80">Humidity</div>
            <div className="font-semibold my-[8px]">{weather.humidity}%</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <Wind className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs opacity-80">Wind</div>
            <div className="font-semibold my-[8px]">{weather.windSpeed} km/h</div>
            <div className="text-xs opacity-70 -mt-1">{weather.windDirection}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <Sun className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs opacity-80">Sunset</div>
            <div className="font-semibold my-[8px]">{weather.sunset}</div>
          </div>
        </div>

        {/* Forecast toggle */}
        <div className="w-fit mx-auto flex bg-white/15 backdrop-blur-sm rounded-lg p-1 mb-3">
          <button
            onClick={() => setShowHourly(true)}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
              showHourly ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Hourly</span>
          </button>
          <button
            onClick={() => setShowHourly(false)}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
              !showHourly ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Daily</span>
          </button>
        </div>

        {/* Hourly/Daily forecast */}
        <div className="relative">
          <div
            ref={forecastScrollRef}
            className="flex space-x-3 pb-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {showHourly
              ? weather.hourlyForecast.slice(0, 8).map((hour, index) => (
                  <div key={index} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px] flex-shrink-0">
                    <div className="text-xs opacity-80 mb-1">{hour.hour}</div>
                    <div className="flex justify-center mb-1">
                      {getWeatherIcon(hour.condition, "w-5 h-5")}
                    </div>
                    <div className="text-sm font-semibold mb-1">{hour.temperature}°</div>
                    <div className="text-xs opacity-70">{hour.chanceOfRain}%</div>
                  </div>
                ))
              : weather.dailyForecast.slice(0, 7).map((day, index) => (
                  <div key={index} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px] flex-shrink-0">
                    <div className="text-xs opacity-80 mb-1">{day.day}</div>
                    <div className="flex justify-center mb-1">
                      {getWeatherIcon(day.condition, "w-5 h-5")}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold">{day.high}°</div>
                      <div className="opacity-70">{day.low}°</div>
                    </div>
                    <div className="text-xs opacity-70 mt-1">{day.chanceOfRain}%</div>
                  </div>
                ))}
          </div>
          {/* Hover zones for auto-scroll */}
          <div
            className="absolute left-0 top-0 h-full w-6 z-20 cursor-w-resize"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)' }}
            onMouseEnter={() => startScroll('left')}
            onMouseLeave={stopScroll}
          />
          <div
            className="absolute right-0 top-0 h-full w-6 z-20 cursor-e-resize"
            style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.08), transparent)' }}
            onMouseEnter={() => startScroll('right')}
            onMouseLeave={stopScroll}
          />
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Last updated */}
        {lastUpdated && (
          <div className="text-xs opacity-60 mt-4 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenWeatherWidget;
