import React from 'react';
import { RefreshCw } from 'lucide-react';
import LocationDropdown from './LocationDropdown';

interface WeatherHeaderProps {
  location: string;
  county: string;
  onRefresh: () => void;
  onLocationChange: (locationId: string | null) => void;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ 
  location, 
  county, 
  onRefresh, 
  onLocationChange 
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1">
        <LocationDropdown 
          currentLocation={location}
          currentCounty={county}
          onLocationChange={onLocationChange}
        />
      </div>
      <button 
        onClick={onRefresh} 
        className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-4" 
        title="Refresh weather data"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WeatherHeader;
