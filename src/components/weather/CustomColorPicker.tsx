
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
  onReset: () => void;
}

const colorPresets = [
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Purple', value: '#5b21b6' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Green', value: '#065f46' },
  { name: 'Orange', value: '#9a3412' },
  { name: 'Red', value: '#991b1b' },
  { name: 'Gray', value: '#1f2937' },
  { name: 'Teal', value: '#0f766e' },
];

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ value, onChange, onClose, onReset }) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const saturationSliderRef = useRef<HTMLDivElement>(null);
  const lightnessSliderRef = useRef<HTMLDivElement>(null);

  // Convert hex to HSL on mount
  useEffect(() => {
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    if (value) {
      const [h, s, l] = hexToHsl(value);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  }, [value]);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const updateColor = useCallback((newHue: number, newSaturation: number, newLightness: number) => {
    onChange(hslToHex(newHue, newSaturation, newLightness));
  }, [onChange]);

  const handleSliderInteraction = useCallback((
    e: React.MouseEvent<HTMLDivElement> | MouseEvent,
    ref: React.RefObject<HTMLDivElement>,
    setter: (value: number) => void,
    max: number,
    sliderType: string
  ) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newValue = Math.max(0, Math.min(max, (x / rect.width) * max));
    setter(newValue);
    
    const newHue = sliderType === 'hue' ? newValue : hue;
    const newSaturation = sliderType === 'saturation' ? newValue : saturation;
    const newLightness = sliderType === 'lightness' ? newValue : lightness;
    
    updateColor(newHue, newSaturation, newLightness);
  }, [hue, saturation, lightness, updateColor]);

  const handleMouseDown = (sliderType: string) => {
    setIsDragging(sliderType);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      switch (isDragging) {
        case 'hue':
          handleSliderInteraction(e, hueSliderRef, setHue, 360, 'hue');
          break;
        case 'saturation':
          handleSliderInteraction(e, saturationSliderRef, setSaturation, 100, 'saturation');
          break;
        case 'lightness':
          handleSliderInteraction(e, lightnessSliderRef, setLightness, 100, 'lightness');
          break;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleSliderInteraction]);

  const currentColor = hslToHex(hue, saturation, lightness);

  return (
    <div className="w-80 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-600">
      <Tabs defaultValue="picker" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700 rounded-none h-12 p-0">
          <TabsTrigger 
            value="picker" 
            className="text-white font-medium data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-none h-full"
          >
            Color Picker
          </TabsTrigger>
          <TabsTrigger 
            value="presets" 
            className="text-white font-medium data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-none h-full"
          >
            Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="picker" className="p-6 space-y-6 m-0">
          {/* Hue Slider */}
          <div>
            <label className="text-white text-sm font-medium mb-3 block">Hue</label>
            <div 
              ref={hueSliderRef}
              className="relative h-3 rounded-full cursor-pointer select-none"
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ff8000 12.5%, #ffff00 25%, #80ff00 37.5%, #00ff00 50%, #00ff80 62.5%, #00ffff 75%, #0080ff 87.5%, #0000ff 100%)'
              }}
              onMouseDown={(e) => {
                handleMouseDown('hue');
                handleSliderInteraction(e, hueSliderRef, setHue, 360, 'hue');
              }}
            >
              <div 
                className="absolute top-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-400 transform -translate-y-1/2 -translate-x-1/2 shadow-lg cursor-pointer"
                style={{ left: `${(hue / 360) * 100}%` }}
              />
            </div>
          </div>

          {/* Saturation Slider */}
          <div>
            <label className="text-white text-sm font-medium mb-3 block">Saturation</label>
            <div 
              ref={saturationSliderRef}
              className="relative h-3 rounded-full cursor-pointer select-none"
              style={{
                background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
              }}
              onMouseDown={(e) => {
                handleMouseDown('saturation');
                handleSliderInteraction(e, saturationSliderRef, setSaturation, 100, 'saturation');
              }}
            >
              <div 
                className="absolute top-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-400 transform -translate-y-1/2 -translate-x-1/2 shadow-lg cursor-pointer"
                style={{ left: `${saturation}%` }}
              />
            </div>
          </div>

          {/* Lightness Slider */}
          <div>
            <label className="text-white text-sm font-medium mb-3 block">Lightness</label>
            <div 
              ref={lightnessSliderRef}
              className="relative h-3 rounded-full cursor-pointer select-none"
              style={{
                background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`
              }}
              onMouseDown={(e) => {
                handleMouseDown('lightness');
                handleSliderInteraction(e, lightnessSliderRef, setLightness, 100, 'lightness');
              }}
            >
              <div 
                className="absolute top-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-400 transform -translate-y-1/2 -translate-x-1/2 shadow-lg cursor-pointer"
                style={{ left: `${lightness}%` }}
              />
            </div>
          </div>

          {/* Color Preview */}
          <div className="relative">
            <div 
              className="h-20 rounded-lg relative overflow-hidden"
              style={{ backgroundColor: currentColor }}
            >
              <div className="absolute bottom-3 left-3 text-xs font-mono text-white bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
                {currentColor.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="text-xs text-slate-400">
            Tip: Use the color picker for precise control or choose from presets
          </div>
        </TabsContent>

        <TabsContent value="presets" className="p-6 m-0">
          <div className="grid grid-cols-4 gap-3">
            {colorPresets.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className="relative p-0 h-14 border border-slate-600/50 rounded-lg overflow-hidden transition-all hover:scale-105"
                style={{
                  backgroundColor: color.value,
                  borderColor: value === color.value ? '#ffffff' : 'rgba(100, 116, 139, 0.5)'
                }}
                onClick={() => onChange(color.value)}
                title={color.name}
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
                {value === color.value && (
                  <div className="absolute inset-0 border-2 border-white rounded-lg" />
                )}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-6 border-t border-slate-600/50">
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Use Original Colours
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;
