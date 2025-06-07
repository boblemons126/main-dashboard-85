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

const OPENWEATHER_API_KEY = '31fcb172502b94e6534cc6bc72352259';

// Cache for instant results
const searchCache = new Map<string, { results: LocationResult[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Priority weights for location types
const TYPE_PRIORITY = {
  'town': 5,
  'city': 4,
  'county': 3,
  'postcode': 2,
  'district': 1
};

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
    const nominatimResults = await searchWithNominatim(cleanQuery, limit * 2);
    
    // Apply flexible matching and scoring
    const scoredResults = scoreAndFilterResults(nominatimResults, cleanQuery);
    
    // If Nominatim gives good results, use them
    if (scoredResults.length > 0) {
      const finalResults = scoredResults.slice(0, limit);
      searchCache.set(cacheKey, { results: finalResults, timestamp: Date.now() });
      return finalResults;
    }
    
    // Fallback to OpenWeather
    const openWeatherResults = await searchWithOpenWeather(cleanQuery, limit);
    const scoredOpenWeatherResults = scoreAndFilterResults(openWeatherResults, cleanQuery);
    const finalResults = scoredOpenWeatherResults.slice(0, limit);
    
    searchCache.set(cacheKey, { results: finalResults, timestamp: Date.now() });
    return finalResults;
    
  } catch (error) {
    console.error('Location search error:', error);
    
    // Return cached results if available
    if (cached) {
      return cached.results;
    }
    
    return [];
  }
};

const scoreAndFilterResults = (results: LocationResult[], query: string): LocationResult[] => {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  
  return results
    .map(result => ({
      ...result,
      matchScore: calculateMatchScore(result, queryWords)
    }))
    .filter(result => result.matchScore! > 0)
    .sort((a, b) => {
      // First sort by type priority
      const priorityDiff = (TYPE_PRIORITY[b.type] || 0) - (TYPE_PRIORITY[a.type] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by match score
      const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Finally by importance
      return (b.importance || 0) - (a.importance || 0);
    });
};

const calculateMatchScore = (result: LocationResult, queryWords: string[]): number => {
  const resultText = result.name.toLowerCase();
  const resultWords = resultText.split(/[\s,]+/).filter(word => word.length > 0);
  
  let score = 0;
  let matchedWords = 0;
  
  for (const queryWord of queryWords) {
    let bestWordScore = 0;
    
    for (const resultWord of resultWords) {
      if (resultWord === queryWord) {
        // Exact word match
        bestWordScore = Math.max(bestWordScore, 10);
      } else if (resultWord.startsWith(queryWord)) {
        // Prefix match
        bestWordScore = Math.max(bestWordScore, 8);
      } else if (resultWord.includes(queryWord)) {
        // Substring match
        bestWordScore = Math.max(bestWordScore, 5);
      } else if (queryWord.length >= 3) {
        // Fuzzy match for longer words
        const similarity = calculateSimilarity(queryWord, resultWord);
        if (similarity > 0.6) {
          bestWordScore = Math.max(bestWordScore, Math.floor(similarity * 3));
        }
      }
    }
    
    if (bestWordScore > 0) {
      matchedWords++;
      score += bestWordScore;
    }
  }
  
  // Bonus for matching all query words
  if (matchedWords === queryWords.length) {
    score += 5;
  }
  
  // Penalty for unmatched query words
  const unmatchedWords = queryWords.length - matchedWords;
  score -= unmatchedWords * 3;
  
  return Math.max(0, score);
};

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
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
  }));
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
