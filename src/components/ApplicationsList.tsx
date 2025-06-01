
import React from 'react';
import { 
  Calendar, 
  Cloud, 
  Newspaper, 
  Clock, 
  Home, 
  Thermometer, 
  Shield, 
  Lightbulb,
  Wifi,
  Camera,
  Music,
  Settings,
  BarChart3,
  Users
} from 'lucide-react';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'connected';
  category: 'Core' | 'Smart Home' | 'Entertainment' | 'Security' | 'Monitoring';
}

const ApplicationsList = () => {
  const applications: Application[] = [
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Google Calendar integration for events and scheduling',
      icon: <Calendar className="w-5 h-5" />,
      status: 'connected',
      category: 'Core'
    },
    {
      id: 'weather',
      name: 'Weather',
      description: 'Real-time weather data and forecasts',
      icon: <Cloud className="w-5 h-5" />,
      status: 'active',
      category: 'Core'
    },
    {
      id: 'news',
      name: 'News',
      description: 'Latest news updates and articles',
      icon: <Newspaper className="w-5 h-5" />,
      status: 'active',
      category: 'Core'
    },
    {
      id: 'time',
      name: 'Time & Date',
      description: 'Current time and date display',
      icon: <Clock className="w-5 h-5" />,
      status: 'active',
      category: 'Core'
    },
    {
      id: 'home-controls',
      name: 'Home Controls',
      description: 'Smart home device control panel',
      icon: <Home className="w-5 h-5" />,
      status: 'connected',
      category: 'Smart Home'
    },
    {
      id: 'thermostat',
      name: 'Thermostat',
      description: 'Temperature control and monitoring',
      icon: <Thermometer className="w-5 h-5" />,
      status: 'connected',
      category: 'Smart Home'
    },
    {
      id: 'lighting',
      name: 'Smart Lighting',
      description: 'Control lights throughout your home',
      icon: <Lightbulb className="w-5 h-5" />,
      status: 'connected',
      category: 'Smart Home'
    },
    {
      id: 'security',
      name: 'Security System',
      description: 'Home security monitoring and alerts',
      icon: <Shield className="w-5 h-5" />,
      status: 'active',
      category: 'Security'
    },
    {
      id: 'cameras',
      name: 'Security Cameras',
      description: 'Live camera feeds and recordings',
      icon: <Camera className="w-5 h-5" />,
      status: 'connected',
      category: 'Security'
    },
    {
      id: 'wifi',
      name: 'Network Status',
      description: 'WiFi and network connectivity monitoring',
      icon: <Wifi className="w-5 h-5" />,
      status: 'active',
      category: 'Monitoring'
    },
    {
      id: 'energy',
      name: 'Energy Monitor',
      description: 'Track energy usage and efficiency',
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'active',
      category: 'Monitoring'
    },
    {
      id: 'music',
      name: 'Music System',
      description: 'Multi-room audio control',
      icon: <Music className="w-5 h-5" />,
      status: 'inactive',
      category: 'Entertainment'
    },
    {
      id: 'family',
      name: 'Family Hub',
      description: 'Family member locations and activities',
      icon: <Users className="w-5 h-5" />,
      status: 'connected',
      category: 'Core'
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Dashboard and system configuration',
      icon: <Settings className="w-5 h-5" />,
      status: 'active',
      category: 'Core'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'connected':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core':
        return 'text-blue-400';
      case 'Smart Home':
        return 'text-green-400';
      case 'Entertainment':
        return 'text-purple-400';
      case 'Security':
        return 'text-red-400';
      case 'Monitoring':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const categories = Array.from(new Set(applications.map(app => app.category)));

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <Home className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Available Applications</h2>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className={`text-sm font-semibold mb-3 ${getCategoryColor(category)}`}>
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {applications
                .filter(app => app.category === category)
                .map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/10 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(app.category)} bg-current/20`}>
                        {app.icon}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </div>
                    </div>
                    
                    <h4 className="text-white font-medium text-sm mb-1 group-hover:text-blue-200 transition-colors">
                      {app.name}
                    </h4>
                    
                    <p className="text-white/60 text-xs line-clamp-2">
                      {app.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/20 text-center">
        <p className="text-white/60 text-sm">
          Total Applications: <span className="text-white font-semibold">{applications.length}</span>
        </p>
        <p className="text-white/60 text-xs mt-1">
          Active: {applications.filter(app => app.status === 'active').length} • 
          Connected: {applications.filter(app => app.status === 'connected').length} • 
          Inactive: {applications.filter(app => app.status === 'inactive').length}
        </p>
      </div>
    </div>
  );
};

export default ApplicationsList;
