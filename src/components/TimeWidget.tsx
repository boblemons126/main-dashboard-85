import React from 'react';
import { Clock } from 'lucide-react';

interface TimeWidgetProps {
  currentTime: Date;
}

const TimeWidget = ({ currentTime }: TimeWidgetProps) => {
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'ᵗʰ';
    switch (day % 10) {
      case 1: return 'ˢᵗ';
      case 2: return 'ⁿᵈ';
      case 3: return 'ʳᵈ';
      default: return 'ᵗʰ';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="text-white font-medium">
          {`${currentTime.toLocaleDateString([], { weekday: 'long' })} ${currentTime.getDate()}${getOrdinalSuffix(currentTime.getDate())} ${currentTime.toLocaleDateString([], { month: 'long' })} - ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </span>
      </div>
    </div>
  );
};

export default TimeWidget;
