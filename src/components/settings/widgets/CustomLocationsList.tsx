
import React from 'react';
import { MapPin, Trash2, Star, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/contexts/LocationContext';

const CustomLocationsList: React.FC = () => {
  const { customLocations, removeCustomLocation, selectedLocationId, setSelectedLocationId } = useLocationContext();

  if (customLocations.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-600/40 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
            <Navigation2 className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className="text-base text-gray-300 font-medium">No custom locations saved</p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              Add locations using the search above to access weather for multiple places
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Navigation2 className="w-4 h-4" />
          <span className="font-medium">
            {customLocations.length} saved location{customLocations.length !== 1 ? 's' : ''}
          </span>
        </div>
        {selectedLocationId && (
          <div className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30 font-medium">
            Using custom location
          </div>
        )}
      </div>
      
      <div className="grid gap-3">
        {customLocations.map((location) => (
          <div 
            key={location.id} 
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 
                     hover:shadow-xl hover:shadow-black/20 cursor-pointer transform hover:-translate-y-0.5 ${
              selectedLocationId === location.id 
                ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/60 shadow-blue-500/20 shadow-lg' 
                : 'bg-slate-800/50 border-slate-600/40 hover:bg-slate-800/70 hover:border-slate-500/60'
            }`}
            onClick={() => setSelectedLocationId(selectedLocationId === location.id ? null : location.id)}
          >
            {/* Background decoration for active location */}
            {selectedLocationId === location.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
            )}
            
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      selectedLocationId === location.id 
                        ? 'bg-blue-500/20 border-blue-400/60' 
                        : 'bg-slate-700/60 border-slate-600/40 group-hover:border-slate-500/60'
                    }`}>
                      <MapPin className={`w-5 h-5 transition-colors ${
                        selectedLocationId === location.id ? 'text-blue-300' : 'text-gray-400 group-hover:text-gray-300'
                      }`} />
                    </div>
                    {selectedLocationId === location.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-yellow-900 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-base transition-colors truncate ${
                      selectedLocationId === location.id ? 'text-blue-100' : 'text-white group-hover:text-blue-200'
                    }`}>
                      {location.name}
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">Coordinates:</span>
                        <span className="bg-slate-700/60 border border-slate-600/40 px-2.5 py-1 rounded-md font-mono">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </span>
                      </div>
                      {location.postcode && (
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-400">Postcode:</span>
                          <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-md font-semibold">
                            {location.postcode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {selectedLocationId === location.id && (
                    <div className="text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full border border-green-500/30 font-medium whitespace-nowrap">
                      Active
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomLocation(location.id);
                    }}
                    className="text-red-400 hover:bg-red-400/15 hover:text-red-300 opacity-0 group-hover:opacity-100 
                             transition-all duration-200 h-9 w-9 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomLocationsList;
