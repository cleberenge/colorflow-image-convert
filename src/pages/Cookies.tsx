
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Cookies = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.cookies.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.cookies.subtitle}
          </p>
        </div>
        
        <div className="prose prose-gray max-w-none space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.cookies.whatAre.title}</h2>
            <p className="text-gray-600">{t.cookies.whatAre.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.cookies.howWeUse.title}</h2>
            <p className="text-gray-600">{t.cookies.howWeUse.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.cookies.control.title}</h2>
            <p className="text-gray-600">{t.cookies.control.content}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.cookies.moreInfo.title}</h2>
            <p className="text-gray-600">{t.cookies.moreInfo.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cookies;
