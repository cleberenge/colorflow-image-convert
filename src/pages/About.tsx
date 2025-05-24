
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t.about.mission.title}</h2>
            <p className="text-gray-600 leading-relaxed">{t.about.mission.content}</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t.about.technology.title}</h2>
            <p className="text-gray-600 leading-relaxed">{t.about.technology.content}</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t.about.commitment.title}</h2>
            <p className="text-gray-600 leading-relaxed">{t.about.commitment.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
