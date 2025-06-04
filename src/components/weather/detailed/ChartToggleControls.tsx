
import React from 'react';
import { Toggle } from '../../ui/toggle';
import { Thermometer, Cloud, Wind, Droplets, Sunrise } from 'lucide-react';

interface ChartToggleControlsProps {
  showTemperature: boolean;
  setShowTemperature: (show: boolean) => void;
  showRain: boolean;
  setShowRain: (show: boolean) => void;
  showWind: boolean;
  setShowWind: (show: boolean) => void;
  showHumidity: boolean;
  setShowHumidity: (show: boolean) => void;
  showSunriseSunset: boolean;
  setShowSunriseSunset: (show: boolean) => void;
}

const ChartToggleControls: React.FC<ChartToggleControlsProps> = ({
  showTemperature,
  setShowTemperature,
  showRain,
  setShowRain,
  showWind,
  setShowWind,
  showHumidity,
  setShowHumidity,
  showSunriseSunset,
  setShowSunriseSunset,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Toggle
        pressed={showTemperature}
        onPressedChange={setShowTemperature}
        className="data-[state=on]:bg-amber-500/30 data-[state=on]:text-amber-100 text-white/70 hover:text-white hover:bg-white/10"
      >
        <Thermometer className="w-4 h-4 mr-2" />
        Temp
      </Toggle>
      
      <Toggle
        pressed={showRain}
        onPressedChange={setShowRain}
        className="data-[state=on]:bg-blue-500/30 data-[state=on]:text-blue-100 text-white/70 hover:text-white hover:bg-white/10"
      >
        <Cloud className="w-4 h-4 mr-2" />
        Rain
      </Toggle>
      
      <Toggle
        pressed={showWind}
        onPressedChange={setShowWind}
        className="data-[state=on]:bg-emerald-500/30 data-[state=on]:text-emerald-100 text-white/70 hover:text-white hover:bg-white/10"
      >
        <Wind className="w-4 h-4 mr-2" />
        Wind
      </Toggle>
      
      <Toggle
        pressed={showHumidity}
        onPressedChange={setShowHumidity}
        className="data-[state=on]:bg-purple-500/30 data-[state=on]:text-purple-100 text-white/70 hover:text-white hover:bg-white/10"
      >
        <Droplets className="w-4 h-4 mr-2" />
        Humidity
      </Toggle>
      
      <Toggle
        pressed={showSunriseSunset}
        onPressedChange={setShowSunriseSunset}
        className="data-[state=on]:bg-orange-500/30 data-[state=on]:text-orange-100 text-white/70 hover:text-white hover:bg-white/10"
      >
        <Sunrise className="w-4 h-4 mr-2" />
        Sun
      </Toggle>
    </div>
  );
};

export default ChartToggleControls;
