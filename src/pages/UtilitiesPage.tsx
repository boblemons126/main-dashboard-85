import React from 'react';
import { CloudSun, Clipboard, FileText, Hash, Ruler, Timer, Wrench, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const UtilitiesPage = () => {
  const utilityTools = [
    {
      icon: <CloudSun className="w-6 h-6" />,
      title: 'Weather Forecast',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      linkTo: '/utilities/Weather'
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: 'News & Notifications',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      linkTo: '/utilities/timer'
    },
    {
      icon: <Clipboard className="w-6 h-6" />,
      title: 'Notes',
      description: 'Quick notes and reminders',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      linkTo: '/utilities/notes'
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: 'Unit Converter',
      description: 'Convert between different units',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      linkTo: '/utilities/converter'
    },
    {
      icon: <Hash className="w-6 h-6" />,
      title: 'Password Generator',
      description: 'Generate secure passwords',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      linkTo: '/utilities/password'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Text Tools',
      description: 'Format and manipulate text',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      linkTo: '/utilities/text'
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
                  <h1 className="text-3xl font-bold text-white">Utilities</h1>
                  <p className="text-blue-200">Essential tools for everyday use</p>
                </div>
              </div>
            </div>
          </header>

          {/* Utilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilityTools.map((tool, index) => (
              <Link
                key={index}
                to={tool.linkTo}
                className={`${tool.bgColor} backdrop-blur-md rounded-xl p-6 border ${tool.borderColor} hover:bg-white/20 transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${tool.color} p-2 rounded-lg bg-white/10`}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{tool.title}</h3>
                    <p className="text-white/60 text-sm">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesPage;