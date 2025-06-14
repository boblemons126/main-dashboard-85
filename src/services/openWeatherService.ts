interface OpenWeatherData {
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

const getLocationName = async (latitude: number, longitude: number): Promise<{ location: string; county: string }> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    const city = data.city || data.locality || 'Unknown Location';
    
    let county = '';
    if (data.localityInfo && data.localityInfo.informative) {
      const countyInfo = data.localityInfo.informative.find((item: any) => 
        item.description && (
          item.description.includes('ceremonial county') || 
          item.description.includes('county')
        )
      );
      county = countyInfo ? countyInfo.name : '';
    }
    
    return { location: city, county };
  } catch (error) {
    console.error('Error getting location name:', error);
    return { location: 'Unknown Location', county: '' };
  }
};

function degToCompass(num: number) {
  const directions = [
    'North', 'North East', 'East', 'South East',
    'South', 'South West', 'West', 'North West'
  ];
  const val = Math.floor((num / 45) + 0.5) % 8;
  return directions[val];
}

export const geocodeLocation = async (query: string) => {
  const apiKey = '31fcb172502b94e6534cc6bc72352259';
  if (!apiKey) {
      console.error("OpenWeather API key is not set.");
      return null;
  }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
          const { lat, lon, name, country, state } = data[0];
          const displayName = [name, state, country].filter(Boolean).join(', ');
          return { latitude: lat, longitude: lon, name: displayName };
      }
      return null;
  } catch (error) {
      console.error('Geocoding error:', error);
      return null;
  }
};

export const searchLocations = async (query: string, limit = 5) => {
  const apiKey = '31fcb172502b94e6534cc6bc72352259';
  if (!apiKey) {
      console.error("OpenWeather API key is not set.");
      return [];
  }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
          return data.map((item: any) => {
              const { lat, lon, name, country, state } = item;
              const displayName = [name, state, country].filter(Boolean).join(', ');
              return { latitude: lat, longitude: lon, name: displayName };
          });
      }
      return [];
  } catch (error) {
      console.error('Geocoding search error:', error);
      return [];
  }
};

export const getOpenWeatherData = async (latitude: number, longitude: number): Promise<OpenWeatherData> => {
  const apiKey = '31fcb172502b94e6534cc6bc72352259'; // Using the API key from .env
  
  try {
    // Fetch current weather and 5-day forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data from OpenWeatherMap');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    console.log('OpenWeatherMap current data:', currentData);
    console.log('OpenWeatherMap forecast data:', forecastData);

    const locationInfo = await getLocationName(latitude, longitude);

    // Process hourly forecast (next 8 hours from 3-hour intervals)
    const hourlyForecasts = forecastData.list.slice(0, 8).map((item: any) => {
      const hourTime = new Date(item.dt * 1000);
      return {
        time: item.dt.toString(),
        hour: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        chanceOfRain: Math.round((item.pop || 0) * 100)
      };
    });

    // Process daily forecast (group by day)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date: item.dt.toString(),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temps: [item.main.temp],
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
          chanceOfRain: Math.round((item.pop || 0) * 100)
        });
      } else {
        dailyMap.get(dayKey).temps.push(item.main.temp);
      }
    });

    const dailyForecasts = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => ({
      ...day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps))
    }));

    return {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: currentData.wind.deg ? degToCompass(currentData.wind.deg) : '--',
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 0) / 1000), // Convert m to km
      location: locationInfo.location,
      county: locationInfo.county,
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      uvIndex: 0, // OpenWeatherMap free tier doesn't include UV index
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    throw error;
  }
};
