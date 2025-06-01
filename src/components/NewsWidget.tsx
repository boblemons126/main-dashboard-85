
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
}

const NewsWidget = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Smart Home Technology Advances in 2024',
      summary: 'Latest developments in home automation and IoT devices are making homes more efficient and secure.',
      source: 'Tech News',
      publishedAt: '2 hours ago',
      url: '#',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Energy Efficiency Tips for Modern Homes',
      summary: 'How to reduce your energy consumption with smart thermostats and LED lighting systems.',
      source: 'Home & Garden',
      publishedAt: '4 hours ago',
      url: '#',
      category: 'Lifestyle'
    },
    {
      id: '3',
      title: 'Weather Alert: Sunny Week Ahead',
      summary: 'Clear skies and mild temperatures expected throughout the week with no precipitation.',
      source: 'Weather Central',
      publishedAt: '6 hours ago',
      url: '#',
      category: 'Weather'
    },
    {
      id: '4',
      title: 'Home Security Systems Review',
      summary: 'Comprehensive comparison of the latest smart security cameras and alarm systems.',
      source: 'Security Today',
      publishedAt: '8 hours ago',
      url: '#',
      category: 'Security'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Technology', 'Weather', 'Security', 'Lifestyle'];
  
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Simulate news API call
  useEffect(() => {
    const fetchNews = () => {
      console.log('Fetching news articles...');
      // This would be replaced with actual news API call
    };
    
    fetchNews();
    const interval = setInterval(fetchNews, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Weather':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Security':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Lifestyle':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Newspaper className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Latest News</h2>
        </div>
        <div className="flex items-center text-xs text-white/60">
          <Clock className="w-3 h-3 mr-1" />
          <span>Updated 2 min ago</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
              selectedCategory === category
                ? 'bg-blue-500/30 text-blue-200 border-blue-500/50'
                : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News Articles */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <style>
          {`
            .space-y-4::-webkit-scrollbar {
              width: 4px;
            }
            .space-y-4::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
            }
            .space-y-4::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 2px;
            }
            .space-y-4::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          `}
        </style>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/10"
              onClick={() => window.open(article.url, '_blank')}
            >
              {/* Article header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-white/60">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40 ml-3 flex-shrink-0" />
              </div>

              {/* Article content */}
              <p className="text-white/80 text-xs mb-3 line-clamp-2">
                {article.summary}
              </p>

              {/* Category badge */}
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No articles found for this category</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-200 border border-blue-500/30">
          View All News
        </button>
      </div>
    </div>
  );
};

export default NewsWidget;
