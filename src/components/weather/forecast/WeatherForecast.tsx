import React, { useRef } from 'react';
import { getWeatherIcon } from '@/utils/weatherUtils';
import type { HourlyForecast, DailyForecast } from '@/types/weather';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scrollDirection, setScrollDirection] = React.useState<'left' | 'right' | null>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (direction: 'left' | 'right') => {
    setIsScrolling(true);
    setScrollDirection(direction);
    scrollInterval.current = setInterval(() => {
      if (scrollRef.current) {
        const scrollAmount = direction === 'left' ? -2 : 2;
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }, 16);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
    setScrollDirection(null);
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto scrollbar-hide"
      >
        {showHourly ? (
          hourlyForecast.map((hour, index) => (
            <div key={index} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center min-w-[80px]">
              <div className="text-xs opacity-80">{hour.hour}</div>
              {getWeatherIcon(hour.condition, "w-8 h-8 mx-auto my-2")}
              <div className="font-semibold">{hour.temperature}°</div>
              {hour.chanceOfRain > 0 && (
                <div className="text-xs opacity-70 mt-1">{hour.chanceOfRain}%</div>
              )}
            </div>
          ))
        ) : (
          dailyForecast.map((day, index) => (
            <div key={index} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-xs opacity-80">{day.day}</div>
              {getWeatherIcon(day.condition, "w-8 h-8 mx-auto my-2")}
              <div className="font-semibold">{day.high}°</div>
              <div className="text-sm opacity-70">{day.low}°</div>
              {day.chanceOfRain > 0 && (
                <div className="text-xs opacity-70 mt-1">{day.chanceOfRain}%</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Scroll indicators */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent ${isScrolling && scrollDirection === 'left' ? 'opacity-50' : 'opacity-0'} transition-opacity`}
        onMouseEnter={() => handleMouseEnter('left')}
        onMouseLeave={handleMouseLeave}
      />
      <div 
        className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent ${isScrolling && scrollDirection === 'right' ? 'opacity-50' : 'opacity-0'} transition-opacity`}
        onMouseEnter={() => handleMouseEnter('right')}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default WeatherForecast; 