'use client';

import React, { useState } from 'react';
import { Search, Clock, BookmarkPlus, Share2, Tag, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

const SearchTab = () => {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showThemeInput, setShowThemeInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Sample recommendation requests - now shorter
  const recommendations = [
    // Knowledge & Learning
    'Teach me something interesting today',
    'Help me discover a new word',
    'Explain a complex topic simply',
    'What are three facts most people don t know?',
    
    // Personal Growth
    'Share a motivational quote for today',
    'Give me a productivity tip',
    'Suggest a mindfulness practice',
    'How can I develop a new habit?',
    
    // Creative & Entertainment
    'Recommend an interesting book to read',
    'Suggest a podcast worth listening to',
    'Help me write a better social media bio',
    'Generate a creative project idea',
    
    // Lifestyle
    'Quick healthy recipe ideas',
    'Tips for better sleep',
    'Fun weekend activity suggestions',
    'How to make my home office more comfortable',
    
    // Fun Interactions
    'Tell me a joke',
    'Create a fun riddle',
    'Would you rather questions for friends',
    'What music matches my current mood?'
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      // Create the search payload with query and optional theme
      const searchPayload = {
        message: theme ? `${query} [Theme focus: ${theme}]` : query,
      };
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }
      
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch response');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation) => {
    setQuery(recommendation);
  };

  // Fixed ResponseCard function component without TypeScript errors
  const ResponseCard = ({ text }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Response</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Claude</span>
      </div>
      <div>
        <p className="text-gray-600">{text}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {new Date().toLocaleDateString()}
          </span>
          <div className="space-x-2">
            <button className="text-gray-500 hover:text-gray-700" aria-label="Bookmark">
              <BookmarkPlus size={16} />
            </button>
            <button className="text-gray-500 hover:text-gray-700" aria-label="Share">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main search section with integrated theme toggle */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter your query..." 
                disabled={loading}
                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              {/* Theme toggle button inside the search input */}
              <button 
                onClick={() => setShowThemeInput(!showThemeInput)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${theme ? 'text-blue-500' : ''}`}
                aria-label="Toggle theme focus"
              >
                <Tag size={16} />
              </button>
            </div>
            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </button>
          </div>
          
          {/* Collapsible theme input */}
          {showThemeInput && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <Tag size={14} className="text-gray-500 ml-1" />
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Add a theme to focus the response"
                className="flex-1 p-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Recommendations section */}
        <div className="mt-1 mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Lightbulb size={12} className="text-amber-500" />
              <span className="text-xs text-gray-500">Try:</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(recommendations.length / 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentPage === index ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {recommendations.slice(currentPage * 5, (currentPage + 1) * 5).map((rec, index) => (
              <button
                key={index}
                onClick={() => handleRecommendationClick(rec)}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <button
              onClick={() => setCurrentPage(prev => (prev > 0 ? prev - 1 : Math.ceil(recommendations.length / 5) - 1))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => (prev < Math.ceil(recommendations.length / 5) - 1 ? prev + 1 : 0))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {response ? (
        <ResponseCard text={response} />
      ) : (
        <div className="text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-lg">
          <p className="text-sm">Search for something to see results</p>
        </div>
      )}
    </div>
  );
};

export default SearchTab;