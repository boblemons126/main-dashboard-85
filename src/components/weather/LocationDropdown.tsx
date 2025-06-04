import React from 'react';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocationContext } from '../../contexts/LocationContext';

interface LocationDropdownProps {
  currentLocation: string;
  currentCounty: string | null;
  onLocationChange: (locationId: string | null) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ 
  currentLocation, 
  currentCounty, 
  onLocationChange 
}) => {
  const { customLocations, selectedLocationId } = useLocationContext();

  const handleValueChange = (value: string) => {
    if (value === 'current') {
      onLocationChange(null);
    } else {
      onLocationChange(value);
    }
  };

  const getDisplayValue = () => {
    if (selectedLocationId) {
      const customLocation = customLocations.find(loc => loc.id === selectedLocationId);
      return customLocation?.name || currentLocation;
    }
    return currentLocation;
  };

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="w-4 h-4 flex-shrink-0" />
      <Select 
        value={selectedLocationId || 'current'} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="bg-transparent border-none p-0 h-auto text-white hover:bg-white/10 rounded w-fit">
          <div className="flex flex-col items-start">
            <SelectValue>
              <div>
              <span className="font-semibold text-base leading-tight">{getDisplayValue()}</span>
                {currentCounty && !selectedLocationId && (
                  <span className="text-sm opacity-70 ml-1">{currentCounty}</span>
                )}
              </div>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg">
          <SelectItem value="current" className="cursor-pointer hover:bg-white/20">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
              <div>
                <span className="font-medium">{currentLocation}</span>
                {currentCounty && (
                  <span className="text-sm text-gray-600 ml-1">{currentCounty}</span>
                )}
              </div>
            </div>
          </SelectItem>
          {customLocations.map((location) => (
            <SelectItem key={location.id} value={location.id} className="cursor-pointer hover:bg-white/20">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{location.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationDropdown;
