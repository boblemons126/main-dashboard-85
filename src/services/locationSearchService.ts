
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

const OPENWEATHER_API_KEY = '31fcb172502b94e6534cc6bc72352259';

// Cache for instant results
const searchCache = new Map<string, { results: LocationResult[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const searchLocations = async (query: string, limit = 8): Promise<LocationResult[]> => {
  if (!query || query.trim().length < 1) return [];

  const cleanQuery = query.trim();
  const cacheKey = `${cleanQuery}-${limit}`;
  
  // Check cache first for instant results
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    // Use Nominatim as primary for better UK support
    const nominatimResults = await searchWithNominatim(cleanQuery, limit);
    
    // If Nominatim gives good results, use them
    if (nominatimResults.length > 0) {
      searchCache.set(cacheKey, { results: nominatimResults, timestamp: Date.now() });
      return nominatimResults;
    }
    
    // Fallback to OpenWeather
    const openWeatherResults = await searchWithOpenWeather(cleanQuery, limit);
    searchCache.set(cacheKey, { results: openWeatherResults, timestamp: Date.now() });
    return openWeatherResults;
    
  } catch (error) {
    console.error('Location search error:', error);
    
    // Return cached results if available
    if (cached) {
      return cached.results;
    }
    
    return [];
  }
};

const searchWithNominatim = async (query: string, limit: number): Promise<LocationResult[]> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=${limit}&countrycodes=gb&addressdetails=1&extratags=1`
  );
  
  if (!response.ok) {
    throw new Error('Nominatim search failed');
  }
  
  const data = await response.json();
  
  return data.map((item: any) => ({
    name: formatNominatimName(item),
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    country: 'GB',
    state: item.address?.county || item.address?.state,
    type: determineNominatimType(item),
    postcode: item.address?.postcode,
    importance: item.importance || 0
  })).sort((a: LocationResult, b: LocationResult) => (b.importance || 0) - (a.importance || 0));
};

const searchWithOpenWeather = async (query: string, limit: number): Promise<LocationResult[]> => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('OpenWeather search failed');
  }
  
  const data = await response.json();
  
  return data.map((item: any) => ({
    name: formatOpenWeatherName(item),
    latitude: item.lat,
    longitude: item.lon,
    country: item.country,
    state: item.state,
    type: determineOpenWeatherType(item, query),
    postcode: undefined
  }));
};

const formatNominatimName = (item: any): string => {
  const address = item.address || {};
  const parts = [];
  
  // Handle different place types
  if (address.postcode && isPostcodeQuery(item.display_name)) {
    return `${address.postcode}, ${address.town || address.city || address.village || address.hamlet}`;
  }
  
  if (address.town) parts.push(address.town);
  else if (address.city) parts.push(address.city);
  else if (address.village) parts.push(address.village);
  else if (address.hamlet) parts.push(address.hamlet);
  
  if (address.county && address.county !== parts[0]) {
    parts.push(address.county);
  }
  
  return parts.join(', ') || item.display_name.split(',')[0];
};

const formatOpenWeatherName = (item: any): string => {
  const parts = [];
  
  if (item.name) parts.push(item.name);
  if (item.state && item.state !== item.name) parts.push(item.state);
  if (item.country === 'GB') parts.push('UK');
  
  return parts.join(', ');
};

const determineNominatimType = (item: any): 'city' | 'town' | 'postcode' | 'county' | 'district' => {
  const address = item.address || {};
  const type = item.type || '';
  const osm_type = item.osm_type || '';
  
  if (address.postcode && isPostcodeQuery(item.display_name)) {
    return 'postcode';
  }
  
  if (type === 'administrative' || address.county) {
    return 'county';
  }
  
  if (address.city || type === 'city') {
    return 'city';
  }
  
  if (address.town || address.village || type === 'town' || type === 'village') {
    return 'town';
  }
  
  if (address.suburb || address.neighbourhood) {
    return 'district';
  }
  
  return 'town';
};

const determineOpenWeatherType = (item: any, query: string): 'city' | 'town' | 'postcode' | 'county' => {
  if (/^[a-z]{1,2}\d[a-z\d]?\s*\d?[a-z]{0,2}$/i.test(query.trim())) {
    return 'postcode';
  }
  
  const nameLower = item.name?.toLowerCase() || '';
  
  if (item.state || nameLower.includes('county') || nameLower.includes('shire')) {
    return 'county';
  }
  
  return nameLower.length > 8 ? 'city' : 'town';
};

const isPostcodeQuery = (displayName: string): boolean => {
  return /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i.test(displayName);
};
