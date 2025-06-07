
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchLocations } from '@/services/locationSearchService';
import { useLocationContext } from '@/contexts/LocationContext';

interface LocationResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  type: 'city' | 'town' | 'postcode' | 'county';
  postcode?: string;
}

const LocationSearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { addCustomLocation } = useLocationContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setShowSuggestions(true);

      try {
        const results = await searchLocations(trimmedQuery, 6);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(performSearch, 150);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectLocation = (location: LocationResult) => {
    addCustomLocation({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      postcode: location.postcode || undefined
    });
    
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  const getLocationTypeIcon = (type: string) => {
    const iconMap = {
      postcode: '📮',
      city: '🏙️',
      town: '🏘️',
      county: '🗺️'
    };
    return iconMap[type as keyof typeof iconMap] || '📍';
  };

  const getLocationTypeBadge = (type: string) => {
    const colorMap = {
      postcode: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      city: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      town: 'bg-green-500/20 text-green-300 border-green-500/30',
      county: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white text-sm font-medium block mb-2">
          Add Custom Location
        </label>
        <p className="text-gray-300 text-xs mb-3">
          Search for a location by postcode, town, city, or county
        </p>
      </div>
      
      <div className="relative">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <Input
            ref={searchInputRef}
            placeholder="Search locations (e.g. 'London', 'SW1A 1AA', 'Cornwall')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-400 pl-10 pr-10 h-11 
                     focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                     hover:border-slate-500/60"
            autoComplete="off"
            spellCheck={false}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim().length >= 2 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 
                     rounded-lg shadow-2xl shadow-black/40 max-h-80 overflow-y-auto animate-fade-in"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((location, index) => (
                  <button
                    key={`${location.latitude}-${location.longitude}-${index}`}
                    className={`w-full p-3 text-left hover:bg-slate-700/60 transition-all duration-150 
                             border-b border-slate-700/40 last:border-b-0 group ${
                             selectedIndex === index ? 'bg-slate-700/60' : ''
                           }`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-lg">{getLocationTypeIcon(location.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm group-hover:text-blue-200 transition-colors">
                          {location.name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs border ${getLocationTypeBadge(location.type)}`}>
                            {location.type}
                          </span>
                          {location.postcode && (
                            <span className="text-xs text-gray-400">
                              {location.postcode}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2 text-gray-400">
                  <MapPin className="w-6 h-6" />
                  <div className="text-sm font-medium">No locations found</div>
                  <div className="text-xs text-gray-500">
                    Try a different search term or check your spelling
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearchInput;
