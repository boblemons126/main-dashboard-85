
import React from 'react';
import { Palette, Monitor, Sun, Moon, Contrast } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';

interface AppearanceSettingsProps {
  onSettingsChange: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onSettingsChange }) => {
  const { settings, updateAppearanceSettings } = useSettings();
  const { appearance } = settings;

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: Monitor, description: 'Follow system preference' },
    { id: 'contrast', name: 'High Contrast', icon: Contrast, description: 'Maximum accessibility' }
  ];

  const accentColors = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' }
  ];

  const handleThemeChange = (themeId: string) => {
    updateAppearanceSettings({ theme: themeId as any });
    onSettingsChange();
  };

  const handleAccentColorChange = (colorId: string) => {
    updateAppearanceSettings({ accentColor: colorId });
    onSettingsChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">Appearance</h3>
        <p className="text-blue-200">Customize the look and feel of your dashboard</p>
      </div>

      {/* Theme Selection */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Theme
          </CardTitle>
          <CardDescription className="text-blue-200">
            Choose your preferred theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  appearance.theme === themeOption.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <div className="flex items-center space-x-3">
                  <themeOption.icon className="w-6 h-6 text-white" />
                  <div>
                    <h4 className="text-white font-medium">{themeOption.name}</h4>
                    <p className="text-sm text-gray-300">{themeOption.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Accent Color</CardTitle>
          <CardDescription className="text-blue-200">
            Choose an accent color for highlights and buttons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.id}
                className={`p-3 rounded-lg flex items-center space-x-2 transition-all ${
                  appearance.accentColor === color.id
                    ? 'bg-white/20 ring-2 ring-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleAccentColorChange(color.id)}
              >
                <div className={`w-6 h-6 rounded-full ${color.color}`} />
                <span className="text-white text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Settings */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Background</CardTitle>
          <CardDescription className="text-blue-200">
            Adjust background opacity and effects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white text-sm mb-3 block">
              Background Opacity: {appearance.backgroundOpacity}%
            </Label>
            <Slider
              value={[appearance.backgroundOpacity]}
              onValueChange={(value) => {
                updateAppearanceSettings({ backgroundOpacity: value[0] });
                onSettingsChange();
              }}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Blur Effects</Label>
              <p className="text-sm text-gray-300">Enable backdrop blur on cards</p>
            </div>
            <Switch
              checked={appearance.blurEffects}
              onCheckedChange={(checked) => {
                updateAppearanceSettings({ blurEffects: checked });
                onSettingsChange();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Animations</Label>
              <p className="text-sm text-gray-300">Enable smooth transitions and animations</p>
            </div>
            <Switch
              checked={appearance.animationsEnabled}
              onCheckedChange={(checked) => {
                updateAppearanceSettings({ animationsEnabled: checked });
                onSettingsChange();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Preview</CardTitle>
          <CardDescription className="text-blue-200">
            See how your changes will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <h4 className="text-white font-semibold mb-2">Sample Widget</h4>
                <p className="text-gray-300 text-sm">This is how your widgets will appear with the current settings.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${accentColors.find(c => c.id === appearance.accentColor)?.color}`} />
                  <h4 className="text-white font-semibold">Accent Color</h4>
                </div>
                <p className="text-gray-300 text-sm">Your chosen accent color will appear in buttons and highlights.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
