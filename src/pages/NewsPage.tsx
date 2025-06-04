import React, { useState } from 'react';
import { Bell, Home, Search, Filter, RefreshCw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  isRead: boolean;
}

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'notifications'>('news');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - in a real app, this would come from an API
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "New Feature Release",
      description: "We've just launched our latest feature update with improved performance.",
      category: "Updates",
      timestamp: "2 hours ago",
      isRead: false
    },
    {
      id: 2,
      title: "System Maintenance",
      description: "Scheduled maintenance will occur on Saturday at 2 AM EST.",
      category: "System",
      timestamp: "1 day ago",
      isRead: true
    },
    {
      id: 3,
      title: "Security Update",
      description: "Important security patches have been applied to your account.",
      category: "Security",
      timestamp: "2 days ago",
      isRead: true
    }
  ];

  const filteredItems = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/utilities" className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 flex items-center justify-center">
                  <Home className="w-6 h-6" />
                  <span className="sr-only">Back to Utilities</span>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">News & Notifications</h1>
                  <p className="text-blue-200">Stay updated with the latest news and alerts</p>
                </div>
              </div>
              <button className="p-3 bg-blue-600/20 rounded-xl text-white hover:bg-blue-600/30">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news and notifications..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600/20 rounded-lg text-white hover:bg-blue-600/30 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
              <button className="px-4 py-2 bg-blue-600/20 rounded-lg text-white hover:bg-blue-600/30 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                activeTab === 'news' ? 'bg-blue-600' : 'bg-white/10'
              }`}
              onClick={() => setActiveTab('news')}
            >
              <Bell className="w-5 h-5" />
              <span>News</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                activeTab === 'notifications' ? 'bg-blue-600' : 'bg-white/10'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
          </div>

          {/* News/Notifications List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  item.isRead ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className="text-sm text-blue-300">{item.timestamp}</span>
                </div>
                <p className="text-gray-300 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                    {item.category}
                  </span>
                  {!item.isRead && (
                    <span className="text-sm px-2 py-1 rounded-full bg-blue-600 text-white">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 