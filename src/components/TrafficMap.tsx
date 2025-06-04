import React from 'react';
import { Play } from 'lucide-react';
import { TrafficItem } from '../services/TrafficService';

interface TrafficMapProps {
  trafficItems: TrafficItem[];
}

const TrafficMap: React.FC<TrafficMapProps> = () => {
  const renderSeverityLegend = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span className="text-white/80 text-sm">High Severity</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span className="text-white/80 text-sm">Medium Severity</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-white/80 text-sm">Low Severity</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between h-[400px] py-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>
      {renderSeverityLegend()}
      <button 
        onClick={() => window.open('https://maps.google.com', '_blank')}
        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200"
      >
        Open Traffic Map
      </button>
    </div>
  );
};

export default TrafficMap; 