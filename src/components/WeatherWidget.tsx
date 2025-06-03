
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Thermometer, Eye, MapPin, ChevronRight } from 'lucide-react';
import { getWeatherData } from '../services/weather';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    precipitation: number;
  }>;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 17,
    condition: 'cloudy',
    humidity: 65,
    windSpeed: 8,
    visibility: 10,
    location: 'Loading...',
    forecast: [
      { day: 'Today', high: 75, low: 62, condition: 'sunny' },
      { day: 'Tomorrow', high: 73, low: 58, condition: 'cloudy' },
      { day: 'Wed', high: 68, low: 55, condition: 'rainy' },
      { day: 'Thu', high: 71, low: 59, condition: 'sunny' },
    ],
    hourlyForecast: [
      { time: '15:00', temperature: 17, condition: 'cloudy', precipitation: 0 },
      { time: '16:00', temperature: 16, condition: 'cloudy', precipitation: 0 },
      { time: '17:00', temperature: 16, condition: 'cloudy', precipitation: 0 },
      { time: '18:00', temperature: 15, condition: 'cloudy', precipitation: 1 },
      { time: '19:00', temperature: 15, condition: 'cloudy', precipitation: 1 },
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-300" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-white/90" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-200" />;
      case 'snow':
      case 'snowy':
        return <CloudSnow className="w-6 h-6 text-blue-100" />;
      default:
        return <Cloud className="w-6 h-6 text-white/90" />;
    }
  };

  const fetchCurrentWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      console.log('User location:', latitude, longitude);
      
      // Fetch weather data
      const weatherData = await getWeatherData(latitude, longitude);
      console.log('Weather data received:', weatherData);
      
      setWeather(prevWeather => ({
        ...prevWeather,
        temperature: weatherData.temperature,
        location: weatherData.location,
        condition: 'cloudy',
      }));
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      if (error instanceof GeolocationPositionError) {
        setError('Location access denied. Please enable location services.');
      } else {
        setError('Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentWeather();
    // Update weather every 5 minutes
    const interval = setInterval(fetchCurrentWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10">
        {/* Header with location */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
            <h2 className="text-lg font-medium">
              {loading ? 'Loading...' : error ? 'Location unavailable' : weather.location}
            </h2>
          </div>
          <button className="text-white/60 hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Main temperature and condition */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <span className="text-4xl font-light">
              {loading ? '--' : `${weather.temperature}°C`}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>Expect 4 rainy days in a row starting Tomorrow.</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Hourly and Daily tabs */}
        <div className="flex space-x-6 mb-4">
          <button className="text-white font-medium border-b-2 border-white pb-1">
            Hourly
          </button>
          <button className="text-white/60 hover:text-white font-medium">
            Daily
          </button>
        </div>

        {/* Hourly forecast */}
        <div className="flex justify-between space-x-4">
          {weather.hourlyForecast.map((hour, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 min-w-0 flex-1">
              <div className="text-sm text-white/80 font-medium">
                {hour.time}
              </div>
              <div className="flex justify-center">
                {getWeatherIcon(hour.condition)}
              </div>
              <div className="text-lg font-medium">
                {hour.temperature}°
              </div>
              <div className="text-xs text-white/60 flex items-center space-x-1">
                <Droplets className="w-3 h-3" />
                <span>{hour.precipitation}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* See full forecast link */}
        <div className="mt-4 text-right">
          <button className="text-white/80 hover:text-white text-sm underline">
            See full forecast
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
