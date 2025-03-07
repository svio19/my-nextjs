'use client';
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clock, BookmarkPlus, Share2, Tag, Lightbulb, Lock, Unlock } from 'lucide-react';
import RecommendationsCarousel from './RecommendationsCarousel';

// Define interfaces for component props
interface ResponseCardProps {
  text: string;
}

interface SearchPayload {
  message: string;
}

// Interface pour le statut premium
interface PremiumStatus {
  isPremium: boolean;
  requestsLimit: number;
  requestsCount: number;
}

const SearchTab = () => {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showThemeInput, setShowThemeInput] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  
  // État pour gérer le compte des requêtes et le statut premium
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    requestsLimit: 5,
    requestsCount: 0
  });
  
  // État pour la modal du code premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumCode, setPremiumCode] = useState('');

  // Charger le compteur de requêtes du localStorage au démarrage
  useEffect(() => {
    const savedPremiumStatus = localStorage.getItem('premiumStatus');
    if (savedPremiumStatus) {
      setPremiumStatus(JSON.parse(savedPremiumStatus));
    }
  }, []);

  // Sauvegarder les changements du statut premium dans le localStorage
  useEffect(() => {
    localStorage.setItem('premiumStatus', JSON.stringify(premiumStatus));
  }, [premiumStatus]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    // Vérifier si l'utilisateur peut effectuer la recherche
    if (!premiumStatus.isPremium && premiumStatus.requestsCount >= premiumStatus.requestsLimit) {
      setShowPremiumModal(true);
      return;
    }
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      // Créer le payload de recherche avec la requête et le thème optionnel
      const searchPayload: SearchPayload = {
        message: theme ? `${query} [Thème: ${theme}]` : query,
      };
      
      setLastQuery(query);
      
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
      
      // Incrémenter le compteur de requêtes si l'utilisateur n'est pas premium
      if (!premiumStatus.isPremium) {
        setPremiumStatus(prev => ({
          ...prev,
          requestsCount: prev.requestsCount + 1
        }));
      }
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

  const handleRecommendationClick = (recommendation: string) => {
    setQuery(recommendation);
  };

  // Valider le code premium
  const handlePremiumCodeSubmit = () => {
    // Code premium de démonstration: "PREMIUM123"
    if (premiumCode === "PREMIUM123") {
      setPremiumStatus({
        isPremium: true,
        requestsLimit: Infinity,
        requestsCount: 0
      });
      setShowPremiumModal(false);
      setError('');
    } else {
      setError('Code premium invalide');
    }
  };

  // Fonction pour réinitialiser le statut premium (pour les tests)
  const resetPremiumStatus = () => {
    setPremiumStatus({
      isPremium: false,
      requestsLimit: 5,
      requestsCount: 0
    });
  };

  // ResponseCard component
  const ResponseCard = ({ text }: ResponseCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Réponse</h3>
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

  // Modal pour le code premium
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Accès Premium Requis</h3>
        <p className="mb-4">Vous avez atteint votre limite de {premiumStatus.requestsLimit} recherches. Entrez un code premium pour continuer.</p>
        
        <input
          type="text"
          value={premiumCode}
          onChange={(e) => setPremiumCode(e.target.value)}
          placeholder="Entrez votre code premium"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setShowPremiumModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button 
            onClick={handlePremiumCodeSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Indicateur du statut premium et compteur de requêtes */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {premiumStatus.isPremium ? (
            <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded text-sm">
              <Unlock size={14} className="mr-1" />
              Accès Premium
            </span>
          ) : (
            <span className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
              <span className="font-medium mr-1">
                {premiumStatus.requestsCount}/{premiumStatus.requestsLimit}
              </span>
              recherches restantes
            </span>
          )}
        </div>
        
        {/* Bouton pour devenir premium */}
        {!premiumStatus.isPremium && (
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Lock size={14} className="mr-1" />
            Accès Premium
          </button>
        )}
        
        {/* Bouton de réinitialisation (à enlever en production) */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={resetPremiumStatus}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Réinitialiser (dev only)
          </button>
        )}
      </div>

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
                placeholder="Entrez votre question..." 
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
              Rechercher
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
                placeholder="Ajouter un thème pour orienter la réponse"
                className="flex-1 p-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Recommendations component */}
        <RecommendationsCarousel 
          onRecommendationClick={handleRecommendationClick} 
          userQuery={lastQuery}
        />
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
          <p className="text-sm">Recherchez quelque chose pour voir les résultats</p>
        </div>
      )}

      {/* Modal pour le code premium */}
      {showPremiumModal && <PremiumModal />}
    </div>
  );
};

export default SearchTab;