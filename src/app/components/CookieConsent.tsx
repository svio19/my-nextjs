// components/CookieConsent.jsx
import React, { useState } from 'react';

// Define the interface for CookieConsent props
interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">Cookie Consent</h3>
            {!showDetails ? (
              <p className="text-gray-600 text-sm">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                <button 
                  onClick={() => setShowDetails(true)}
                  className="text-blue-500 underline ml-1"
                >
                  Learn more
                </button>
              </p>
            ) : (
              <div className="text-gray-600 text-sm">
                <p className="mb-2">
                  We use different types of cookies to optimize your experience on our website:
                </p>
                <ul className="list-disc pl-5 mb-2">
                  <li><strong>Essential cookies:</strong> Necessary for basic website functionality.</li>
                  <li><strong>Analytics cookies:</strong> Help us understand how you interact with our website.</li>
                  <li><strong>Marketing cookies:</strong> Allow us to provide relevant content based on your interests.</li>
                </ul>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-blue-500 underline"
                >
                  Show less
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDecline}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;