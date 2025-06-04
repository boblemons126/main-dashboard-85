
import React from 'react';
import { getWeatherIcon } from '../../../utils/weatherUtils';
import { WeatherData } from '../../../types/weather';
import WeatherHeader from '../WeatherHeader';

interface WeatherHeroProps {
  weather: WeatherData;
  onLocationChange: (locationId: string | null) => void;
}

const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, onLocationChange }) => {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <WeatherHeader 
          location={weather.location}
          county={weather.county}
          onRefresh={() => {}}
          onLocationChange={onLocationChange}
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between mt-8">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            {getWeatherIcon(weather.condition, "w-24 h-24")}
            <div>
              <div className="text-7xl font-bold text-white mb-2">{weather.temperature}°</div>
              <div className="text-xl text-white/90 capitalize mb-1">{weather.description}</div>
              <div className="text-lg text-white/80">Feels like {weather.feelsLike}°</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-sm text-white/70 uppercase tracking-wider mb-1">Current Time</div>
            <div className="text-2xl font-semibold text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-white/80 mt-2">
              {new Date().toLocaleDateString([], { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHero;
