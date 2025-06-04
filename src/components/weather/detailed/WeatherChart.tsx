
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { WeatherData } from '../../../types/weather';

interface WeatherChartProps {
  weather: WeatherData;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weather }) => {
  const chartData = weather.hourlyForecast.map((hour) => ({
    time: hour.hour,
    temperature: hour.temperature,
    rain: hour.chanceOfRain,
  }));

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "#3B82F6",
    },
    rain: {
      label: "Rain (%)",
      color: "#06B6D4",
    },
  };

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Temperature Trend</h2>
      
      <div className="h-64 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="rain" 
                stroke="#06B6D4" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-blue-400 rounded"></div>
          <span className="text-sm text-white/80">Temperature</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-cyan-400 rounded border border-dashed border-cyan-400"></div>
          <span className="text-sm text-white/80">Rain Chance</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
