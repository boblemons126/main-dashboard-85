import type { WeatherData } from '../types/weather';

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

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const apiKey = '31fcb172502b94e6534cc6bc72352259';
  
  try {
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

    const hourlyForecasts = forecastData.list.slice(0, 8).map((item: any) => {
      const hourTime = new Date(item.dt * 1000);
      return {
        time: item.dt.toString(),
        hour: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        chanceOfRain: Math.round((item.pop || 0) * 100),
        windSpeed: Math.round((item.wind?.speed || 0) * 3.6),
        humidity: item.main?.humidity || 50
      };
    });

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
          windSpeed: Math.round(item.wind.speed * 3.6),
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
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      windDirection: currentData.wind.deg ? degToCompass(currentData.wind.deg) : '--',
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 0) / 1000),
      location: locationInfo.location,
      county: locationInfo.county,
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      uvIndex: 0,
      sunrise: currentData.sys.sunrise,
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
