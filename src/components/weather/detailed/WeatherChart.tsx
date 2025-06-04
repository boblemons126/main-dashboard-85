
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { WeatherData } from '../../../types/weather';
import { Toggle } from '../../ui/toggle';
import { Sunrise, Sunset, Wind, Droplets, Thermometer, Cloud } from 'lucide-react';

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
  const sunsetHour = new Date(weather.sunset * 1000).getHours();

  const chartData = weather.hourlyForecast.map((hour) => ({
    time: hour.hour,
    timeDisplay: `${hour.hour}:00`,
    temperature: hour.temperature,
    rain: hour.chanceOfRain,
    wind: hour.windSpeed || 10, // Fallback if not available
    humidity: hour.humidity || 50, // Fallback if not available
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
        
        {/* Toggle Controls */}
        <div className="flex flex-wrap gap-3">
          <Toggle
            pressed={showTemperature}
            onPressedChange={setShowTemperature}
            className="data-[state=on]:bg-amber-500/30 data-[state=on]:text-amber-100 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Thermometer className="w-4 h-4 mr-2" />
            Temp
          </Toggle>
          
          <Toggle
            pressed={showRain}
            onPressedChange={setShowRain}
            className="data-[state=on]:bg-blue-500/30 data-[state=on]:text-blue-100 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Cloud className="w-4 h-4 mr-2" />
            Rain
          </Toggle>
          
          <Toggle
            pressed={showWind}
            onPressedChange={setShowWind}
            className="data-[state=on]:bg-emerald-500/30 data-[state=on]:text-emerald-100 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Wind className="w-4 h-4 mr-2" />
            Wind
          </Toggle>
          
          <Toggle
            pressed={showHumidity}
            onPressedChange={setShowHumidity}
            className="data-[state=on]:bg-purple-500/30 data-[state=on]:text-purple-100 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Humidity
          </Toggle>
          
          <Toggle
            pressed={showSunriseSunset}
            onPressedChange={setShowSunriseSunset}
            className="data-[state=on]:bg-orange-500/30 data-[state=on]:text-orange-100 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Sunrise className="w-4 h-4 mr-2" />
            Sun
          </Toggle>
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.15)" 
                vertical={false}
              />
              
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.8)"
                fontSize={12}
                tickFormatter={(value) => `${value}:00`}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis 
                stroke="rgba(255,255,255,0.8)"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              
              <ChartTooltip 
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
                labelFormatter={(value) => `${value}:00`}
              />
              
              {/* Sunrise Reference Line */}
              {showSunriseSunset && (
                <ReferenceLine 
                  x={sunriseHour} 
                  stroke="#FFC107" 
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{ 
                    value: "Sunrise", 
                    position: "topLeft",
                    style: { fill: '#FFC107', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
              )}
              
              {/* Sunset Reference Line */}
              {showSunriseSunset && (
                <ReferenceLine 
                  x={sunsetHour} 
                  stroke="#FF6B35" 
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{ 
                    value: "Sunset", 
                    position: "topRight",
                    style: { fill: '#FF6B35', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
              )}
              
              {/* Data Lines */}
              {activeLines.map((line) => line.show && (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  strokeDasharray={line.strokeDasharray}
                  dot={{ 
                    fill: line.color, 
                    strokeWidth: 2, 
                    r: line.key === 'temperature' ? 5 : 3,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }
                  }}
                  activeDot={{ 
                    r: 7, 
                    stroke: line.color, 
                    strokeWidth: 3,
                    fill: 'white',
                    style: { filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {/* Enhanced Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        {showTemperature && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-amber-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90 font-medium">Temperature (°C)</span>
          </div>
        )}
        {showRain && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-blue-400 rounded-full border-2 border-dashed border-blue-400 shadow-sm"></div>
            <span className="text-sm text-white/90 font-medium">Rain Chance (%)</span>
          </div>
        )}
        {showWind && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-emerald-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90 font-medium">Wind Speed (km/h)</span>
          </div>
        )}
        {showHumidity && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-purple-400 rounded-full border-2 border-dashed border-purple-400 shadow-sm"></div>
            <span className="text-sm text-white/90 font-medium">Humidity (%)</span>
          </div>
        )}
        {showSunriseSunset && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sunrise className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/90 font-medium">
                {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/90 font-medium">
                {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherChart;
