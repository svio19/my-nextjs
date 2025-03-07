'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clock, BookmarkPlus, BookOpen, Rss, MessageCircle, Shield, Settings } from 'lucide-react';
import JournalTab from './components/JournalTab';
import ContentFeedTab from './components/ContentFeedTab';
import PrivateChatTab from './components/PrivateChatTab';
import SearchTab from './components/SearchTab';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import CookieConsent from './components/CookieConsent';
import Head from 'next/head';

// Define the interface for CookieConsent props
interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('response');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  
  // Check if the user has already accepted cookies
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    }
  }, []);

  // Fix: Explicitly type the parameter as boolean
  const handleCookieConsent = (accepted: boolean): void => {
    setCookieConsent(accepted);
    localStorage.setItem('cookieConsent', JSON.stringify(accepted));
    
    // If user accepted, initialize analytics services, etc.
    if (accepted) {
      // Initialize analytics services or other cookies
      console.log('Cookies accepted, initializing services');
    }
  };

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
      case 'privacy':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
            <p className="mb-4">Manage how your data is collected and used.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Essential Cookies</h3>
                  <p className="text-sm text-gray-500">Required for basic functionality</p>
                </div>
                <div className="bg-gray-200 px-2 py-1 rounded text-xs">Required</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics</h3>
                  <p className="text-sm text-gray-500">Help us improve our service</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={cookieConsent} 
                    onChange={(e) => handleCookieConsent(e.target.checked)} 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>mtwitt - Your Digital Companion</title>
        <meta name="description" content="mtwitt helps you search, save, and share content that matters to you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">mtwitt</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`p-2 rounded-full ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Privacy Settings"
            >
              <Shield size={18} />
            </button>
            <button 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

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
              aria-current={activeTab === tab.key ? 'page' : undefined}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {renderTabContent()}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} mtwitt. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <button 
                className="text-gray-500 text-sm hover:text-blue-500"
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy Policy
              </button>
              <a href="#terms" className="text-gray-500 text-sm hover:text-blue-500">Terms of Service</a>
              <a href="#contact" className="text-gray-500 text-sm hover:text-blue-500">Contact Us</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />
      )}

      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <CookieConsent 
          onAccept={() => handleCookieConsent(true)} 
          onDecline={() => handleCookieConsent(false)} 
        />
      )}
    </>
  );
}