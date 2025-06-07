import React from 'react';
import { Droplets, Wind, Sun } from 'lucide-react';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  windDirection: string;
  sunset: string;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ 
  humidity, 
  windSpeed, 
  windDirection, 
  sunset 
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
        <Droplets className="w-5 h-5 mx-auto mb-1" />
        <div className="text-xs opacity-80">Humidity</div>
        <div className="font-semibold my-[8px]">{humidity}%</div>
      </div>
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
        <Wind className="w-5 h-5 mx-auto mb-1" />
        <div className="text-xs opacity-80">Wind</div>
        <div className="font-semibold my-[8px]">{windSpeed} mph</div>
        <div className="text-xs opacity-70 -mt-1">{windDirection}</div>
      </div>
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
        <Sun className="w-5 h-5 mx-auto mb-1" />
        <div className="text-xs opacity-80">Sunset</div>
        <div className="font-semibold my-[8px]">{sunset}</div>
      </div>
    </div>
  );
};

export default WeatherDetails; 