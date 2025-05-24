
import React, { useState } from 'react';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor } from '@/utils/conversionColors';

// Conversion types
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
            <h1 className="text-4xl font-bold mb-6 text-gray-700 animate-fade-in">
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
                  className={`px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded-lg ${
                    activeConversion === type.id 
                    ? 'bg-gray-50 shadow-lg' 
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
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto mt-20">
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.features.fast.title}</h3>
              <p className="text-gray-600">{t.features.fast.description}</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.features.secure.title}</h3>
              <p className="text-gray-600">{t.features.secure.description}</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.features.simple.title}</h3>
              <p className="text-gray-600">{t.features.simple.description}</p>
            </div>
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
