'use client';

import React, { useState, useEffect } from 'react';
import { Globe, BookmarkPlus, ExternalLink, Rss, Clock, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  savedAt: Date;
  tags?: string[];
}

export default function ContentFeedTab() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    url: '',
    source: '',
    tags: ''
  });
  const [filter, setFilter] = useState('');

  // Load saved content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('savedContent');
    if (savedContent) {
      setContentItems(JSON.parse(savedContent));
    }
  }, []);

  // Save content to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('savedContent', JSON.stringify(contentItems));
  }, [contentItems]);

  const handleAddContent = () => {
    // Validate input
    if (!newItem.title.trim() || !newItem.url.trim()) {
      alert('Please enter a title and URL');
      return;
    }

    const content: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      url: newItem.url,
      source: newItem.source || 'Custom',
      savedAt: new Date(),
      tags: newItem.tags ? newItem.tags.split(',').map(tag => tag.trim()) : []
    };

    setContentItems([content, ...contentItems]);
    
    // Reset form
    setNewItem({
      title: '',
      description: '',
      url: '',
      source: '',
      tags: ''
    });
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(contentItems.filter(item => item.id !== id));
  };

  const filteredItems = contentItems.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.source.toLowerCase().includes(filter.toLowerCase()) ||
    (item.tags && item.tags.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    ))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Content Input Section */}
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
        
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Content Title"
            value={newItem.title}
            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          />
          
          <input 
            type="text"
            placeholder="URL"
            value={newItem.url}
            onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          />
          
          <textarea 
            placeholder="Description (optional)"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full p-2 border rounded-lg"
          />
          
          <div className="flex space-x-2">
            <input 
              type="text"
              placeholder="Source"
              value={newItem.source}
              onChange={(e) => setNewItem(prev => ({ ...prev, source: e.target.value }))}
              className="w-1/2 p-2 border rounded-lg"
            />
            
            <input 
              type="text"
              placeholder="Tags (comma-separated)"
              value={newItem.tags}
              onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
              className="w-1/2 p-2 border rounded-lg"
            />
          </div>
          
          <button 
            onClick={handleAddContent}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Rss size={16} />
            Add Content
          </button>
        </div>
      </div>

      {/* Content List Section */}
      <div className="md:col-span-2">
        {/* Search and Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <input 
            type="text"
            placeholder="Filter content..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <span className="text-gray-500">
            {filteredItems.length} / {contentItems.length} items
          </span>
        </div>

        {/* Content List */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No content saved</p>
            <p className="text-sm mt-2">Start by adding your first content item!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-lg mr-2">{item.title}</h3>
                      {item.tags && item.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mb-2 flex items-center">
                      <Globe size={14} className="mr-2" />
                      {item.source}
                    </p>
                    {item.description && (
                      <p className="text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs flex items-center">
                      <Clock size={12} className="mr-1" />
                      {item.savedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      onClick={() => handleDeleteContent(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}