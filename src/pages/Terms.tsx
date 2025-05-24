
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.terms.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.terms.subtitle}
          </p>
        </div>
        
        <div className="prose prose-gray max-w-none space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.terms.acceptance.title}</h2>
            <p className="text-gray-600">{t.terms.acceptance.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.terms.serviceUse.title}</h2>
            <p className="text-gray-600">{t.terms.serviceUse.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.terms.limitations.title}</h2>
            <p className="text-gray-600">{t.terms.limitations.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.terms.modifications.title}</h2>
            <p className="text-gray-600">{t.terms.modifications.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
