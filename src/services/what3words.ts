interface What3WordsResponse {
  coordinates: {
    lat: number;
    lng: number;
  };
  words: string;
  map: string;
  nearestPlace: string;
}

export const convertToCoordinates = async (words: string): Promise<{ latitude: number; longitude: number }> => {
  const apiKey = process.env.REACT_APP_WHAT3WORDS_API_KEY;
  if (!apiKey) {
    throw new Error('What3Words API key not found');
  }

  try {
    const response = await fetch(
      `https://api.what3words.com/v3/convert-to-coordinates?words=${encodeURIComponent(words)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to convert what3words address');
    }

    const data: What3WordsResponse = await response.json();
    return {
      latitude: data.coordinates.lat,
      longitude: data.coordinates.lng
    };
  } catch (error) {
    console.error('Error converting what3words:', error);
    throw error;
  }
};

export const convertToWords = async (latitude: number, longitude: number): Promise<string> => {
  const apiKey = process.env.REACT_APP_WHAT3WORDS_API_KEY;
  if (!apiKey) {
    throw new Error('What3Words API key not found');
  }

  try {
    const response = await fetch(
      `https://api.what3words.com/v3/convert-to-3wa?coordinates=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to convert coordinates to what3words');
    }

    const data: What3WordsResponse = await response.json();
    return data.words;
  } catch (error) {
    console.error('Error converting coordinates:', error);
    throw error;
  }
}; 