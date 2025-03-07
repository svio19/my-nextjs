// components/PrivacyPolicyModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

const PrivacyPolicyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">1. Introduction</h3>
          <p className="mb-4">
            Welcome to mtwitt. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">2. Data We Collect</h3>
          <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Identity Data: includes name, username or similar identifier</li>
            <li>Contact Data: includes email address</li>
            <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
            <li>Usage Data: includes information about how you use our website and services</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3">3. How We Use Your Data</h3>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal
            data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To register you as a new user</li>
            <li>To provide and improve our services</li>
            <li>To personalize your experience</li>
            <li>To communicate with you</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally
            lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data
            to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
          <p className="mb-4">
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for,
            including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">6. Your Legal Rights</h3>
          <p className="mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data,
            including the right to request access, correction, erasure, restriction, transfer, to object to processing,
            to portability of data and the right to withdraw consent.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">7. Changes to This Privacy Policy</h3>
          <p className="mb-4">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page and updating the "Last Updated" date.
          </p>
          
          <p className="text-sm text-gray-500">Last Updated: March 7, 2025</p>
        </div>
        
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;