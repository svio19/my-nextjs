'use client';

import React, { useState } from 'react';
import { Search, Clock, BookmarkPlus, Share2, BookOpen, Rss, MessageCircle } from 'lucide-react';
import JournalTab from './components/JournalTab';
import ContentFeedTab from './components/ContentFeedTab';
import PrivateChatTab from './components/PrivateChatTab';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('response');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch response');
      }
    } finally {
      setLoading(false);
    }
  };

  const ResponseCard = ({ text }: { text: string }) => (
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
            <button className="text-gray-500 hover:text-gray-700">
              <BookmarkPlus size={16} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'response':
        return (
          <div>
            <div className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your query..."
                  disabled={loading}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {response ? (
              <ResponseCard text={response} />
            ) : (
              <p className="text-gray-500 text-center py-8">No response yet</p>
            )}
          </div>
        );
      case 'history':
        return (
          <p className="text-gray-500 text-center py-8">No search history available</p>
        );
      case 'saved':
        return (
          <p className="text-gray-500 text-center py-8">No saved responses</p>
        );
      case 'journal':
        return <JournalTab />;
      case 'content':
        return <ContentFeedTab />;
      case 'chat':
        return <PrivateChatTab />;
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Assistant</h1>

      <div className="flex gap-4 mb-6 overflow-x-auto">
        {[
          { key: 'response', icon: Search, label: 'Search' },
          { key: 'history', icon: Clock, label: 'History' },
          { key: 'saved', icon: BookmarkPlus, label: 'Saved' },
          { key: 'journal', icon: BookOpen, label: 'Journal' },
          { key: 'content', icon: Rss, label: 'Content' },
          { key: 'chat', icon: MessageCircle, label: 'Chat' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {renderTabContent()}
      </div>
    </main>
  );
}