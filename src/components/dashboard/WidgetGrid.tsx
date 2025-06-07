import React from 'react';
import CalendarWidget from '../CalendarWidget';
import WeatherWidget from '../weather/WeatherWidget';
import NewsWidget from '../NewsWidget';

interface WidgetGridProps {
  isCalendarEnabled: boolean;
  isWeatherEnabled: boolean;
  isNewsEnabled: boolean;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ isCalendarEnabled, isWeatherEnabled, isNewsEnabled }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {/* Calendar Widget - Takes up 2 columns on larger screens */}
      {isCalendarEnabled && (
        <div className="lg:col-span-2">
          <CalendarWidget />
        </div>
      )}

      {/* Weather Widget */}
      {isWeatherEnabled && (
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>
      )}

      {/* News Widget - Takes up remaining space */}
      {isNewsEnabled && (
        <div className="lg:col-span-3 xl:col-span-1">
          <NewsWidget />
        </div>
      )}
    </div>
  );
};

export default WidgetGrid; 