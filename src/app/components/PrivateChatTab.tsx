'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, MessageCircle, Plus, X, UserPlus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  pseudonym: string;
}

interface Conversation {
  id: string;
  joinId: string;
  title: string;
  messages: Message[];
  lastActive: Date;
  isPrivate: boolean;
  userPseudonym: string;
}

export default function PrivateChatTab() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isJoiningConversation, setIsJoiningConversation] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [showJoinError, setShowJoinError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedConversations = localStorage.getItem('privateChats');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('privateChats', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationId, conversations]);

  const generateJoinId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const generatePseudonym = () => {
    const adjectives = ['Swift', 'Quiet', 'Bright', 'Cool', 'Dark', 'Wild', 'Wise', 'Bold'];
    const nouns = ['Fox', 'Wolf', 'Eagle', 'Bear', 'Lion', 'Hawk', 'Tiger', 'Owl'];
    const randomNum = Math.floor(Math.random() * 100);
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
  };

  const createNewConversation = () => {
    if (!newConversationTitle.trim()) {
      alert('Please enter a conversation title');
      return;
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      joinId: generateJoinId(),
      title: newConversationTitle,
      messages: [],
      lastActive: new Date(),
      isPrivate: true,
      userPseudonym: generatePseudonym()
    };

    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    setNewConversationTitle('');
    setIsCreatingConversation(false);
  };

  const joinConversation = () => {
    const conversationToJoin = conversations.find(
      conv => conv.joinId.toLowerCase() === joinId.toLowerCase()
    );

    if (conversationToJoin) {
      // If not already joined, create a new pseudonym for this user
      if (!conversations.some(conv => conv.id === conversationToJoin.id)) {
        const joinedConversation = {
          ...conversationToJoin,
          userPseudonym: generatePseudonym()
        };
        setConversations(prev => [joinedConversation, ...prev.filter(c => c.id !== conversationToJoin.id)]);
      }
      setActiveConversationId(conversationToJoin.id);
      setJoinId('');
      setIsJoiningConversation(false);
      setShowJoinError(false);
    } else {
      setShowJoinError(true);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return;

    const activeConv = conversations.find(conv => conv.id === activeConversationId);
    if (!activeConv) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      pseudonym: activeConv.userPseudonym
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastActive: new Date()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: `You said: "${newMessage}". This is a placeholder AI response.`,
        sender: 'ai',
        timestamp: new Date(),
        pseudonym: 'AI Assistant'
      };

      const finalUpdatedConversations = updatedConversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage],
            lastActive: new Date()
          };
        }
        return conv;
      });

      setConversations(finalUpdatedConversations);
    }, 500);
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    
    if (id === activeConversationId) {
      setActiveConversationId(updatedConversations.length > 0 ? updatedConversations[0].id : null);
    }
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Conversations List */}
      <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Private Chats</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsJoiningConversation(!isJoiningConversation)}
              className="text-green-500 hover:text-green-700"
              title="Join Chat"
            >
              <UserPlus size={20} />
            </button>
            <button 
              onClick={() => setIsCreatingConversation(!isCreatingConversation)}
              className="text-blue-500 hover:text-blue-700"
              title="New Chat"
            >
              {isCreatingConversation ? <X size={20} /> : <Plus size={20} />}
            </button>
          </div>
        </div>

        {isJoiningConversation && (
          <div className="mb-4">
            <div className="flex mb-2">
              <input 
                type="text"
                placeholder="Enter Chat ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="flex-1 p-2 border rounded-l-lg"
                onKeyPress={(e) => e.key === 'Enter' && joinConversation()}
              />
              <button 
                onClick={joinConversation}
                className="bg-green-500 text-white px-4 rounded-r-lg hover:bg-green-600"
              >
                Join
              </button>
            </div>
            {showJoinError && (
              <div className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded">
                Chat ID not found. Please check and try again.
              </div>
            )}
          </div>
        )}

        {isCreatingConversation && (
          <div className="mb-4 flex">
            <input 
              type="text"
              placeholder="Conversation Title"
              value={newConversationTitle}
              onChange={(e) => setNewConversationTitle(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg"
              onKeyPress={(e) => e.key === 'Enter' && createNewConversation()}
            />
            <button 
              onClick={createNewConversation}
              className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        )}

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No conversations. Create or join one!
          </p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div 
                key={conv.id}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
                  activeConversationId === conv.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-gray-200'
                }`}
              >
                <div 
                  onClick={() => setActiveConversationId(conv.id)}
                  className="flex-1"
                >
                  <h3 className="font-medium">{conv.title}</h3>
                  <p className="text-xs text-gray-500">
                    ID: {conv.joinId}
                  </p>
                  <p className="text-xs text-gray-500">
                    You: {conv.userPseudonym}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(conv.lastActive).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => deleteConversation(conv.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="md:col-span-2 bg-white rounded-lg border">
        {activeConversation ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gray-100 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{activeConversation.title}</h2>
                  <p className="text-sm text-gray-500">Your pseudonym: {activeConversation.userPseudonym}</p>
                </div>
                <span className="text-sm text-gray-500">ID: {activeConversation.joinId}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                activeConversation.messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${
                      msg.sender === 'user' 
                        ? 'justify-end' 
                        : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      <p className="text-xs opacity-70 mb-1">{msg.pseudonym}</p>
                      <p>{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t flex space-x-2">
              <input 
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 border rounded-lg"
              />
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a conversation or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}