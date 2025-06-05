
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Thermometer, Wind, Cloud, RefreshCw, Palette, Check } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// Expanded color presets with more shades
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

// HSL color wheel values
const hueGradient = [
  '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00',
  '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
  '#ff00ff', '#ff0080', '#ff0000'
];

interface WeatherSettingsProps {
  onSettingsChange: () => void;
}

const WeatherSettings: React.FC<WeatherSettingsProps> = ({ onSettingsChange }) => {
  const { settings, updateWidgetSettings } = useSettings();
  const widget = settings.widgets.find(w => w.id === 'weather');
  const config = widget?.config || {};
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('picker');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const updateConfig = (newConfig: any) => {
    const updatedWidgets = settings.widgets.map(w => {
      if (w.id === 'weather') {
        return {
          ...w,
          config: { ...w.config, ...newConfig }
        };
      }
      return w;
    });
    updateWidgetSettings(updatedWidgets);
    onSettingsChange();
  };

  // Function to convert HSL to Hex
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

  // Get the current active color for glow effects
  const activeColor = hoveredColor || config.customBackgroundColor || '#1e3a8a';

  // Update color from HSL values
  const updateFromHSL = () => {
    const hexColor = hslToHex(hue, saturation, lightness);
    updateConfig({ customBackgroundColor: hexColor });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Color Settings
          </CardTitle>
          <CardDescription className="text-blue-200">
            Customize the appearance of your weather widget for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Colour Test</Label>
                <p className="text-sm text-gray-300">Override dynamic background with a custom color for better accessibility</p>
              </div>
              <Switch
                checked={config.colourTest ?? false}
                onCheckedChange={(checked) => updateConfig({ colourTest: checked })}
              />
            </div>

            {config.colourTest && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Custom Background Color</Label>
                    <p className="text-sm text-gray-300">Choose a custom background color that works best for you</p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[140px] h-8 border-2 relative group"
                        style={{
                          backgroundColor: config.customBackgroundColor ?? '#1e3a8a',
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="relative flex items-center justify-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2 border-2 border-white/20"
                            style={{ backgroundColor: config.customBackgroundColor ?? '#1e3a8a' }}
                          />
                          <span className="text-white/90 text-sm">Select Color</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-slate-900/95 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40">
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
                                    updateFromHSL();
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
                                    updateFromHSL();
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
                                    updateFromHSL();
                                  }}
                                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&>.relative>div:first-child]:bg-white [&>.relative>div:last-child]:bg-transparent"
                                />
                              </div>
                              <div className="relative">
                                <div 
                                  className="absolute -inset-4 rounded-xl blur-xl transition-colors duration-200 opacity-50"
                                  style={{
                                    backgroundColor: hslToHex(hue, saturation, lightness)
                                  }}
                                />
                                <div className="relative">
                                  <div 
                                    className="h-20 rounded-lg shadow-lg border-2 transition-colors duration-200"
                                    style={{
                                      backgroundColor: hslToHex(hue, saturation, lightness),
                                      borderColor: `${hslToHex(hue, saturation, lightness)}33`
                                    }}
                                  >
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent" />
                                  </div>
                                  <div className="absolute bottom-2 left-2 text-xs font-mono text-white/70 bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">
                                    {hslToHex(hue, saturation, lightness).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="presets" className="mt-0">
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-3">
                                {colorPresets.map((color) => (
                                  <Button
                                    key={color.value}
                                    variant="outline"
                                    className="relative group p-0 h-12 border-2 rounded-lg overflow-hidden transition-all duration-200"
                                    style={{
                                      backgroundColor: color.value,
                                      borderColor: config.customBackgroundColor === color.value 
                                        ? 'white' 
                                        : 'rgba(255, 255, 255, 0.1)',
                                      boxShadow: hoveredColor === color.value 
                                        ? `0 0 20px ${color.value}33` 
                                        : 'none'
                                    }}
                                    onClick={() => updateConfig({ customBackgroundColor: color.value })}
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
                            </div>
                          </TabsContent>
                        </div>
                      </Tabs>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-xs text-blue-200">
                          Tip: Use the color picker for precise control or choose from presets
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Thermometer className="w-5 h-5 mr-2" />
            Display Settings
          </CardTitle>
          <CardDescription className="text-blue-200">
            Configure how weather information is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Temperature Unit</Label>
              <p className="text-sm text-gray-300">Choose your preferred temperature scale</p>
            </div>
            <Select
              value={config.temperatureUnit ?? 'celsius'}
              onValueChange={(value) => updateConfig({ temperatureUnit: value })}
            >
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Show Wind Speed</Label>
              <p className="text-sm text-gray-300">Display wind speed information</p>
            </div>
            <Switch
              checked={config.showWind ?? true}
              onCheckedChange={(checked) => updateConfig({ showWind: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Show Humidity</Label>
              <p className="text-sm text-gray-300">Display humidity percentage</p>
            </div>
            <Switch
              checked={config.showHumidity ?? true}
              onCheckedChange={(checked) => updateConfig({ showHumidity: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Extended Forecast Days</Label>
              <p className="text-sm text-gray-300">Number of days to show in forecast</p>
            </div>
            <Select
              value={String(config.forecastDays ?? 5)}
              onValueChange={(value) => updateConfig({ forecastDays: Number(value) })}
            >
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Settings
          </CardTitle>
          <CardDescription className="text-blue-200">
            Configure your weather location preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Use Device Location</Label>
              <p className="text-sm text-gray-300">Automatically detect your location</p>
            </div>
            <Switch
              checked={config.useDeviceLocation ?? true}
              onCheckedChange={(checked) => updateConfig({ useDeviceLocation: checked })}
            />
          </div>

          {!config.useDeviceLocation && (
            <div className="space-y-2">
              <Label className="text-white">Manual Location</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter city name"
                  value={config.manualLocation ?? ''}
                  onChange={(e) => updateConfig({ manualLocation: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {/* Implement location search */}}
                >
                  Search
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Update Settings
          </CardTitle>
          <CardDescription className="text-blue-200">
            Configure how often the weather data updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto Refresh</Label>
              <p className="text-sm text-gray-300">Automatically update weather data</p>
            </div>
            <Switch
              checked={config.autoRefresh ?? true}
              onCheckedChange={(checked) => updateConfig({ autoRefresh: checked })}
            />
          </div>

          {config.autoRefresh && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Refresh Interval</Label>
                <p className="text-sm text-gray-300">How often to update weather data</p>
              </div>
              <Select
                value={String(config.refreshInterval ?? 30)}
                onValueChange={(value) => updateConfig({ refreshInterval: Number(value) })}
              >
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherSettings; 
