'use client';

import React from 'react';
import { X } from 'lucide-react';

// Define the interface for props
interface PrivacyPolicyModalProps {
  onClose: () => void;
}

// Apply the interface directly to the function parameter
const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Politique de Confidentialité</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">1. Introduction</h3>
          <p className="mb-4">
            Bienvenue sur mtwitt. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
            Cette politique de confidentialité vous informera de la manière dont nous traitons vos données personnelles lorsque vous visitez notre
            site web et vous renseignera sur vos droits en matière de confidentialité et sur la façon dont la loi vous protège.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">2. Données que nous collectons</h3>
          <p className="mb-2">Nous pouvons collecter, utiliser, stocker et transférer différents types de données personnelles vous concernant, que nous avons regroupées comme suit :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Données d'identité : nom, nom d'utilisateur ou identifiant similaire</li>
            <li>Données de contact : adresse e-mail</li>
            <li>Données techniques : adresse de protocole Internet (IP), type et version du navigateur, fuseau horaire, types et versions des plug-ins du navigateur, système d'exploitation et plate-forme</li>
            <li>Données d'utilisation : informations sur la façon dont vous utilisez notre site web et nos services</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3">3. Comment nous utilisons vos données</h3>
          <p className="mb-4">
            Nous n'utiliserons vos données personnelles que lorsque la loi nous le permet. Le plus souvent, nous utiliserons vos données
            personnelles dans les circonstances suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Pour vous inscrire en tant que nouvel utilisateur</li>
            <li>Pour fournir et améliorer nos services</li>
            <li>Pour personnaliser votre expérience</li>
            <li>Pour communiquer avec vous</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3">4. Sécurité des données</h3>
          <p className="mb-4">
            Nous avons mis en place des mesures de sécurité appropriées pour empêcher que vos données personnelles ne soient accidentellement
            perdues, utilisées ou consultées de manière non autorisée, modifiées ou divulguées. Nous limitons l'accès à vos données personnelles
            aux employés, agents, contractants et autres tiers qui ont un besoin professionnel de les connaître.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">5. Conservation des données</h3>
          <p className="mb-4">
            Nous ne conserverons vos données personnelles que pendant le temps nécessaire à la réalisation des objectifs pour lesquels nous les avons collectées,
            y compris pour satisfaire aux exigences légales, comptables ou de déclaration.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">6. Vos droits légaux</h3>
          <p className="mb-4">
            Dans certaines circonstances, vous disposez de droits en vertu des lois sur la protection des données concernant vos données personnelles,
            y compris le droit de demander l'accès, la correction, l'effacement, la restriction, le transfert, de s'opposer au traitement,
            à la portabilité des données et le droit de retirer votre consentement.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">7. Modifications de cette politique de confidentialité</h3>
          <p className="mb-4">
            Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle
            politique de confidentialité sur cette page et en mettant à jour la date de "Dernière mise à jour".
          </p>
          
          <p className="text-sm text-gray-500">Dernière mise à jour : 7 mars 2025</p>
        </div>
        
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;