
interface WeatherData {
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

const getConditionFromOpenWeatherIcon = (icon: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': 'Clear',
    '01n': 'Clear',
    '02d': 'Partly Cloudy',
    '02n': 'Partly Cloudy',
    '03d': 'Cloudy',
    '03n': 'Cloudy',
    '04d': 'Cloudy',
    '04n': 'Cloudy',
    '09d': 'Rain',
    '09n': 'Rain',
    '10d': 'Rain',
    '10n': 'Rain',
    '11d': 'Thunder',
    '11n': 'Thunder',
    '13d': 'Snow',
    '13n': 'Snow',
    '50d': 'Fog',
    '50n': 'Fog',
  };
  return iconMap[icon] || 'Unknown';
};

const getLocationName = async (latitude: number, longitude: number): Promise<{ location: string; county: string }> => {
  try {
    // Use a reverse geocoding service to get location name
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    // Prefer city, fallback to locality, then unknown
    const city = data.city || data.locality || 'Unknown Location';
    
    // Extract county from informative array (look for county/ceremonial county description)
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
    
    return {
      location: city,
      county
    };
  } catch (error) {
    console.error('Error getting location name:', error);
    return {
      location: 'Unknown Location',
      county: ''
    };
  }
};

// Helper to convert degrees to 8-point compass direction with full names
function degToCompass(num: number) {
  const directions = [
    'North', 'North East', 'East', 'South East',
    'South', 'South West', 'West', 'North West'
  ];
  const val = Math.floor((num / 45) + 0.5) % 8;
  return directions[val];
}

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeather API key is not configured');
  }
  
  try {
    // Fetch current weather and forecast data from OpenWeather API
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
    ]);

    if (!currentResponse.ok) {
      throw new Error(`Failed to fetch current weather data: ${currentResponse.status}`);
    }

    if (!forecastResponse.ok) {
      throw new Error(`Failed to fetch forecast data: ${forecastResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    console.log('OpenWeather current data:', currentData);
    console.log('OpenWeather forecast data:', forecastData);

    // Get location name
    const locationInfo = await getLocationName(latitude, longitude);

    // Process hourly forecast (OpenWeather gives us 5-day forecast with 3-hour intervals)
    const hourlyForecasts = forecastData.list.slice(0, 8).map((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      return {
        time: item.dt,
        hour: itemDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(item.main.temp),
        condition: getConditionFromOpenWeatherIcon(item.weather[0].icon),
        icon: item.weather[0].icon,
        chanceOfRain: Math.round((item.pop || 0) * 100)
      };
    });

    // Process daily forecast by grouping forecast data by day
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date: item.dt,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temps: [item.main.temp],
          condition: getConditionFromOpenWeatherIcon(item.weather[0].icon),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 2.237), // Convert m/s to mph
          chanceOfRain: Math.round((item.pop || 0) * 100)
        });
      } else {
        const dayData = dailyMap.get(dayKey);
        dayData.temps.push(item.main.temp);
      }
    });

    const dailyForecasts = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => ({
      date: day.date,
      day: day.day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      condition: day.condition,
      description: day.description,
      icon: day.icon,
      humidity: day.humidity,
      windSpeed: day.windSpeed,
      chanceOfRain: day.chanceOfRain
    }));

    return {
      temperature: Math.round(currentData.main.temp),
      condition: getConditionFromOpenWeatherIcon(currentData.weather[0].icon),
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round((currentData.wind.speed || 0) * 2.237), // Convert m/s to mph
      windDirection: currentData.wind.deg !== undefined ? degToCompass(currentData.wind.deg) : '--',
      pressure: Math.round(currentData.main.pressure || 0),
      visibility: Math.round((currentData.visibility || 0) / 1000), // Convert meters to km
      location: locationInfo.location,
      county: locationInfo.county,
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      uvIndex: 0, // OpenWeather doesn't provide UV index in basic plan
      sunset: currentData.sys.sunset ? new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--',
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
