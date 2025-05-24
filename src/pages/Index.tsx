
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor } from '@/utils/conversionColors';

// Conversion types with improved clean icons
const conversionTypes = [
  { id: 'png-jpg', label: { pt: 'PNG para JPG', en: 'PNG to JPG', zh: 'PNG转JPG' }, from: 'PNG', to: 'JPG', icon: '🖼️' },
  { id: 'jpg-pdf', label: { pt: 'JPG para PDF', en: 'JPG to PDF', zh: 'JPG转PDF' }, from: 'JPG', to: 'PDF', icon: '📄' },
  { id: 'pdf-word', label: { pt: 'PDF para Word', en: 'PDF to Word', zh: 'PDF转Word' }, from: 'PDF', to: 'Word', icon: '📝' },
  { id: 'word-pdf', label: { pt: 'Word para PDF', en: 'Word to PDF', zh: 'Word转PDF' }, from: 'Word', to: 'PDF', icon: '📋' },
  { id: 'video-mp3', label: { pt: 'Extrair MP3', en: 'Extract MP3', zh: '提取MP3' }, from: 'Vídeo', to: 'MP3', icon: '🎵' },
  { id: 'compress-video', label: { pt: 'Comprimir Vídeo', en: 'Compress Video', zh: '压缩视频' }, from: 'Vídeo', to: 'Vídeo Comprimido', icon: '🎬' },
  { id: 'split-pdf', label: { pt: 'Dividir PDF', en: 'Split PDF', zh: '分割PDF' }, from: 'PDF', to: 'PDFs Separados', icon: '✂️' },
  { id: 'merge-pdf', label: { pt: 'Juntar PDF', en: 'Merge PDF', zh: '合并PDF' }, from: 'PDFs', to: 'PDF Único', icon: '🔗' },
  { id: 'reduce-pdf', label: { pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF' }, from: 'PDF', to: 'PDF Comprimido', icon: '📉' }
];

const Index = () => {
  const [activeConversion, setActiveConversion] = useState('png-jpg');
  const { language, t } = useLanguage();

  // Page links with icons and descriptions
  const pageLinks = [
    { title: { pt: 'Sobre', en: 'About', zh: '关于' }, path: '/about', icon: '🏢', description: { pt: 'Nossa missão e valores', en: 'Our mission and values', zh: '我们的使命和价值观' } },
    { title: { pt: 'Contato', en: 'Contact', zh: '联系' }, path: '/contact', icon: '📞', description: { pt: 'Entre em contato conosco', en: 'Get in touch with us', zh: '与我们联系' } },
    { title: { pt: 'Privacidade', en: 'Privacy', zh: '隐私' }, path: '/privacy', icon: '🔒', description: { pt: 'Como protegemos seus dados', en: 'How we protect your data', zh: '我们如何保护您的数据' } },
    { title: { pt: 'Termos', en: 'Terms', zh: '条款' }, path: '/terms', icon: '📋', description: { pt: 'Condições de uso', en: 'Usage conditions', zh: '使用条件' } },
    { title: { pt: 'Transparência', en: 'Transparency', zh: '透明度' }, path: '/transparency', icon: '🌟', description: { pt: 'Nosso compromisso', en: 'Our commitment', zh: '我们的承诺' } },
    { title: { pt: 'Cookies', en: 'Cookies', zh: 'Cookie' }, path: '/cookies', icon: '🍪', description: { pt: 'Política de cookies', en: 'Cookie policy', zh: 'Cookie政策' } }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <div className="flex">
        {/* Left ad space */}
        <div className="hidden md:block w-[160px] h-full fixed left-0">
          <div className="h-full" />
        </div>
        
        {/* Main content - centered with margin on sides for ads */}
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12" style={{ margin: '0 auto' }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 animate-fade-in">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              {t.subtitle}
            </p>
          </div>
          
          {/* Conversion type selector */}
          <div className="flex flex-wrap justify-center gap-1 mb-10">
            {conversionTypes.map((type) => {
              const conversionColor = getConversionColor(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveConversion(type.id)}
                  className={`px-3 py-2 flex items-center gap-2 transition-all duration-300 ${
                    activeConversion === type.id 
                    ? 'bg-white' 
                    : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      color: activeConversion === type.id ? conversionColor : '#6B7280'
                    }}
                  >
                    {type.label[language]}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Active conversion tool */}
          <ConversionTool 
            conversionType={activeConversion} 
            conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
          />
          
          {/* Page Links replacing features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto mt-20">
            {pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in hover:bg-gray-100 transition-colors duration-300 block"
              >
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <h3 className="font-semibold mb-3 text-lg text-gray-800">{link.title[language]}</h3>
                <p className="text-gray-600">{link.description[language]}</p>
              </Link>
            ))}
          </div>
        </main>
        
        {/* Right ad space */}
        <div className="hidden md:block w-[160px] h-full fixed right-0">
          <div className="h-full" />
        </div>
      </div>
      
      {/* Bottom ad space */}
      <div className="w-full h-[90px] mt-8">
        <div className="h-full" />
      </div>
    </div>
  );
};

export default Index;
