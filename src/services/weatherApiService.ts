
interface WeatherApiData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
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
}

function degToCompass(num: number) {
  const directions = [
    'North', 'North East', 'East', 'South East',
    'South', 'South West', 'West', 'North West'
  ];
  const val = Math.floor((num / 45) + 0.5) % 8;
  return directions[val];
}

export const getWeatherApiData = async (latitude: number, longitude: number): Promise<WeatherApiData> => {
  const apiKey = 'b8d4d9a07de946daa0b91303252912'; // Free WeatherAPI key
  
  try {
    // Fetch current weather and 3-day forecast with hourly data
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data from WeatherAPI: ${response.status}`);
    }

    const data = await response.json();
    console.log('WeatherAPI data:', data);

    const current = data.current;
    const location = data.location;
    const forecast = data.forecast;

    // Process hourly forecast for today (next 24 hours)
    const today = forecast.forecastday[0];
    const currentHour = new Date().getHours();
    const hourlyForecasts = today.hour.slice(currentHour, currentHour + 8).map((hour: any) => {
      const hourTime = new Date(hour.time);
      return {
        time: hour.time_epoch.toString(),
        hour: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.temp_c),
        condition: hour.condition.text,
        icon: hour.condition.icon,
        chanceOfRain: hour.chance_of_rain
      };
    });

    // Process daily forecast
    const dailyForecasts = forecast.forecastday.map((day: any) => {
      const date = new Date(day.date);
      return {
        date: day.date_epoch.toString(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(day.day.maxtemp_c),
        low: Math.round(day.day.mintemp_c),
        condition: day.day.condition.text,
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        humidity: Math.round(day.day.avghumidity),
        windSpeed: Math.round(day.day.maxwind_kph),
        chanceOfRain: day.day.daily_chance_of_rain || 0
      };
    });

    return {
      temperature: Math.round(current.temp_c),
      condition: current.condition.text,
      description: current.condition.text,
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_kph),
      windDirection: current.wind_dir,
      pressure: Math.round(current.pressure_mb),
      visibility: Math.round(current.vis_km),
      location: location.name,
      county: location.region || '',
      icon: current.condition.icon,
      feelsLike: Math.round(current.feelslike_c),
      uvIndex: Math.round(current.uv),
      sunset: today.astro.sunset,
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching WeatherAPI data:', error);
    throw error;
  }
};
