
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
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
  onLocationChange: (locationId: string | null) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ 
  currentLocation, 
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
        <SelectTrigger className="bg-transparent border-none p-0 h-auto text-white hover:bg-white/10 rounded">
          <div className="flex items-center space-x-1">
            <SelectValue>
              <span className="font-semibold text-base">{getDisplayValue()}</span>
            </SelectValue>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          <SelectItem value="current" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Current Location</span>
            </div>
          </SelectItem>
          {customLocations.map((location) => (
            <SelectItem key={location.id} value={location.id} className="cursor-pointer">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{location.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationDropdown;
