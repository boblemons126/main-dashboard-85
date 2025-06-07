import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchLocationsEnhanced } from '@/services/locationSearchService';
import { useLocationContext } from '@/contexts/LocationContext';

interface LocationResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  type: 'city' | 'town' | 'postcode' | 'county';
  postcode?: string;
  city?: string;
  county?: string;
  countryCode?: string;
}

interface LocationSearchInputProps {
  onLocationAdded?: () => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ onLocationAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const { addCustomLocation } = useLocationContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  // Instant search with no delay
  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setShowSuggestions(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      try {
        const results = await searchLocationsEnhanced(trimmedQuery, userLocation, 8);
        setSuggestions(results);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    };

    performSearch();

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, userLocation]);

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
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLocationName = (location: LocationResult) => {
    const parts: string[] = [];
    if (location.name) {
      parts.push(location.name.split(',')[0].trim());
    }

    if (location.county && location.county.toLowerCase() !== 'england') {
      parts.push(location.county);
    } else if (location.state) {
      parts.push(location.state);
    }
    
    const uniqueParts = parts.filter((part, index, self) => 
        self.findIndex(p => p.toLowerCase() === part.toLowerCase()) === index
    );

    let locationString = uniqueParts.join(', ');

    if (location.countryCode) {
      return `${locationString} ${location.countryCode.toUpperCase()}`;
    }
    return locationString;
  };

  const handleSelectLocation = (location: LocationResult) => {
    addCustomLocation({
      name: formatLocationName(location),
      latitude: location.latitude,
      longitude: location.longitude,
      postcode: location.postcode || 'N/A'
    });
    
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsFocused(false);
    onLocationAdded?.();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? 
          <span key={index} className="bg-blue-400/30 text-blue-200 font-medium">{part}</span> : 
          part
      );
    } catch {
      return text;
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'postcode': return '📮';
      case 'city': return '🏙️';
      case 'town': return '🏘️';
      case 'county': return '🗺️';
      default: return '📍';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          ref={searchInputRef}
          placeholder="Type a town, city, county, or postcode (e.g. 'falm', 'TR1')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (searchQuery.trim().length >= 2) {
              setShowSuggestions(true);
            }
          }}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-4"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      
      {/* Live Suggestions Dropdown */}
      {showSuggestions && isFocused && searchQuery.trim().length >= 2 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-slate-800/98 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl max-h-80 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            suggestions.map((location, index) => (
              <div
                key={`${location.latitude}-${location.longitude}-${index}`}
                className="p-3 text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0 transition-all duration-150 hover:shadow-lg group"
                onClick={() => handleSelectLocation(location)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">{getLocationTypeIcon(location.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm group-hover:text-blue-200 transition-colors">
                      {highlightMatch(formatLocationName(location), searchQuery)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                      <span className="capitalize bg-white/10 px-2 py-0.5 rounded text-xs">
                        {location.type}
                      </span>
                      <span>•</span>
                      <span>Postcode: {location.postcode || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-white/70 text-center text-sm">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>No locations found for "{searchQuery}"</span>
              </div>
              <div className="text-xs text-gray-500">
                Try a different spelling or search for a nearby town
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
