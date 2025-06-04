// API Keys Configuration
export const API_KEYS = {
  TOMTOM: import.meta.env.VITE_TOMTOM_API_KEY || 'YOUR_TOMTOM_API_KEY'
} as const;

// You can get a free API key from:
// https://developer.tomtom.com/
// 
// Add to your .env file:
// VITE_TOMTOM_API_KEY=your_actual_api_key_here 