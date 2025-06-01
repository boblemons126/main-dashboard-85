import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Thermometer, Eye, MapPin } from 'lucide-react';
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
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8,
    visibility: 10,
    location: 'Loading...',
    forecast: [
      { day: 'Today', high: 75, low: 62, condition: 'sunny' },
      { day: 'Tomorrow', high: 73, low: 58, condition: 'cloudy' },
      { day: 'Wed', high: 68, low: 55, condition: 'rainy' },
      { day: 'Thu', high: 71, low: 59, condition: 'sunny' },
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-300" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow':
      case 'snowy':
        return <CloudSnow className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getConditionGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return 'from-yellow-400 via-orange-400 to-red-400';
      case 'clouds':
      case 'cloudy':
        return 'from-gray-400 via-blue-400 to-gray-500';
      case 'rain':
      case 'rainy':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'snow':
      case 'snowy':
        return 'from-blue-200 via-blue-300 to-blue-400';
      default:
        return 'from-yellow-400 via-orange-400 to-red-400';
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
        condition: 'clear', // You can enhance this based on weather codes
        // Keep existing forecast data as the basic API doesn't include forecast
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
    <div className={`bg-gradient-to-br ${getConditionGradient(weather.condition)} rounded-2xl p-6 text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        {/* Main weather info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {getWeatherIcon(weather.condition)}
              <h2 className="text-2xl font-bold">Weather</h2>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <p className="text-white/80 capitalize">
                {loading ? 'Loading...' : error ? 'Location unavailable' : weather.location}
              </p>
            </div>
            {error && (
              <p className="text-red-200 text-sm mt-1">{error}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">
              {loading ? '--' : `${weather.temperature}°`}
            </div>
            <div className="text-white/80 text-sm">
              Feels like {loading ? '--' : `${weather.temperature + 2}°`}
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-sm opacity-80">Humidity</span>
            </div>
            <div className="text-lg font-semibold">{weather.humidity}%</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-sm opacity-80">Wind</span>
            </div>
            <div className="text-lg font-semibold">{weather.windSpeed} mph</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm opacity-80">Visibility</span>
            </div>
            <div className="text-lg font-semibold">{weather.visibility} mi</div>
          </div>
        </div>

        {/* Forecast */}
        <div>
          <h3 className="text-lg font-semibold mb-3">4-Day Forecast</h3>
          <div className="grid grid-cols-4 gap-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                <div className="text-sm opacity-80 mb-2">{day.day}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{day.high}°</div>
                  <div className="opacity-70">{day.low}°</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
