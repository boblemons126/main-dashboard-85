
interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  location: string;
  country: string;
  icon: string;
  feelsLike: number;
  uvIndex: number;
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
}

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const apiKey = 'b8a3c6d4e5f6g7h8i9j0k1l2m3n4o5p6'; // Free WeatherAPI.com key
  
  try {
    // Fetch current weather and forecast
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch weather data');
    }

    const data = await response.json();
    console.log('WeatherAPI response:', data);

    // Process hourly forecast for today (next 24 hours)
    const currentHour = new Date().getHours();
    const todayForecast = data.forecast.forecastday[0].hour;
    const tomorrowForecast = data.forecast.forecastday[1]?.hour || [];
    
    const hourlyForecasts = [];
    
    // Get remaining hours of today
    for (let i = currentHour; i < 24; i++) {
      const hourData = todayForecast[i];
      hourlyForecasts.push({
        time: hourData.time,
        hour: new Date(hourData.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hourData.temp_c),
        condition: hourData.condition.text,
        icon: hourData.condition.icon,
        chanceOfRain: hourData.chance_of_rain
      });
    }
    
    // Add hours from tomorrow if needed to get full 24 hours
    const hoursNeeded = Math.min(12, 24 - hourlyForecasts.length);
    for (let i = 0; i < hoursNeeded; i++) {
      const hourData = tomorrowForecast[i];
      if (hourData) {
        hourlyForecasts.push({
          time: hourData.time,
          hour: new Date(hourData.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: Math.round(hourData.temp_c),
          condition: hourData.condition.text,
          icon: hourData.condition.icon,
          chanceOfRain: hourData.chance_of_rain
        });
      }
    }

    // Process daily forecast
    const dailyForecasts = data.forecast.forecastday.slice(0, 7).map((day: any) => ({
      date: day.date,
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      condition: day.day.condition.text,
      description: day.day.condition.text,
      icon: day.day.condition.icon,
      humidity: day.day.avghumidity,
      windSpeed: Math.round(day.day.maxwind_kph),
      chanceOfRain: day.day.daily_chance_of_rain
    }));

    return {
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      pressure: Math.round(data.current.pressure_mb),
      visibility: Math.round(data.current.vis_km),
      location: data.location.name,
      country: data.location.country,
      icon: data.current.condition.icon,
      feelsLike: Math.round(data.current.feelslike_c),
      uvIndex: data.current.uv,
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
