
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
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
}

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your environment variables.');
  }

  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(errorData.message || 'Failed to fetch current weather data');
    }

    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    let forecastData = null;
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json();
    }

    // Process forecast data to get daily forecasts
    const dailyForecasts = [];
    if (forecastData) {
      const dailyData = {};
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            date: dayKey,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            temps: [],
            conditions: [],
            icons: [],
            humidity: [],
            windSpeed: []
          };
        }
        
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].conditions.push(item.weather[0].main);
        dailyData[dayKey].icons.push(item.weather[0].icon);
        dailyData[dayKey].humidity.push(item.main.humidity);
        dailyData[dayKey].windSpeed.push(item.wind.speed);
      });

      Object.values(dailyData).slice(0, 5).forEach((day: any) => {
        dailyForecasts.push({
          date: day.date,
          day: day.day,
          high: Math.round(Math.max(...day.temps)),
          low: Math.round(Math.min(...day.temps)),
          condition: day.conditions[0],
          description: day.conditions[0],
          icon: day.icons[0],
          humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
          windSpeed: Math.round(day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length)
        });
      });
    }

    return {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed || 0),
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000),
      location: currentData.name,
      country: currentData.sys.country,
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      uvIndex: 0, // UV index requires a separate API call
      forecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
