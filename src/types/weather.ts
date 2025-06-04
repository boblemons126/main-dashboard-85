
export interface WeatherData {
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
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temperature: number;
  condition: string;
  icon: string;
  chanceOfRain: number;
}

export interface DailyForecast {
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
}
