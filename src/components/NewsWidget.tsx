import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, Eye, AlertCircle, Bell } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
  urlToImage?: string;
  category?: string;
}

interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
}

type ContentType = 'news' | 'alerts';

const NEWS_SOURCES = [
  {
    name: 'Sky News',
    url: 'https://feeds.skynews.com/feeds/rss/home.xml',
    defaultImage: 'https://news.sky.com/resources/sky-news-logo.png'
  },
  {
    name: 'Cornwall Live',
    url: 'https://www.cornwalllive.com/news/?service=rss',
    defaultImage: 'https://i2-prod.cornwalllive.com/incoming/article1162068.ece/ALTERNATES/s615/cornwalllive.jpg'
  },
  {
    name: 'Devon Live',
    url: 'https://www.devonlive.com/news/?service=rss',
    defaultImage: 'https://i2-prod.devonlive.com/incoming/article1162065.ece/ALTERNATES/s615/devonlive.jpg'
  }
];

interface CategoryPreference {
  category: string;
  clicks: number;
  lastClicked: number;
}

const processTitleForDisplay = (title: string) => {
  // First, clean up common RSS feed prefixes and suffixes
  let cleanTitle = title
    .replace(/^(BREAKING:|Breaking:|UPDATE:|Update:|LIVE:|Live:)\s*/g, '')
    .replace(/\s*\|.*$/, '') // Remove everything after pipe
    .replace(/\s*-\s*[^-]*$/, '') // Remove source name after dash
    .replace(/\s*\([^)]*\)/g, '') // Remove parenthetical phrases
    .replace(/\s*\[[^\]]*\]/g, '') // Remove bracketed content
    .trim();

  // Remove redundant location prefixes
  cleanTitle = cleanTitle
    .replace(/^(Cornwall|Devon|UK|South West):\s*/g, '')
    .replace(/^In (Cornwall|Devon|the South West)\s*[:,-]\s*/g, '')
    .trim();

  // Remove common filler phrases
  const fillerPhrases = [
    'here\'s what we know',
    'what you need to know',
    'everything you need to know',
    'latest updates',
    'find out more',
    'read more',
    'see pictures',
    'see photos',
    'in pictures',
    'full story',
    'latest news',
    'due to',
    'following',
    'after',
    'amid',
    'as'
  ];

  fillerPhrases.forEach(phrase => {
    const regex = new RegExp(`\\s*-?\\s*${phrase}\\s+`, 'gi');
    cleanTitle = cleanTitle.replace(regex, ' ');
  });

  // Remove common ending phrases
  cleanTitle = cleanTitle
    .replace(/\s+(?:following|amid|after|due to).*$/i, '')
    .replace(/\s+as\s+.*$/i, '');

  // Remove redundant words and simplify
  cleanTitle = cleanTitle
    .replace(/police\s+incident/gi, 'incident')
    .replace(/major\s+/gi, '')
    .replace(/breaking\s+/gi, '')
    .replace(/urgent\s+/gi, '')
    .replace(/\s+issues?\s+/gi, ' ')
    .replace(/\s+warning\s+/gi, ' ')
    .replace(/\s+alert\s+/gi, ' ')
    .replace(/\s+update\s+/gi, ' ')
    .trim();

  // Capitalize first letter of each word for better readability
  return cleanTitle.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const NewsWidget = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<ContentType>('news');
  const [categoryPreferences, setCategoryPreferences] = useState<CategoryPreference[]>(() => {
    const saved = localStorage.getItem('newsPreferences');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (activeContent === 'news') {
      fetchNews();
    }
  }, [activeContent]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('newsPreferences', JSON.stringify(categoryPreferences));
  }, [categoryPreferences]);

  const handleArticleClick = (article: NewsArticle) => {
    if (article.category) {
      const now = Date.now();
      setCategoryPreferences(prev => {
        const existing = prev.find(p => p.category.toLowerCase() === article.category?.toLowerCase());
        if (existing) {
          return prev.map(p => 
            p.category.toLowerCase() === article.category?.toLowerCase()
              ? { ...p, clicks: p.clicks + 1, lastClicked: now }
              : p
          );
        }
        return [...prev, { category: article.category, clicks: 1, lastClicked: now }];
      });
    }
    window.open(article.url, '_blank');
  };

  const getRecommendedCategories = (): string[] => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return categoryPreferences
      .filter(pref => pref.lastClicked > oneWeekAgo && pref.clicks >= 2)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 3)
      .map(pref => pref.category);
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allArticles = await Promise.all(
        NEWS_SOURCES.map(async (source) => {
          try {
            const response = await fetch(
              `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`
            );
            
            if (!response.ok) {
              throw new Error(`Failed to fetch ${source.name} news`);
            }
            
            const xmlText = await response.text();
            return parseXMLToArticles(xmlText, source.name, source.defaultImage);
          } catch (err) {
            console.error(`Error fetching ${source.name} news:`, err);
            return [];
          }
        })
      );
      
      // Combine and sort articles by date
      const combinedArticles = allArticles
        .flat()
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6);
      
      if (combinedArticles.length === 0) {
        throw new Error('No news articles available');
      }
      
      setArticles(combinedArticles);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      
      // Fallback to mock data if API fails
      const mockArticles = [
        {
          id: '1',
          title: 'Breaking: Major Cornwall News Story',
          originalTitle: 'Breaking: Major Cornwall News Story',
          description: 'Latest breaking news from Cornwall.',
          source: { name: 'Cornwall Live' },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          url: 'https://www.cornwalllive.com',
          urlToImage: 'https://i2-prod.cornwalllive.com/incoming/article1162068.ece/ALTERNATES/s615/cornwalllive.jpg',
          category: 'News'
        },
        {
          id: '2',
          title: 'Global Climate Summit Reaches Historic Agreement',
          originalTitle: 'Global Climate Summit Reaches Historic Agreement',
          description: 'World leaders unite on ambitious climate goals for the next decade.',
          source: { name: 'Environmental Times' },
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          url: 'https://example.com/climate-summit',
          urlToImage: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=200&fit=crop',
          category: 'Environment'
        },
        {
          id: '3',
          title: 'Stock Markets Show Strong Performance',
          originalTitle: 'Stock Markets Show Strong Performance',
          description: 'Markets continue upward trend as investors remain optimistic about economic recovery.',
          source: { name: 'Financial Daily' },
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          url: 'https://example.com/market-performance',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          category: 'Finance'
        },
        {
          id: '4',
          title: 'New Space Mission Launches Successfully',
          originalTitle: 'New Space Mission Launches Successfully',
          description: 'NASA launches ambitious mission to explore distant planets.',
          source: { name: 'Space Explorer' },
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          url: 'https://example.com/space-mission',
          urlToImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop',
          category: 'Science'
        },
        {
          id: '5',
          title: 'Healthcare Innovation Shows Promise',
          originalTitle: 'Healthcare Innovation Shows Promise',
          description: 'New medical breakthrough could help millions of patients worldwide.',
          source: { name: 'Medical Journal' },
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          url: 'https://example.com/healthcare-innovation',
          urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
          category: 'Health'
        },
        {
          id: '6',
          title: 'Education Technology Transforms Learning',
          originalTitle: 'Education Technology Transforms Learning',
          description: 'Revolutionary platform makes education more accessible globally.',
          source: { name: 'Education Today' },
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          url: 'https://example.com/education-tech',
          urlToImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop',
          category: 'Education'
        }
      ];
      
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const getTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  };

  const parseXMLToArticles = (xmlText: string, sourceName: string, defaultImage: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    return Array.from(items).map((item) => {
      const getElementText = (elementName: string) => 
        item.querySelector(elementName)?.textContent || '';
      
      // Handle different image tag formats
      let imageUrl = defaultImage;
      const mediaContent = item.getElementsByTagName('media:content')[0];
      const enclosure = item.querySelector('enclosure');
      
      if (mediaContent?.getAttribute('url')) {
        imageUrl = mediaContent.getAttribute('url') || defaultImage;
      } else if (enclosure?.getAttribute('url')) {
        imageUrl = enclosure.getAttribute('url') || defaultImage;
      }
      
      // Extract image from description if no media tags found
      if (imageUrl === defaultImage) {
        const description = getElementText('description');
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
      
      const originalTitle = getElementText('title');
      const processedTitle = processTitleForDisplay(originalTitle);
      
      return {
        id: `${sourceName}-${Date.now()}-${Math.random()}`,
        title: processedTitle,
        originalTitle,
        description: getElementText('description').replace(/<[^>]*>/g, ''), // Remove HTML tags
        source: { name: sourceName },
        publishedAt: getElementText('pubDate'),
        url: getElementText('link'),
        urlToImage: imageUrl,
        category: getElementText('category') || 'News'
      };
    });
  };

  const renderContentIcon = (type: ContentType) => {
    switch (type) {
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      case 'alerts':
        return <Bell className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 h-fit relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
        <div className="animate-pulse relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-white/20 rounded w-32"></div>
            <div className="h-6 bg-white/20 rounded w-20"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 h-fit relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
        <div className="text-center relative z-10">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">News Unavailable</h3>
          <p className="text-white/70 text-sm mb-4">{error}</p>
          <button 
            onClick={handleRefresh} 
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 h-fit relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl">
                {renderContentIcon(activeContent)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {activeContent === 'news' && 'Latest News'}
                  {activeContent === 'alerts' && 'System Alerts'}
                </h2>
                <p className="text-white/60 text-xs">
                  {activeContent === 'news' && 'Sky News • Cornwall • Devon'}
                  {activeContent === 'alerts' && 'Important Notifications'}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['news', 'alerts'] as ContentType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveContent(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeContent === type
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                }`}
              >
                {renderContentIcon(type)}
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
          <style>
            {`
              .space-y-3::-webkit-scrollbar {
                width: 4px;
              }
              .space-y-3::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
              }
              .space-y-3::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5));
                border-radius: 2px;
              }
              .space-y-3::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7));
              }
            `}
          </style>
          {activeContent === 'news' && (
            articles.length > 0 ? (
              articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 hover:scale-[1.01]"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex gap-3 w-full">
                    {/* Image */}
                    {article.urlToImage && (
                      <div className="flex-shrink-0">
                        <img 
                          src={article.urlToImage} 
                          alt={article.title}
                          className="w-14 h-14 rounded-md object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-between h-14">
                      <div className="flex items-start gap-2">
                        <h3 
                          className="text-white font-medium text-sm leading-snug group-hover:text-indigo-300 transition-colors"
                          title={article.originalTitle}
                        >
                          {article.title}
                        </h3>
                        <ExternalLink className="w-3.5 h-3.5 text-white/40 flex-shrink-0 group-hover:text-white/60 mt-0.5" />
                      </div>
                      
                      <div className="flex items-center text-xs text-white/50">
                        <span className="font-medium truncate max-w-[80px]">{article.source.name}</span>
                        <span className="mx-1.5 flex-shrink-0">•</span>
                        <span className="flex-shrink-0">{getTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-6">
                <Eye className="w-10 h-10 text-white/30 mx-auto mb-2" />
                <p className="text-white/60 text-sm">No news articles available</p>
              </div>
            )
          )}

          {activeContent === 'alerts' && (
            <div className="text-center py-6">
              <Bell className="w-10 h-10 text-white/30 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Alert system coming soon</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <button 
            onClick={() => {
              if (activeContent === 'news') window.open('https://news.sky.com', '_blank');
            }}
            className="w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 border border-indigo-500/30 hover:border-indigo-500/50"
          >
            {activeContent === 'news' && 'View More News'}
            {activeContent === 'alerts' && 'Manage Alerts'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsWidget;
