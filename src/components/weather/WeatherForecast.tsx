
import React, { useRef } from 'react';
import { getWeatherIcon } from '../../utils/weatherUtils';
import type { HourlyForecast, DailyForecast } from '../../types/weather';

interface WeatherForecastProps {
  showHourly: boolean;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  showHourly, 
  hourlyForecast, 
  dailyForecast 
}) => {
  const forecastScrollRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (direction: 'left' | 'right') => {
    if (forecastScrollRef.current) {
      const scrollAmount = direction === 'left' ? -10 : 10;
      const interval = setInterval(() => {
        if (forecastScrollRef.current) {
          forecastScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 16);
      
      forecastScrollRef.current.dataset.scrollInterval = interval.toString();
    }
  };

  const handleMouseLeave = () => {
    if (forecastScrollRef.current?.dataset.scrollInterval) {
      clearInterval(parseInt(forecastScrollRef.current.dataset.scrollInterval));
      delete forecastScrollRef.current.dataset.scrollInterval;
    }
  };

  return (
    <div className="relative">
      <div 
        ref={forecastScrollRef} 
        className="flex space-x-3 pb-2 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {showHourly 
          ? hourlyForecast.slice(0, 8).map((hour, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px] flex-shrink-0">
                <div className="text-xs opacity-80 mb-1">{hour.hour}</div>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(hour.condition, "w-5 h-5")}
                </div>
                <div className="text-sm font-semibold mb-1">{hour.temperature}°</div>
                <div className="text-xs opacity-70">{hour.chanceOfRain}%</div>
              </div>
            ))
          : dailyForecast.slice(0, 7).map((day, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px] flex-shrink-0">
                <div className="text-xs opacity-80 mb-1">{day.day}</div>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(day.condition, "w-5 h-5")}
                </div>
                <div className="text-xs">
                  <div className="font-semibold">{day.high}°</div>
                  <div className="opacity-70">{day.low}°</div>
                </div>
                <div className="text-xs opacity-70 mt-1">{day.chanceOfRain}%</div>
              </div>
            ))
        }
      </div>
      
      {/* Hover zones for auto-scroll */}
      <div 
        className="absolute left-0 top-0 h-full w-6 z-20 cursor-w-resize"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)' }}
        onMouseEnter={() => handleMouseEnter('left')}
        onMouseLeave={handleMouseLeave}
      />
      <div 
        className="absolute right-0 top-0 h-full w-6 z-20 cursor-e-resize"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.08), transparent)' }}
        onMouseEnter={() => handleMouseEnter('right')}
        onMouseLeave={handleMouseLeave}
      />
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default WeatherForecast;
