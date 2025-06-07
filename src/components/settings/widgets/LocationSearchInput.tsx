
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Search, X, Navigation, Clock } from 'lucide-react';
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
  type: 'city' | 'town' | 'postcode' | 'county' | 'district';
  postcode?: string;
  importance?: number;
}

const LocationSearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { addCustomLocation } = useLocationContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLocationSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Instant search - no debouncing
  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const results = await searchLocations(trimmedQuery, 8);
        setSuggestions(results);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(true);
      }
    };

    performSearch();
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
    if (!showSuggestions) return;

    const totalSuggestions = suggestions.length + (searchQuery.length > 0 && recentSearches.length > 0 ? recentSearches.length : 0);
    
    if (totalSuggestions === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalSuggestions);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalSuggestions - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSelectLocation(suggestions[selectedIndex]);
          } else {
            const recentIndex = selectedIndex - suggestions.length;
            setSearchQuery(recentSearches[recentIndex]);
          }
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
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentLocationSearches', JSON.stringify(updated));
    
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
      county: '🗺️',
      district: '🏘️'
    };
    return iconMap[type as keyof typeof iconMap] || '📍';
  };

  const getLocationTypeBadge = (type: string) => {
    const colorMap = {
      postcode: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      city: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      town: 'bg-green-500/15 text-green-300 border-green-500/30',
      county: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      district: 'bg-teal-500/15 text-teal-300 border-teal-500/30'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500/15 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Add Custom Location</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Search for any UK location by postcode, town, city, or county. Results appear instantly as you type.
        </p>
      </div>
      
      <div className="relative">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
          </div>
          <Input
            ref={searchInputRef}
            placeholder="Try 'SW1A 1AA', 'London', 'Cornwall', or 'Manchester'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim().length > 0 || recentSearches.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="bg-slate-800/80 border-slate-600/50 text-white placeholder:text-gray-400 pl-12 pr-12 h-14 
                     focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                     hover:border-slate-500/50 hover:bg-slate-800/90 text-base rounded-xl shadow-lg
                     backdrop-blur-sm"
            autoComplete="off"
            spellCheck={false}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white 
                       transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Enhanced Suggestions Dropdown */}
        {showSuggestions && (searchQuery.trim().length > 0 || recentSearches.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-3 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 
                     rounded-xl shadow-2xl shadow-black/40 max-h-96 overflow-hidden animate-fade-in"
          >
            {/* Search Results */}
            {searchQuery.trim().length > 0 && (
              <>
                {suggestions.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-3 py-2 flex items-center space-x-2">
                      <Search className="w-3 h-3" />
                      <span>Search results for "{searchQuery}"</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {suggestions.map((location, index) => (
                        <button
                          key={`${location.latitude}-${location.longitude}-${index}`}
                          className={`w-full p-3 text-left hover:bg-slate-700/60 transition-all duration-150 
                                   rounded-lg group relative ${
                                   selectedIndex === index ? 'bg-slate-700/60 ring-1 ring-blue-500/30' : ''
                                 }`}
                          onClick={() => handleSelectLocation(location)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-xl">{getLocationTypeIcon(location.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white text-sm group-hover:text-blue-200 transition-colors">
                                {location.name}
                              </div>
                              <div className="flex items-center space-x-2 mt-1.5">
                                <span className={`px-2.5 py-1 rounded-md text-xs border font-medium ${getLocationTypeBadge(location.type)}`}>
                                  {location.type}
                                </span>
                                {location.postcode && (
                                  <span className="text-xs text-gray-400 bg-slate-700/40 px-2 py-1 rounded border border-slate-600/30">
                                    {location.postcode}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-5 h-5 text-green-400" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-3 text-gray-400">
                      <MapPin className="w-8 h-8" />
                      <div className="text-sm font-medium">No locations found</div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        Try searching for a postcode (e.g., SW1A 1AA), town, city, or county in the UK
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Recent Searches */}
            {searchQuery.trim().length === 0 && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-400 px-3 py-2 flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Recent searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className={`w-full p-3 text-left hover:bg-slate-700/60 transition-all duration-150 
                               rounded-lg group ${
                               selectedIndex === suggestions.length + index ? 'bg-slate-700/60 ring-1 ring-blue-500/30' : ''
                             }`}
                      onClick={() => setSearchQuery(search)}
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">{search}</span>
                      </div>
                    </button>
                  ))}
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
