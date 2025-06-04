
import React from 'react';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import WidgetManagement from '../components/settings/WidgetManagement';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import LayoutSettings from '../components/settings/LayoutSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import DataSettings from '../components/settings/DataSettings';

const SettingsPage = () => {
  const { saveSettings, resetSettings, hasUnsavedChanges } = useSettings();

  const handleSaveSettings = () => {
    saveSettings();
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-blue-200">Customize your dashboard and widgets</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardContent className="p-6">
            <Tabs defaultValue="widgets" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-black/20">
                <TabsTrigger value="widgets" className="text-white data-[state=active]:bg-blue-600">
                  Widgets
                </TabsTrigger>
                <TabsTrigger value="appearance" className="text-white data-[state=active]:bg-blue-600">
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="layout" className="text-white data-[state=active]:bg-blue-600">
                  Layout
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-600">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="data" className="text-white data-[state=active]:bg-blue-600">
                  Data & Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="widgets" className="space-y-6">
                <WidgetManagement onSettingsChange={() => {}} />
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <AppearanceSettings onSettingsChange={() => {}} />
              </TabsContent>

              <TabsContent value="layout" className="space-y-6">
                <LayoutSettings onSettingsChange={() => {}} />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSettings onSettingsChange={() => {}} />
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <DataSettings onSettingsChange={() => {}} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
