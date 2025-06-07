
import React from 'react';
import { MapPin, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/contexts/LocationContext';

const CustomLocationsList: React.FC = () => {
  const { customLocations, removeCustomLocation, selectedLocationId, setSelectedLocationId } = useLocationContext();

  if (customLocations.length === 0) {
    return (
      <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
        <MapPin className="w-8 h-8 mx-auto text-gray-500 mb-3" />
        <p className="text-sm text-gray-300 font-medium mb-1">No custom locations added</p>
        <p className="text-xs text-gray-500">Search and add locations above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400 mb-3">
        {customLocations.length} custom location{customLocations.length !== 1 ? 's' : ''} saved
      </div>
      {customLocations.map((location) => (
        <div 
          key={location.id} 
          className={`group flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${
            selectedLocationId === location.id 
              ? 'bg-blue-500/20 border-blue-400/40 shadow-blue-500/20' 
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div 
            className="flex items-center space-x-3 flex-1 cursor-pointer"
            onClick={() => setSelectedLocationId(selectedLocationId === location.id ? null : location.id)}
          >
            <div className="relative">
              <MapPin className={`w-5 h-5 transition-colors ${
                selectedLocationId === location.id ? 'text-blue-400' : 'text-gray-400'
              }`} />
              {selectedLocationId === location.id && (
                <Star className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-medium transition-colors ${
                selectedLocationId === location.id ? 'text-blue-200' : 'text-white'
              }`}>
                {location.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </div>
            </div>
            {selectedLocationId === location.id && (
              <div className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
                Active
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              removeCustomLocation(location.id);
            }}
            className="text-red-400 hover:bg-red-400/10 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomLocationsList;
