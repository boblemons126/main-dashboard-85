
interface LocationResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  type: 'city' | 'town' | 'postcode' | 'county';
  postcode?: string;
}

const OPENWEATHER_API_KEY = '31fcb172502b94e6534cc6bc72352259';

export const searchLocations = async (query: string, limit = 5): Promise<LocationResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanQuery)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: formatLocationName(item),
      latitude: item.lat,
      longitude: item.lon,
      country: item.country,
      state: item.state,
      type: determineLocationType(item, cleanQuery),
      postcode: item.postcode || undefined
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};

const formatLocationName = (item: any): string => {
  const parts = [];
  
  if (item.name) parts.push(item.name);
  if (item.state && item.state !== item.name) parts.push(item.state);
  if (item.country) {
    parts.push(item.country === 'GB' ? 'UK' : item.country);
  }
  
  return parts.join(', ');
};

const determineLocationType = (item: any, query: string): 'city' | 'town' | 'postcode' | 'county' => {
  const queryLower = query.toLowerCase();
  
  // Check if it looks like a postcode
  if (/^[a-z]{1,2}\d[a-z\d]?\s*\d?[a-z]{0,2}$/i.test(query.trim())) {
    return 'postcode';
  }
  
  const nameLower = item.name?.toLowerCase() || '';
  
  // Check for county indicators
  if (item.state || nameLower.includes('county') || nameLower.includes('shire')) {
    return 'county';
  }
  
  // Default classification based on name length
  return nameLower.length > 8 ? 'city' : 'town';
};
