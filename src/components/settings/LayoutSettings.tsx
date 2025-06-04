
import React from 'react';
import { Grid, LayoutGrid, Columns, Rows, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';

interface LayoutSettingsProps {
  onSettingsChange: () => void;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = ({ onSettingsChange }) => {
  const { settings, updateLayoutSettings } = useSettings();
  const { layout } = settings;

  const layouts = [
    {
      id: 'grid',
      name: 'Grid Layout',
      icon: Grid,
      description: 'Organize widgets in a flexible grid'
    },
    {
      id: 'masonry',
      name: 'Masonry Layout',
      icon: LayoutGrid,
      description: 'Dynamic heights based on content'
    },
    {
      id: 'columns',
      name: 'Column Layout',
      icon: Columns,
      description: 'Widgets arranged in columns'
    },
    {
      id: 'rows',
      name: 'Row Layout',
      icon: Rows,
      description: 'Widgets stacked in rows'
    }
  ];

  const handleLayoutChange = (layoutId: string) => {
    updateLayoutSettings({ layoutType: layoutId as any });
    onSettingsChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">Layout</h3>
        <p className="text-blue-200">Configure how widgets are arranged on your dashboard</p>
      </div>

      {/* Layout Type */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Layout Type</CardTitle>
          <CardDescription className="text-blue-200">
            Choose how widgets are organized
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layouts.map((layoutOption) => (
              <div
                key={layoutOption.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  layout.layoutType === layoutOption.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={() => handleLayoutChange(layoutOption.id)}
              >
                <div className="flex items-center space-x-3">
                  <layoutOption.icon className="w-6 h-6 text-white" />
                  <div>
                    <h4 className="text-white font-medium">{layoutOption.name}</h4>
                    <p className="text-sm text-gray-300">{layoutOption.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid Settings */}
      {layout.layoutType === 'grid' && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Grid Settings</CardTitle>
            <CardDescription className="text-blue-200">
              Configure grid layout options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-white text-sm mb-3 block">
                Columns: {layout.gridColumns}
              </Label>
              <Slider
                value={[layout.gridColumns]}
                onValueChange={(value) => {
                  updateLayoutSettings({ gridColumns: value[0] });
                  onSettingsChange();
                }}
                max={6}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spacing Settings */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Spacing</CardTitle>
          <CardDescription className="text-blue-200">
            Adjust spacing between widgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-white text-sm mb-3 block">
              Widget Spacing: {layout.spacing}px
            </Label>
            <Slider
              value={[layout.spacing]}
              onValueChange={(value) => {
                updateLayoutSettings({ spacing: value[0] });
                onSettingsChange();
              }}
              max={32}
              min={0}
              step={2}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Layout Options */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Advanced Options</CardTitle>
          <CardDescription className="text-blue-200">
            Fine-tune layout behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Responsive Layout</Label>
              <p className="text-sm text-gray-300">Automatically adjust layout on different screen sizes</p>
            </div>
            <Switch
              checked={layout.responsiveLayout}
              onCheckedChange={(checked) => {
                updateLayoutSettings({ responsiveLayout: checked });
                onSettingsChange();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Fixed Widget Sizes</Label>
              <p className="text-sm text-gray-300">Prevent widgets from resizing automatically</p>
            </div>
            <Switch
              checked={layout.fixedWidgetSizes}
              onCheckedChange={(checked) => {
                updateLayoutSettings({ fixedWidgetSizes: checked });
                onSettingsChange();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Preview */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Maximize2 className="w-5 h-5 mr-2" />
            Layout Preview
          </CardTitle>
          <CardDescription className="text-blue-200">
            Preview of your current layout settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-black/20 rounded-lg">
            {layout.layoutType === 'grid' && (
              <div 
                className="grid gap-2"
                style={{ 
                  gridTemplateColumns: `repeat(${layout.gridColumns}, 1fr)`,
                  gap: `${layout.spacing / 4}px`
                }}
              >
                {Array.from({ length: layout.gridColumns * 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded p-2 text-center text-white text-xs"
                  >
                    Widget {index + 1}
                  </div>
                ))}
              </div>
            )}
            
            {layout.layoutType === 'masonry' && (
              <div className="space-y-2">
                {[1, 2, 1.5, 1, 2.5].map((height, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded p-2 text-center text-white text-xs"
                    style={{ height: `${height * 30}px` }}
                  >
                    Widget {index + 1}
                  </div>
                ))}
              </div>
            )}
            
            {layout.layoutType === 'columns' && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded p-2 text-center text-white text-xs"
                  >
                    Widget {index + 1}
                  </div>
                ))}
              </div>
            )}
            
            {layout.layoutType === 'rows' && (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded p-2 text-center text-white text-xs"
                  >
                    Widget {index + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutSettings;
