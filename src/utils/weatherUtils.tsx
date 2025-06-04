import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';

export const getWeatherIcon = (condition: string, size: string = "w-8 h-8") => {
  const iconClass = `${size} text-white drop-shadow-md`;
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <Sun className={iconClass} />;
  } else if (conditionLower.includes('cloud')) {
    return <Cloud className={iconClass} />;
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className={iconClass} />;
  } else if (conditionLower.includes('snow')) {
    return <CloudSnow className={iconClass} />;
  } else if (conditionLower.includes('thunder')) {
    return <Zap className={iconClass} />;
  } else {
    return <Sun className={iconClass} />;
  }
};

export const getGradientByCondition = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return 'from-blue-400 via-blue-500 to-blue-600';
  } else if (conditionLower.includes('cloud')) {
    return 'from-gray-400 via-gray-500 to-gray-600';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'from-blue-600 via-blue-700 to-blue-800';
  } else if (conditionLower.includes('snow')) {
    return 'from-blue-200 via-blue-300 to-blue-400';
  } else if (conditionLower.includes('thunder')) {
    return 'from-gray-700 via-gray-800 to-gray-900';
  } else {
    return 'from-blue-400 via-blue-500 to-blue-600';
  }
};
