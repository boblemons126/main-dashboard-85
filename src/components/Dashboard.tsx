import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, Newspaper, Clock, Thermometer, List, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import OpenWeatherWidget from './OpenWeatherWidget';
import WeatherApiWidget from './WeatherApiWidget';
import ApplicationsList from './ApplicationsList';
import TimeWidget from './TimeWidget';
import CalendarWidget from './CalendarWidget';
import NewsWidget from './NewsWidget';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statsData = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Upcoming Events',
      value: 'Calendar',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      linkTo: '/calendar'
    },
    {
      icon: <List className="w-5 h-5" />,
      label: 'Lists & Tasks',
      value: 'Create',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      linkTo: '/lists'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Application List',
      value: 'Apps',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      label: 'System Preferences',
      value: 'Settings',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/" className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 flex items-center justify-center">
                  <Home className="w-6 h-6" />
                  <span className="sr-only">Home</span>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                  <p className="text-blue-200">Everyday Living Assistant - ELA</p>
                </div>
              </div>
              <TimeWidget currentTime={currentTime} />
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => {
              if (stat.linkTo) {
                return (
                  <Link 
                    key={index}
                    to={stat.linkTo} 
                    className={`${stat.bgColor} backdrop-blur-md rounded-xl p-4 border ${stat.borderColor} hover:bg-white/20 transition-all duration-200 cursor-pointer block`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{stat.value}</div>
                        <div className="text-white/60 text-xs">{stat.label}</div>
                      </div>
                    </div>
                  </Link>
                );
              }
              
              return (
                <div 
                  key={index}
                  className={`${stat.bgColor} backdrop-blur-md rounded-xl p-4 border ${stat.borderColor} hover:bg-white/20 transition-all duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{stat.value}</div>
                      <div className="text-white/60 text-xs">{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {/* Calendar Widget - Takes up 2 columns on larger screens */}
            <div className="lg:col-span-2">
              <CalendarWidget />
            </div>

            {/* Original Weather Widget */}
            <div className="lg:col-span-1">
              <WeatherWidget />
            </div>

            {/* News Widget - Takes up remaining space */}
            <div className="lg:col-span-3 xl:col-span-1">
              <NewsWidget />
            </div>
          </div>

          {/* Additional Weather Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* OpenWeatherMap Widget */}
            <div>
              <OpenWeatherWidget />
            </div>

            {/* WeatherAPI Widget */}
            <div>
              <WeatherApiWidget />
            </div>
          </div>

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
