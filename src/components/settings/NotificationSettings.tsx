
import React from 'react';
import { Bell, Mail, Volume2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

interface NotificationSettingsProps {
  onSettingsChange: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSettingsChange }) => {
  const { settings, updateNotificationSettings } = useSettings();
  const { notifications } = settings;

  const handleSettingChange = (key: keyof typeof notifications, value: any) => {
    updateNotificationSettings({ [key]: value });
    onSettingsChange();
  };

  const frequencies = [
    { id: 'immediate', name: 'Immediate', description: 'Get notified right away' },
    { id: 'hourly', name: 'Hourly', description: 'Digest every hour' },
    { id: 'daily', name: 'Daily', description: 'Once per day summary' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">Notifications</h3>
        <p className="text-blue-200">Manage how and when you receive notifications</p>
      </div>

      {/* Notification Types */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Types
          </CardTitle>
          <CardDescription className="text-blue-200">
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Email Notifications</Label>
                <p className="text-sm text-gray-300">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-gray-300">Browser notifications</p>
              </div>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <div>
                <Label className="text-white">Sound Notifications</Label>
                <p className="text-sm text-gray-300">Play sound with notifications</p>
              </div>
            </div>
            <Switch
              checked={notifications.soundEnabled}
              onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Notification Frequency
          </CardTitle>
          <CardDescription className="text-blue-200">
            How often you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frequencies.map((freq) => (
              <div
                key={freq.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  notifications.frequency === freq.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={() => handleSettingChange('frequency', freq.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{freq.name}</h4>
                    <p className="text-sm text-gray-300">{freq.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    notifications.frequency === freq.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Test Notifications</CardTitle>
          <CardDescription className="text-blue-200">
            Send a test notification to verify your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              if (notifications.pushNotifications && 'Notification' in window) {
                new Notification('Test Notification', {
                  body: 'This is a test notification from your dashboard',
                  icon: '/favicon.ico'
                });
              } else {
                alert('Test notification: Your settings are working!');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Test Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
