
import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface ForecastToggleProps {
  showHourly: boolean;
  onToggle: (showHourly: boolean) => void;
}

const ForecastToggle: React.FC<ForecastToggleProps> = ({ showHourly, onToggle }) => {
  return (
    <div className="w-fit mx-auto flex bg-white/15 backdrop-blur-sm rounded-lg p-1 mb-3">
      <button 
        onClick={() => onToggle(true)} 
        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
          showHourly 
            ? 'bg-white/20 text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        <Clock className="w-3 h-3" />
        <span>Hourly</span>
      </button>
      <button 
        onClick={() => onToggle(false)} 
        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
          !showHourly 
            ? 'bg-white/20 text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        <Calendar className="w-3 h-3" />
        <span>Daily</span>
      </button>
    </div>
  );
};

export default ForecastToggle;
