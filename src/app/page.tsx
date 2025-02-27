
'use client';

import React, { useState } from 'react';
import { Search, Clock, BookmarkPlus, BookOpen, Rss, MessageCircle } from 'lucide-react';
import JournalTab from './components/JournalTab';
import ContentFeedTab from './components/ContentFeedTab';
import PrivateChatTab from './components/PrivateChatTab';
import SearchTab from './components/SearchTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('response');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'response':
        return <SearchTab />;
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
      <h1 className="text-3xl font-bold mb-8">mtwitt</h1>

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