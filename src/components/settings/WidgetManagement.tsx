import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Settings as SettingsIcon, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from '@/contexts/SettingsContext';
import WeatherSettings from './widgets/WeatherSettings';

interface Widget {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  configurable: boolean;
}

interface WidgetManagementProps {
  onSettingsChange: () => void;
}

const WidgetManagement: React.FC<WidgetManagementProps> = ({ onSettingsChange }) => {
  const { settings, updateWidgetSettings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configureWidget, setConfigureWidget] = useState<string | null>(null);

  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = settings.widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    );
    
    // If widget doesn't exist in settings, add it
    if (!settings.widgets.find(w => w.id === widgetId)) {
      updatedWidgets.push({
        id: widgetId,
        enabled: true,
        position: settings.widgets.length
      });
    }
    
    updateWidgetSettings(updatedWidgets);
    onSettingsChange();
  };

  // Function to render widget settings based on widget ID
  const renderWidgetSettings = (widgetId: string) => {
    switch (widgetId) {
      case 'weather':
        return <WeatherSettings onSettingsChange={onSettingsChange} />;
      // Add cases for other widgets here
      default:
        return null;
    }
  };

  const widgetDefinitions: Widget[] = [
    {
      id: 'weather',
      name: 'Weather Widget',
      description: 'Display current weather and forecast',
      enabled: settings.widgets.find(w => w.id === 'weather')?.enabled ?? true,
      category: 'Information',
      configurable: true
    },
    {
      id: 'calendar',
      name: 'Calendar Widget',
      description: 'Show upcoming events and appointments',
      enabled: settings.widgets.find(w => w.id === 'calendar')?.enabled ?? true,
      category: 'Productivity',
      configurable: true
    },
    {
      id: 'news',
      name: 'News Widget',
      description: 'Latest news and headlines',
      enabled: settings.widgets.find(w => w.id === 'news')?.enabled ?? true,
      category: 'Information',
      configurable: true
    },
    {
      id: 'time',
      name: 'Time Widget',
      description: 'Current time and timezone',
      enabled: settings.widgets.find(w => w.id === 'time')?.enabled ?? true,
      category: 'Utility',
      configurable: false
    },
    {
      id: 'traffic',
      name: 'Traffic Widget',
      description: 'Real-time traffic information',
      enabled: settings.widgets.find(w => w.id === 'traffic')?.enabled ?? false,
      category: 'Information',
      configurable: true
    },
    {
      id: 'stocks',
      name: 'Stock Market Widget',
      description: 'Track your favorite stocks',
      enabled: settings.widgets.find(w => w.id === 'stocks')?.enabled ?? false,
      category: 'Finance',
      configurable: true
    }
  ];

  const categories = ['all', 'Information', 'Productivity', 'Utility', 'Finance'];

  const filteredWidgets = selectedCategory === 'all' 
    ? widgetDefinitions 
    : widgetDefinitions.filter(widget => widget.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">Widget Management</h3>
        <p className="text-blue-200">Control which widgets appear on your dashboard</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category 
              ? "bg-blue-600 text-white" 
              : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Available Widgets */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Available Widgets
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Widget
            </Button>
          </CardTitle>
          <CardDescription className="text-blue-200">
            Enable or disable widgets to customize your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredWidgets.map((widget) => (
            <div 
              key={widget.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-medium">{widget.name}</h4>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                      {widget.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{widget.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {widget.configurable && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setConfigureWidget(widget.id)}
                  >
                    <SettingsIcon className="w-4 h-4" />
                  </Button>
                )}
                
                <div className="flex items-center space-x-2">
                  {widget.enabled ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  <Switch
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Widget Settings Dialog */}
      <Dialog open={configureWidget !== null} onOpenChange={() => setConfigureWidget(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Widget Settings</DialogTitle>
          </DialogHeader>
          {configureWidget && renderWidgetSettings(configureWidget)}
        </DialogContent>
      </Dialog>

      {/* Widget Order */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Widget Order</CardTitle>
          <CardDescription className="text-blue-200">
            Drag and drop to reorder widgets on your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgetDefinitions.filter(w => w.enabled).map((widget, index) => (
              <div 
                key={widget.id}
                className="p-3 bg-white/10 rounded-lg border border-white/20 cursor-move hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                  <span className="text-white font-medium">{widget.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetManagement;
