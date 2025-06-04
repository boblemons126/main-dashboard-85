
import React, { useState } from 'react';
import { Bell, Home, Search, Filter, RefreshCw, Settings, Clock, TrendingUp, Bookmark, Share2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'high' | 'medium' | 'low';
  readTime?: string;
  image?: string;
}

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'notifications'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Enhanced sample data with more visual appeal
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Revolutionary AI Update Transforms Smart Home Experience",
      description: "Discover how our latest AI breakthrough makes your home more intuitive and responsive than ever before. New machine learning algorithms adapt to your daily patterns.",
      category: "Technology",
      timestamp: "2 hours ago",
      isRead: false,
      priority: 'high',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: "Weekend System Maintenance - Enhanced Performance Incoming",
      description: "Scheduled maintenance this Saturday will bring significant performance improvements and new security features to your smart home system.",
      category: "System",
      timestamp: "1 day ago",
      isRead: true,
      priority: 'medium',
      readTime: '2 min read'
    },
    {
      id: 3,
      title: "Critical Security Patch Successfully Applied",
      description: "Your home network is now more secure with our latest security updates. Enhanced encryption and improved firewall protection are now active.",
      category: "Security",
      timestamp: "2 days ago",
      isRead: true,
      priority: 'high',
      readTime: '1 min read'
    },
    {
      id: 4,
      title: "Energy Savings Alert: 15% Reduction This Month",
      description: "Congratulations! Your smart home optimizations have resulted in significant energy savings. See detailed analytics in your dashboard.",
      category: "Energy",
      timestamp: "3 days ago",
      isRead: false,
      priority: 'low',
      readTime: '2 min read'
    },
    {
      id: 5,
      title: "New Weather Integration Features Available",
      description: "Enhanced weather forecasting now includes air quality monitoring, UV index alerts, and personalized outdoor activity recommendations.",
      category: "Weather",
      timestamp: "1 week ago",
      isRead: true,
      priority: 'medium',
      readTime: '4 min read'
    }
  ];

  const categories = ['All', 'Technology', 'System', 'Security', 'Energy', 'Weather'];
  
  const filteredItems = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'news' && ['Technology', 'Weather', 'Energy'].includes(item.category)) ||
                      (activeTab === 'notifications' && ['System', 'Security'].includes(item.category));
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology': return '🚀';
      case 'Security': return '🔒';
      case 'System': return '⚙️';
      case 'Energy': return '⚡';
      case 'Weather': return '🌤️';
      default: return '📰';
    }
  };

  const unreadCount = newsItems.filter(item => !item.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link to="/utilities" className="group p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    News & Updates
                  </h1>
                  <p className="text-blue-200/80">Stay informed with the latest developments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-6 h-6 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Unread Articles</p>
                    <p className="text-2xl font-bold text-white">{unreadCount}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Articles</p>
                    <p className="text-2xl font-bold text-white">{newsItems.length}</p>
                  </div>
                  <Bookmark className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Categories</p>
                    <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, updates, and notifications..."
                className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                {[
                  { key: 'all', label: 'All', icon: '📰' },
                  { key: 'news', label: 'News', icon: '🚀' },
                  { key: 'notifications', label: 'Alerts', icon: '🔔' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.key 
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTab(tab.key as any)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category !== 'All' && (
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                  )}
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="space-y-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${getPriorityColor(item.priority || 'low')} border-l-4`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    {item.image && (
                      <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                            {getCategoryIcon(item.category)} {item.category}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {!item.image && (
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                                {getCategoryIcon(item.category)} {item.category}
                              </span>
                            )}
                            <div className="flex items-center text-white/60 text-sm gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{item.timestamp}</span>
                              </div>
                              {item.readTime && (
                                <span className="text-blue-300">{item.readTime}</span>
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                            {item.title}
                          </h3>
                          
                          <p className="text-white/80 leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                          {!item.isRead && (
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium animate-pulse">
                              New
                            </span>
                          )}
                          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                            <Share2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-all duration-300 hover:scale-105">
                          <span>Read More</span>
                          <span className="text-lg">→</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Bookmark className="w-4 h-4 text-white/60 hover:text-white" />
                          </button>
                          {item.priority === 'high' && (
                            <span className="text-red-400 text-sm font-medium">High Priority</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                  <p className="text-white/60">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
