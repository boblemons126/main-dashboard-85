
import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weather';
import type { WeatherData } from '../types/weather';
import { useLocationContext } from '../contexts/LocationContext';

export const useWeatherData = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { customLocations, selectedLocationId } = useLocationContext();

  const fetchWeatherData = async (customLat?: number, customLon?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      let latitude: number, longitude: number;

      if (customLat !== undefined && customLon !== undefined) {
        latitude = customLat;
        longitude = customLon;
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 300000
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }
      
      console.log('Fetching weather for location:', { latitude, longitude });
      
      const weatherData = await getWeatherData(latitude, longitude);
      console.log('Weather data received:', weatherData);
      
      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather:', error);
      
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

  const handleLocationChange = (locationId: string | null) => {
    if (locationId) {
      const customLocation = customLocations.find(loc => loc.id === locationId);
      if (customLocation) {
        fetchWeatherData(customLocation.latitude, customLocation.longitude);
      }
    } else {
      fetchWeatherData();
    }
  };

  useEffect(() => {
    if (selectedLocationId) {
      const customLocation = customLocations.find(loc => loc.id === selectedLocationId);
      if (customLocation) {
        fetchWeatherData(customLocation.latitude, customLocation.longitude);
      }
    } else {
      fetchWeatherData();
    }
    
    const interval = setInterval(() => {
      if (selectedLocationId) {
        const customLocation = customLocations.find(loc => loc.id === selectedLocationId);
        if (customLocation) {
          fetchWeatherData(customLocation.latitude, customLocation.longitude);
        }
      } else {
        fetchWeatherData();
      }
    }, 600000);
    
    return () => clearInterval(interval);
  }, [selectedLocationId, customLocations]);

  return {
    weather,
    loading,
    error,
    lastUpdated,
    refetch: () => {
      if (selectedLocationId) {
        const customLocation = customLocations.find(loc => loc.id === selectedLocationId);
        if (customLocation) {
          fetchWeatherData(customLocation.latitude, customLocation.longitude);
        }
      } else {
        fetchWeatherData();
      }
    },
    handleLocationChange
  };
};
