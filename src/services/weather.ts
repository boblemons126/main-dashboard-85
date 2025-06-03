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
  country: string;
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

const getConditionFromIcon = (icon: string): string => {
  const iconMap: { [key: string]: string } = {
    'clear-day': 'Clear',
    'clear-night': 'Clear',
    'rain': 'Rain',
    'snow': 'Snow',
    'sleet': 'Sleet',
    'wind': 'Windy',
    'fog': 'Fog',
    'cloudy': 'Cloudy',
    'partly-cloudy-day': 'Partly Cloudy',
    'partly-cloudy-night': 'Partly Cloudy',
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
    // Use principalSubdivision for county (Devon, etc.)
    const county = data.principalSubdivision || '';
    const location = county ? `${city}, ${county}` : city;
    return {
      location,
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
  const apiKey = 'IOSfbJRQf6aandt4MVF84vWA1KNfTDSq'; // You'll need to get this from pirateweather.net
  
  try {
    // Fetch weather data from Pirate Weather API
    const response = await fetch(
      `https://api.pirateweather.net/forecast/${apiKey}/${latitude},${longitude}?units=si`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Pirate Weather API response:', data);

    // Get location name
    const locationInfo = await getLocationName(latitude, longitude);

    // Process hourly forecast for the rest of the day
    const currentHour = new Date().getHours();
    const hourlyForecasts = data.hourly.data.slice(0, 24).map((hour: any, index: number) => {
      const hourTime = new Date(hour.time * 1000);
      return {
        time: hour.time,
        hour: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.temperature),
        condition: getConditionFromIcon(hour.icon),
        icon: hour.icon,
        chanceOfRain: Math.round((hour.precipProbability || 0) * 100)
      };
    });

    // Process daily forecast
    const dailyForecasts = data.daily.data.slice(0, 7).map((day: any) => {
      const dayDate = new Date(day.time * 1000);
      return {
        date: day.time,
        day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(day.temperatureHigh),
        low: Math.round(day.temperatureLow),
        condition: getConditionFromIcon(day.icon),
        description: getConditionFromIcon(day.icon),
        icon: day.icon,
        humidity: Math.round((day.humidity || 0) * 100),
        windSpeed: Math.round(day.windSpeed || 0),
        chanceOfRain: Math.round((day.precipProbability || 0) * 100)
      };
    });

    const current = data.currently;
    const today = data.daily.data[0];

    return {
      temperature: Math.round(current.temperature),
      condition: getConditionFromIcon(current.icon),
      description: getConditionFromIcon(current.icon),
      humidity: Math.round((current.humidity || 0) * 100),
      windSpeed: Math.round((current.windSpeed || 0) * 0.621371), // Convert km/h to mph
      windDirection: current.windBearing !== undefined ? degToCompass(current.windBearing) : '--',
      pressure: Math.round(current.pressure || 0),
      visibility: Math.round((current.visibility || 0) * 1.60934), // Convert miles to km
      location: locationInfo.location,
      country: locationInfo.county,
      icon: current.icon,
      feelsLike: Math.round(current.apparentTemperature),
      uvIndex: Math.round(current.uvIndex || 0),
      sunset: today && today.sunsetTime ? new Date(today.sunsetTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--',
      hourlyForecast: hourlyForecasts,
      dailyForecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
