'use client';

import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Heart, Crown, Feather, Lock, Unlock, Edit3, Palette } from 'lucide-react';

// Define interfaces for component props and state
interface EmailPayload {
  originalText: string;
  tone: string;
  recipient: string;
}

interface PremiumStatus {
  isPremium: boolean;
  enhancementsLimit: number;
  enhancementsCount: number;
}

interface ToneOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const Letter = () => {
  const [originalEmail, setOriginalEmail] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedTone, setSelectedTone] = useState('elegant');
  const [enhancedEmail, setEnhancedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('Correspondance de Luxe');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // Premium status state management
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    enhancementsLimit: 5,
    enhancementsCount: 0
  });
  
  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumCode, setPremiumCode] = useState('');

  // Tone options
  const toneOptions: ToneOption[] = [
    {
      id: 'elegant',
      name: 'Élégant',
      icon: <Crown size={16} />,
      description: 'Raffiné et sophistiqué',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'warm',
      name: 'Chaleureux',
      icon: <Heart size={16} />,
      description: 'Bienveillant et personnel',
      color: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'professional',
      name: 'Professionnel',
      icon: <Feather size={16} />,
      description: 'Courtois et respectueux',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'poetic',
      name: 'Poétique',
      icon: <Sparkles size={16} />,
      description: 'Artistique et inspirant',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  ];

  // Load premium status from memory (no localStorage)
  useEffect(() => {
    // Initialize with default values - in a real app, this would come from an API
  }, []);

  const handleEnhance = async () => {
    if (!originalEmail.trim()) {
      setError('Veuillez entrer le texte de votre email');
      return;
    }
    
    // Check if user can perform enhancement
    if (!premiumStatus.isPremium && premiumStatus.enhancementsCount >= premiumStatus.enhancementsLimit) {
      setShowPremiumModal(true);
      return;
    }
    
    setLoading(true);
    setError('');
    setEnhancedEmail('');
    
    try {
      // Simulate API call for email enhancement
      const selectedToneOption = toneOptions.find(t => t.id === selectedTone);
      
      // Mock enhancement - in production, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let enhanced = '';
      if (selectedTone === 'elegant') {
        enhanced = `Cher${recipient ? ' ' + recipient : ''},\n\nJ'espère que cette missive vous trouve en excellente santé et dans les meilleures dispositions.\n\n${originalEmail}\n\nJe vous prie d'agréer l'expression de mes sentiments les plus distingués.\n\nCordialement,`;
      } else if (selectedTone === 'warm') {
        enhanced = `Bonjour${recipient ? ' ' + recipient : ''},\n\nJ'espère que vous allez bien et que cette journée vous apporte joie et sérénité.\n\n${originalEmail}\n\nJe vous souhaite une excellente continuation et me réjouis de nos prochains échanges.\n\nBien à vous,`;
      } else if (selectedTone === 'professional') {
        enhanced = `Madame, Monsieur${recipient ? ' ' + recipient : ''},\n\nJe me permets de vous adresser ce message dans l'espoir qu'il retiendra votre attention.\n\n${originalEmail}\n\nJe vous remercie par avance pour votre considération et demeure à votre disposition pour tout complément d'information.\n\nCordialement,`;
      } else {
        enhanced = `Âme délicate${recipient ? ', ' + recipient : ''},\n\nComme une plume portée par le vent, ces mots viennent à vous avec tendresse...\n\n${originalEmail}\n\nQue ces lignes trouvent écho dans votre cœur et illuminent votre journée.\n\nAvec toute ma considération,`;
      }
      
      setEnhancedEmail(enhanced);
      
      // Increment enhancement counter for non-premium users
      if (!premiumStatus.isPremium) {
        setPremiumStatus(prev => ({
          ...prev,
          enhancementsCount: prev.enhancementsCount + 1
        }));
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Échec de l\'amélioration du message');
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate premium code
  const handlePremiumCodeSubmit = () => {
    const validCodes = ["LUXURY2025", "PREMIUM123", "ELITE456"];
    
    if (validCodes.includes(premiumCode.trim())) {
      setPremiumStatus({
        isPremium: true,
        enhancementsLimit: Infinity,
        enhancementsCount: 0
      });
      setShowPremiumModal(false);
      setError('');
    } else {
      setError('Code premium invalide');
    }
  };

  // Reset premium status (for testing)
  const resetPremiumStatus = () => {
    setPremiumStatus({
      isPremium: false,
      enhancementsLimit: 5,
      enhancementsCount: 0
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedEmail);
  };

  // Premium Modal component
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-4">
          <Crown className="mx-auto mb-2 text-yellow-500" size={32} />
          <h3 className="text-xl font-bold text-gray-800">Accès Premium Requis</h3>
        </div>
        <p className="text-gray-600 mb-4 text-center">
          Vous avez utilisé vos {premiumStatus.enhancementsLimit} améliorations gratuites. 
          Déverrouillez un accès illimité avec un code premium.
        </p>
        
        <input
          type="text"
          value={premiumCode}
          onChange={(e) => setPremiumCode(e.target.value)}
          placeholder="Entrez votre code premium"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handlePremiumCodeSubmit()}
        />
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setShowPremiumModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
          >
            Annuler
          </button>
          <button 
            onClick={handlePremiumCodeSubmit}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with editable title */}
        <div className="text-center mb-8">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-purple-500 outline-none text-center"
              autoFocus
            />
          ) : (
            <h1 
              className="text-3xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
              <Edit3 size={20} className="text-gray-400" />
            </h1>
          )}
          <p className="text-gray-600">Transformez vos emails en correspondances raffinées</p>
        </div>

        {/* Premium status */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {premiumStatus.isPremium ? (
              <span className="flex items-center text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                <Crown size={14} className="mr-1" />
                Membre Premium
              </span>
            ) : (
              <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                <span className="font-medium mr-1">
                  {premiumStatus.enhancementsCount}/{premiumStatus.enhancementsLimit}
                </span>
                améliorations restantes
              </span>
            )}
          </div>
          
          {!premiumStatus.isPremium && (
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center font-medium"
            >
              <Lock size={14} className="mr-1" />
              Devenir Premium
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Edit3 size={20} />
              Votre message original
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Destinataire (optionnel)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <textarea
                value={originalEmail}
                onChange={(e) => setOriginalEmail(e.target.value)}
                placeholder="Rédigez votre message ici..."
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              
              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisissez le ton souhaité :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedTone === tone.id
                          ? `${tone.color} border-current`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {tone.icon}
                        <span className="font-medium">{tone.name}</span>
                      </div>
                      <div className="text-xs opacity-75">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleEnhance}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading ? 'Amélioration en cours...' : 'Transformer le message'}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Crown size={20} />
              Correspondance raffinée
            </h2>
            
            {enhancedEmail ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                    {enhancedEmail}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Palette size={16} />
                    Copier
                  </button>
                  <button
                    onClick={() => setEnhancedEmail('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <Crown size={48} className="mx-auto mb-4 opacity-50" />
                <p>Votre correspondance transformée apparaîtra ici</p>
                <p className="text-sm mt-2">Ajoutez de l'émotion et de l'élégance à vos messages</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Premium Modal */}
        {showPremiumModal && <PremiumModal />}
        
        {/* Dev reset button */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mt-4">
            <button 
              onClick={resetPremiumStatus}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Réinitialiser (dev only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Letter;
