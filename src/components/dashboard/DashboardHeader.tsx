import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import TimeWidget from '../TimeWidget';

interface DashboardHeaderProps {
  isTimeWidgetEnabled: boolean;
  currentTime: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isTimeWidgetEnabled, currentTime }) => {
  return (
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
        {isTimeWidgetEnabled && <TimeWidget currentTime={currentTime} />}
      </div>
    </header>
  );
};

export default DashboardHeader; 