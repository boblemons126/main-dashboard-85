
import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { getWeatherIcon } from '../../../utils/weatherUtils';
import { WeatherData } from '../../../types/weather';

interface WeatherForecastDetailedProps {
  weather: WeatherData;
  showHourly: boolean;
  onToggle: (showHourly: boolean) => void;
}

const WeatherForecastDetailed: React.FC<WeatherForecastDetailedProps> = ({ 
  weather, 
  showHourly, 
  onToggle 
}) => {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          {showHourly ? 'Hourly' : 'Daily'} Forecast
        </h2>
        
        {/* Toggle Buttons */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button 
            onClick={() => onToggle(true)} 
            className={`flex items-center space-x-2 px-4 py-2 rounded text-sm transition-colors ${
              showHourly 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Hourly</span>
          </button>
          <button 
            onClick={() => onToggle(false)} 
            className={`flex items-center space-x-2 px-4 py-2 rounded text-sm transition-colors ${
              !showHourly 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily</span>
          </button>
        </div>
      </div>

      {/* Forecast Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {showHourly 
          ? weather.hourlyForecast.slice(0, 8).map((hour, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-white/80 text-sm font-medium mb-3">{hour.hour}</div>
                  <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getWeatherIcon(hour.condition, "w-8 h-8")}
                  </div>
                  <div className="text-xl font-bold text-white mb-2">{hour.temperature}°</div>
                  <div className="text-sm text-white/70 mb-2 capitalize">{hour.condition.toLowerCase()}</div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-white/70">{hour.chanceOfRain}%</span>
                  </div>
                </div>
              </div>
            ))
          : weather.dailyForecast.slice(0, 7).map((day, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-white/80 text-sm font-medium mb-3">{day.day}</div>
                  <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getWeatherIcon(day.condition, "w-8 h-8")}
                  </div>
                  <div className="flex justify-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-white">{day.high}°</span>
                    <span className="text-lg text-white/60">{day.low}°</span>
                  </div>
                  <div className="text-sm text-white/70 mb-2 capitalize">{day.description}</div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-white/70">{day.chanceOfRain}%</span>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default WeatherForecastDetailed;
