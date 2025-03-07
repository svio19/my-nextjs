'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface RecommendationsCarouselProps {
  onRecommendationClick: (recommendation: string) => void;
  userQuery?: string; // Paramètre optionnel pour générer des recommandations dynamiques
}

const RecommendationsCarousel: React.FC<RecommendationsCarouselProps> = ({ 
  onRecommendationClick,
  userQuery
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeRecommendations, setActiveRecommendations] = useState<string[]>([]);
  
  // Recommandations de base catégorisées en français
  const baseRecommendations = {
    connaissance: [
      'Apprenez-moi quelque chose d\'intéressant',
      'Expliquez-moi un sujet complexe simplement',
      'Quels sont trois faits peu connus?',
      'Parlez-moi des dernières découvertes scientifiques',
      'Comment fonctionne l\'intelligence artificielle?'
    ],
    personnel: [
      'Partagez une citation motivante pour aujourd\'hui',
      'Donnez-moi un conseil de productivité',
      'Suggérez une pratique de pleine conscience',
      'Comment développer une nouvelle habitude?',
      'Aidez-moi à fixer des objectifs significatifs'
    ],
    créatif: [
      'Recommandez-moi un livre intéressant',
      'Suggérez un podcast à écouter',
      'Aidez-moi à améliorer ma bio sur les réseaux sociaux',
      'Générez une idée de projet créatif',
      'Proposez un sujet d\'écriture inspirant'
    ],
    lifestyle: [
      'Idées de recettes rapides et saines',
      'Conseils pour mieux dormir',
      'Suggestions d\'activités pour le weekend',
      'Comment rendre mon bureau à domicile plus confortable',
      'Recommandez un programme d\'exercices'
    ],
    divertissement: [
      'Racontez-moi une blague',
      'Créez une énigme amusante',
      'Questions "préférez-vous" pour amis',
      'Quelle musique correspond à mon humeur actuelle?',
      'Partagez un fait amusant sur les animaux'
    ],
    technologie: [
      'Expliquez un concept technologique simplement',
      'Astuces pour l\'organisation numérique',
      'Aidez-moi à comprendre la blockchain',
      'Quoi de neuf dans la technologie des smartphones?',
      'Apprenez-moi un raccourci clavier utile'
    ],
    cuisine: [
      'Idées de plats français traditionnels',
      'Comment faire une bonne pâte à crêpes?',
      'Recette facile de quiche lorraine',
      'Conseils pour la pâtisserie française',
      'Suggestions de vins pour un dîner'
    ],
    voyage: [
      'Meilleures destinations en France hors des sentiers battus',
      'Conseils pour voyager à petit budget',
      'Que visiter à Paris en 2 jours?',
      'Recommandations de voyage écologique',
      'Expressions utiles pour voyager à l\'étranger'
    ]
  };
  
  // Fonction pour générer des recommandations dynamiques basées sur la requête de l'utilisateur
  const generateDynamicRecommendations = (query: string): string[] => {
    if (!query) return [];
    
    // Analyser la requête pour des mots-clés
    const query_lower = query.toLowerCase();
    
    // Recommandations basées sur des thèmes spécifiques
    if (query_lower.includes('travail') || query_lower.includes('emploi') || query_lower.includes('carrière')) {
      return [
        'Comment améliorer l\'équilibre travail-vie personnelle',
        'Conseils pour le télétravail efficace',
        'Comment demander une promotion',
        'Gérer le stress au travail',
        'Meilleures pratiques pour le réseautage professionnel'
      ];
    }
    
    if (query_lower.includes('apprendre') || query_lower.includes('étudier') || query_lower.includes('éducation')) {
      return [
        'Techniques d\'étude efficaces',
        'Comment apprendre une nouvelle langue rapidement',
        'Meilleurs cours en ligne pour débutants',
        'Techniques d\'amélioration de la mémoire',
        'Comment rester motivé pendant l\'apprentissage'
      ];
    }
    
    if (query_lower.includes('santé') || query_lower.includes('fitness') || query_lower.includes('exercice')) {
      return [
        'Idées d\'entraînement rapide de 10 minutes',
        'Habitudes saines à commencer aujourd\'hui',
        'Aliments qui augmentent le niveau d\'énergie',
        'Comment suivre vos progrès de fitness',
        'Techniques de méditation pour débutants'
      ];
    }
    
    if (query_lower.includes('cuisine') || query_lower.includes('recette') || query_lower.includes('nourriture')) {
      return [
        'Idées de repas faciles en 15 minutes',
        'Comment préparer des repas à l\'avance',
        'Techniques de cuisine essentielles',
        'Recettes de petit-déjeuner sain',
        'Plats internationaux à essayer chez soi'
      ];
    }
    
    if (query_lower.includes('voyage') || query_lower.includes('vacances') || query_lower.includes('tourisme')) {
      return [
        'Destinations de voyage économiques',
        'Conseils pour faire sa valise',
        'Conseils de sécurité pour voyager seul',
        'Joyaux cachés à visiter en Europe',
        'Comment planifier une escapade de weekend'
      ];
    }
    
    if (query_lower.includes('livre') || query_lower.includes('lire') || query_lower.includes('littérature')) {
      return [
        'Recommandations de romans français contemporains',
        'Classiques de la littérature à découvrir',
        'Livres pour améliorer le développement personnel',
        'Suggestions de livres pour enfants',
        'Meilleurs livres de science-fiction récents'
      ];
    }
    
    if (query_lower.includes('film') || query_lower.includes('cinéma') || query_lower.includes('série')) {
      return [
        'Films français incontournables',
        'Séries à binge-watcher ce weekend',
        'Documentaires fascinants à voir',
        'Films récents acclamés par la critique',
        'Classiques du cinéma à redécouvrir'
      ];
    }
    
    if (query_lower.includes('musique') || query_lower.includes('chanson') || query_lower.includes('concert')) {
      return [
        'Artistes français contemporains à découvrir',
        'Playlists pour se concentrer au travail',
        'Classiques de la chanson française',
        'Albums récents qui valent le détour',
        'Musiques relaxantes pour méditer'
      ];
    }
    
    // Si aucun sujet spécifique n'est détecté, retourner un mélange de recommandations
    const allRecs = Object.values(baseRecommendations).flat();
    return allRecs.sort(() => 0.5 - Math.random()).slice(0, 5);
  };
  
  // Combiner toutes les recommandations de base
  const getAllRecommendations = (): string[] => {
    return Object.values(baseRecommendations).flat();
  };
  
  // Définir les recommandations initiales et mettre à jour lorsque userQuery change
  useEffect(() => {
    if (userQuery) {
      const dynamicRecs = generateDynamicRecommendations(userQuery);
      if (dynamicRecs.length > 0) {
        setActiveRecommendations(dynamicRecs);
      } else {
        setActiveRecommendations(getAllRecommendations());
      }
    } else {
      setActiveRecommendations(getAllRecommendations());
    }
    setCurrentPage(0);
  }, [userQuery]);
  
  // Définir les recommandations initiales au montage du composant
  useEffect(() => {
    setActiveRecommendations(getAllRecommendations());
  }, []);
  
  const itemsPerPage = 5;
  const pageCount = Math.ceil(activeRecommendations.length / itemsPerPage);
  
  const goToPreviousPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : pageCount - 1));
  };
  
  const goToNextPage = () => {
    setCurrentPage(prev => (prev < pageCount - 1 ? prev + 1 : 0));
  };
  
  return (
    <div className="mt-1 mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Lightbulb size={12} className="text-amber-500" />
          <span className="text-xs text-gray-500">Essayez:</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                currentPage === index ? 'bg-amber-500' : 'bg-gray-200'
              }`}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {activeRecommendations
          .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map((rec, index) => (
            <button
              key={index}
              onClick={() => onRecommendationClick(rec)}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full transition-colors"
            >
              {rec}
            </button>
          ))}
      </div>
      <div className="flex justify-between mt-1">
        <button
          onClick={goToPreviousPage}
          className="text-xs text-gray-400 hover:text-gray-600"
          aria-label="Page précédente"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={goToNextPage}
          className="text-xs text-gray-400 hover:text-gray-600"
          aria-label="Page suivante"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecommendationsCarousel;