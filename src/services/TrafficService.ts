
export interface TrafficItem {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'low' | 'medium' | 'high';
  type: 'accident' | 'construction' | 'congestion' | 'closure';
  description: string;
  timestamp: Date;
  estimatedClearTime?: Date;
}

export class TrafficService {
  static async getTrafficData(location?: { lat: number; lng: number }): Promise<TrafficItem[]> {
    // Mock data for now - in a real app this would fetch from a traffic API
    return [
      {
        id: '1',
        location: { lat: 40.7128, lng: -74.0060 },
        severity: 'high',
        type: 'accident',
        description: 'Multi-vehicle accident on Highway 101',
        timestamp: new Date(),
        estimatedClearTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        id: '2',
        location: { lat: 40.7589, lng: -73.9851 },
        severity: 'medium',
        type: 'construction',
        description: 'Road construction causing delays',
        timestamp: new Date(),
        estimatedClearTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
      },
      {
        id: '3',
        location: { lat: 40.7505, lng: -73.9934 },
        severity: 'low',
        type: 'congestion',
        description: 'Heavy traffic during rush hour',
        timestamp: new Date()
      }
    ];
  }

  static getSeverityColor(severity: TrafficItem['severity']): string {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }
}
