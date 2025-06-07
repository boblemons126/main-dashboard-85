import React, { useState, useRef } from 'react';
import { Palette, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
  onReset: () => void;
}

const colorPresets = [
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Royal Blue', value: '#1d4ed8' },
  { name: 'Sky Blue', value: '#0ea5e9' },
  { name: 'Purple', value: '#5b21b6' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Green', value: '#065f46' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Orange', value: '#9a3412' },
  { name: 'Red', value: '#991b1b' },
  { name: 'Slate', value: '#0f172a' },
  { name: 'Gray', value: '#1f2937' },
  { name: 'Neutral', value: '#262626' },
];

const hueGradient = [
  'hsl(0, 100%, 50%)',    // Red
  'hsl(60, 100%, 50%)',   // Yellow
  'hsl(120, 100%, 50%)',  // Green
  'hsl(180, 100%, 50%)',  // Cyan
  'hsl(240, 100%, 50%)',  // Blue
  'hsl(300, 100%, 50%)',  // Magenta
  'hsl(360, 100%, 50%)'   // Red again
];

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ value, onChange, onClose, onReset }) => {
  const [selectedTab, setSelectedTab] = useState('picker');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  // HSL state for color picker
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const hexToHsl = (hex: string) => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the values
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Convert to percentages
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  };

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

  const handleMouseDown = (sliderType: string) => {
    setIsDragging(true);
    dragOffset.current = {
      x: position.x,
      y: position.y
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="picker" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="picker" className="text-white data-[state=active]:bg-slate-700">
            Color Picker
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-white data-[state=active]:bg-slate-700">
            Presets
          </TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="picker" className="mt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block font-medium">Hue</Label>
                <div className="h-4 rounded-lg mb-2" style={{
                  background: `linear-gradient(to right, ${hueGradient.join(', ')})`
                }} />
                <Slider
                  value={[hue]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => {
                    setHue(value[0]);
                    onChange(hslToHex(value[0], saturation, lightness));
                  }}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&>.relative>div:first-child]:bg-white [&>.relative>div:last-child]:bg-transparent"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block font-medium">Saturation</Label>
                <div className="h-4 rounded-lg mb-2" style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%), 
                    hsl(${hue}, 100%, ${lightness}%))`
                }} />
                <Slider
                  value={[saturation]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setSaturation(value[0]);
                    onChange(hslToHex(hue, value[0], lightness));
                  }}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&>.relative>div:first-child]:bg-white [&>.relative>div:last-child]:bg-transparent"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block font-medium">Lightness</Label>
                <div className="h-4 rounded-lg mb-2" style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%), 
                    hsl(${hue}, ${saturation}%, 100%))`
                }} />
                <Slider
                  value={[lightness]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setLightness(value[0]);
                    onChange(hslToHex(hue, saturation, value[0]));
                  }}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&>.relative>div:first-child]:bg-white [&>.relative>div:last-child]:bg-transparent"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="presets" className="mt-0">
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  className="relative group p-0 h-12 border-2 rounded-lg overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: color.value,
                    borderColor: value === color.value 
                      ? 'white' 
                      : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: hoveredColor === color.value 
                      ? `0 0 20px ${color.value}33` 
                      : 'none'
                  }}
                  onClick={() => onChange(color.value)}
                  onPointerEnter={() => setHoveredColor(color.value)}
                  onPointerLeave={() => setHoveredColor(null)}
                >
                  <div 
                    className="absolute inset-0 transition-opacity duration-200"
                    style={{
                      backgroundColor: hoveredColor === color.value 
                        ? `${color.value}33`
                        : 'transparent'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span 
                      className="text-white text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: hoveredColor === color.value 
                          ? `${color.value}99`
                          : 'rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      {color.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <div className="flex items-center justify-between space-x-2">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onClose}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CustomColorPicker; 