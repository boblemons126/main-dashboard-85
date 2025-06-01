interface WeatherData {
  temperature: number;
  location: string;
}

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not configured');
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }

    const data = await response.json();
    
    if (!data.main?.temp || !data.name) {
      throw new Error('Invalid weather data received');
    }

    return {
      temperature: Math.round(data.main.temp),
      location: data.name
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}; 