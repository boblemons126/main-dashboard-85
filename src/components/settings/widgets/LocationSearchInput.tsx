
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
  matchScore?: number;
}

const LocationSearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { addCustomLocation } = useLocationContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLocationSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Instant search with minimal debouncing for API calls
  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
        return;
      }

      if (trimmedQuery.length < 2) {
        setShowSuggestions(true);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await searchLocations(trimmedQuery, 10);
        setSuggestions(results);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setIsSearching(false);
      }
    };

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only add minimal delay for API calls (150ms)
    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(performSearch, 150);
    } else {
      performSearch();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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

    const totalSuggestions = suggestions.length + (searchQuery.length === 0 && recentSearches.length > 0 ? recentSearches.length : 0);
    
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
    // Only allow towns and cities (filter out counties, postcodes, districts)
    if (location.type !== 'town' && location.type !== 'city') {
      return;
    }

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

  const canSelectLocation = (location: LocationResult) => {
    return location.type === 'town' || location.type === 'city';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Add Towns & Cities</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Search for UK towns and cities by name, partial name, or postcode. Only towns and cities can be added to your weather locations.
        </p>
      </div>
      
      <div className="relative">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search className={`w-5 h-5 transition-colors duration-200 ${
              isSearching ? 'text-blue-400 animate-pulse' : 'text-gray-400 group-focus-within:text-blue-400'
            }`} />
          </div>
          <Input
            ref={searchInputRef}
            placeholder="Try 'Falmouth', 'Cornwall Falmouth', 'SW11 2AA', or 'Manchester'..."
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
                      <span>Search results for "{searchQuery}" (Towns & Cities only)</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {suggestions.map((location, index) => {
                        const canSelect = canSelectLocation(location);
                        return (
                          <button
                            key={`${location.latitude}-${location.longitude}-${index}`}
                            className={`w-full p-3 text-left transition-all duration-150 
                                     rounded-lg group relative ${
                                     selectedIndex === index ? 'bg-slate-700/60 ring-1 ring-blue-500/30' : ''
                                   } ${
                                     canSelect 
                                       ? 'hover:bg-slate-700/60 cursor-pointer' 
                                       : 'opacity-50 cursor-not-allowed hover:bg-slate-700/30'
                                   }`}
                            onClick={() => canSelect && handleSelectLocation(location)}
                            disabled={!canSelect}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <span className="text-xl">{getLocationTypeIcon(location.type)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm transition-colors ${
                                  canSelect 
                                    ? 'text-white group-hover:text-blue-200' 
                                    : 'text-gray-400'
                                }`}>
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
                                  {!canSelect && (
                                    <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                      Not available
                                    </span>
                                  )}
                                </div>
                              </div>
                              {canSelect && (
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Plus className="w-5 h-5 text-green-400" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : searchQuery.trim().length >= 2 && !isSearching ? (
                  <div className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-3 text-gray-400">
                      <MapPin className="w-8 h-8" />
                      <div className="text-sm font-medium">No towns or cities found</div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        Try searching for a different town, city, or postcode in the UK
                      </div>
                    </div>
                  </div>
                ) : searchQuery.trim().length >= 2 && isSearching ? (
                  <div className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-3 text-gray-400">
                      <Search className="w-8 h-8 animate-pulse" />
                      <div className="text-sm font-medium">Searching...</div>
                    </div>
                  </div>
                ) : null}
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
