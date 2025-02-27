'use client';

import React, { useState, useEffect } from 'react';
import { Save, Trash2, Edit, Plus } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function JournalTab() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    if (!currentEntry.title?.trim() && !currentEntry.content?.trim()) {
      return;
    }

    if (editingId) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingId 
          ? { ...entry, ...currentEntry, createdAt: new Date() } 
          : entry
      ));
      setEditingId(null);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentEntry.title || 'Untitled Entry',
        content: currentEntry.content || '',
        createdAt: new Date()
      };
      setEntries([newEntry, ...entries]);
    }

    // Reset current entry
    setCurrentEntry({ title: '', content: '' });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry({ title: entry.title, content: entry.content });
    setEditingId(entry.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Entry Input Section */}
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Entry' : 'New Journal Entry'}
        </h2>
        <input 
          type="text"
          placeholder="Entry Title"
          value={currentEntry.title || ''}
          onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <textarea 
          placeholder="Write your thoughts..."
          value={currentEntry.content || ''}
          onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
          rows={8}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <div className="flex justify-between">
          <button 
            onClick={handleSaveEntry}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Save size={16} />
            {editingId ? 'Update' : 'Save'}
          </button>
          {editingId && (
            <button 
              onClick={() => {
                setCurrentEntry({ title: '', content: '' });
                setEditingId(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Entries List Section */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          My Journal Entries ({entries.length})
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No journal entries yet</p>
            <p className="text-sm mt-2">Start by writing your first entry!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{entry.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {entry.createdAt.toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-600 line-clamp-3">
                    {entry.content}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditEntry(entry)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}