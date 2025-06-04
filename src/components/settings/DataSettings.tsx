
import React from 'react';
import { Shield, Database, MapPin, Cookie, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/contexts/SettingsContext';

interface DataSettingsProps {
  onSettingsChange: () => void;
}

const DataSettings: React.FC<DataSettingsProps> = ({ onSettingsChange }) => {
  const { settings, updateDataSettings } = useSettings();
  const { data } = settings;

  const handleSettingChange = (key: keyof typeof data, value: any) => {
    updateDataSettings({ [key]: value });
    onSettingsChange();
  };

  const exportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">Data & Privacy</h3>
        <p className="text-blue-200">Control your data and privacy preferences</p>
      </div>

      {/* Privacy Controls */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy Controls
          </CardTitle>
          <CardDescription className="text-blue-200">
            Manage what data is collected and how it's used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Analytics</Label>
                <p className="text-sm text-gray-300">Allow usage analytics to improve the experience</p>
              </div>
            </div>
            <Switch
              checked={data.analytics}
              onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Location Services</Label>
                <p className="text-sm text-gray-300">Use location for weather and local information</p>
              </div>
            </div>
            <Switch
              checked={data.location}
              onCheckedChange={(checked) => handleSettingChange('location', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cookie className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Cookies</Label>
                <p className="text-sm text-gray-300">Allow cookies for personalization</p>
              </div>
            </div>
            <Switch
              checked={data.cookies}
              onCheckedChange={(checked) => handleSettingChange('cookies', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Data Retention</CardTitle>
          <CardDescription className="text-blue-200">
            How long to keep your data stored locally
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm mb-3 block">
                Keep data for: {data.dataRetention} days
              </Label>
              <Slider
                value={[data.dataRetention]}
                onValueChange={(value) => handleSettingChange('dataRetention', value[0])}
                max={365}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 day</span>
                <span>365 days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Data Management</CardTitle>
          <CardDescription className="text-blue-200">
            Export or clear your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              variant="outline"
              className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Usage Info */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Storage Information</CardTitle>
          <CardDescription className="text-blue-200">
            Current data usage and storage details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Settings Data:</span>
              <span className="text-white">
                {new Blob([JSON.stringify(settings)]).size} bytes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Local Storage:</span>
              <span className="text-white">
                {Object.keys(localStorage).length} items
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Last Updated:</span>
              <span className="text-white">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSettings;
