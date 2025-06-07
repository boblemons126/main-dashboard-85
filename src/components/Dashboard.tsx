import React, { useState, useEffect } from 'react';
import ApplicationsList from './ApplicationsList';
import { useSettings } from '@/contexts/SettingsContext';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsOverview from './dashboard/StatsOverview';
import WidgetGrid from './dashboard/WidgetGrid';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to check if a widget is enabled
  const isWidgetEnabled = (widgetId: string) => {
    const widget = settings.widgets.find(w => w.id === widgetId);
    return widget?.enabled ?? true; // Default to true for backwards compatibility
  };

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            isTimeWidgetEnabled={isWidgetEnabled('time')}
            currentTime={currentTime}
          />
          <StatsOverview />
          <WidgetGrid 
            isCalendarEnabled={isWidgetEnabled('calendar')}
            isWeatherEnabled={isWidgetEnabled('weather')}
            isNewsEnabled={isWidgetEnabled('news')}
          />
          {/* Applications List */}
          <div className="mt-8">
            <ApplicationsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
