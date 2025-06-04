
import React, { useState } from 'react';
import { WeatherData } from '../../../types/weather';
import ChartToggleControls from './ChartToggleControls';
import ChartLegend from './ChartLegend';
import WeatherChartCore from './WeatherChartCore';

interface WeatherChartProps {
  weather: WeatherData;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weather }) => {
  const [showTemperature, setShowTemperature] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const [showWind, setShowWind] = useState(false);
  const [showHumidity, setShowHumidity] = useState(false);
  const [showSunriseSunset, setShowSunriseSunset] = useState(true);

  // Get sunrise and sunset times (convert to hour format for chart)
  const sunriseHour = new Date(weather.sunrise * 1000).getHours();
  const sunsetTime = weather.sunset.split(':');
  const sunsetHour = parseInt(sunsetTime[0]);

  const chartData = weather.hourlyForecast.map((hour) => ({
    time: hour.hour,
    timeDisplay: hour.hour,
    temperature: hour.temperature,
    rain: hour.chanceOfRain,
    wind: hour.windSpeed || 10,
    humidity: hour.humidity || 50,
  }));

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "#F59E0B",
    },
    rain: {
      label: "Rain (%)",
      color: "#3B82F6",
    },
    wind: {
      label: "Wind (km/h)",
      color: "#10B981",
    },
    humidity: {
      label: "Humidity (%)",
      color: "#8B5CF6",
    },
  };

  const activeLines = [
    { key: 'temperature', show: showTemperature, color: '#F59E0B', strokeWidth: 3 },
    { key: 'rain', show: showRain, color: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' },
    { key: 'wind', show: showWind, color: '#10B981', strokeWidth: 2 },
    { key: 'humidity', show: showHumidity, color: '#8B5CF6', strokeWidth: 2, strokeDasharray: '3 3' },
  ];

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-2xl font-bold text-white">Weather Trends</h2>
        
        <ChartToggleControls
          showTemperature={showTemperature}
          setShowTemperature={setShowTemperature}
          showRain={showRain}
          setShowRain={setShowRain}
          showWind={showWind}
          setShowWind={setShowWind}
          showHumidity={showHumidity}
          setShowHumidity={setShowHumidity}
          showSunriseSunset={showSunriseSunset}
          setShowSunriseSunset={setShowSunriseSunset}
        />
      </div>
      
      <WeatherChartCore
        chartData={chartData}
        chartConfig={chartConfig}
        activeLines={activeLines}
        sunriseHour={sunriseHour}
        sunsetHour={sunsetHour}
        showSunriseSunset={showSunriseSunset}
      />
      
      <ChartLegend
        showTemperature={showTemperature}
        showRain={showRain}
        showWind={showWind}
        showHumidity={showHumidity}
        showSunriseSunset={showSunriseSunset}
        weather={weather}
      />
    </div>
  );
};

export default WeatherChart;
