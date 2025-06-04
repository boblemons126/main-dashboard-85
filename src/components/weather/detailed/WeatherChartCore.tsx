import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';

interface WeatherChartCoreProps {
  chartData: Array<{
    time: string;
    timeDisplay: string;
    temperature: number;
    rain: number;
    wind: number;
    humidity: number;
  }>;
  chartConfig: Record<string, { label: string; color: string }>;
  activeLines: Array<{
    key: string;
    show: boolean;
    color: string;
    strokeWidth: number;
    strokeDasharray?: string;
  }>;
  sunriseHour: number;
  sunsetHour: number;
  showSunriseSunset: boolean;
}

const WeatherChartCore: React.FC<WeatherChartCoreProps> = ({
  chartData,
  chartConfig,
  activeLines,
  sunriseHour,
  sunsetHour,
  showSunriseSunset,
}) => {
  return (
    <div className="h-80 w-full [&_.recharts-cartesian-axis-tick_text]:!fill-white">
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
              stroke="rgba(255,255,255,0.2)" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="time" 
              stroke="#FFFFFF"
              fontSize={13}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#FFFFFF', style: { color: '#FFFFFF' } }}
              dy={8}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              stroke="#FFFFFF"
              fontSize={13}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#FFFFFF', style: { color: '#FFFFFF' } }}
              dx={-8}
              domain={['dataMin - 5', 'dataMax + 5']}
              padding={{ top: 10, bottom: 10 }}
            />
            
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                padding: '12px 16px',
                fontSize: '13px'
              }}
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
                  position: "top",
                  style: { 
                    fill: '#FFC107', 
                    fontSize: '13px'
                  }
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
                  position: "top",
                  style: { 
                    fill: '#FF6B35', 
                    fontSize: '13px'
                  }
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
  );
};

export default WeatherChartCore;
