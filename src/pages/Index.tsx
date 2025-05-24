
import React, { useState } from 'react';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';

// Conversion types
const conversionTypes = [
  { id: 'png-jpg', label: 'PNG para JPG', from: 'PNG', to: 'JPG', icon: '🖼️' },
  { id: 'jpg-pdf', label: 'JPG para PDF', from: 'JPG', to: 'PDF', icon: '📄' },
  { id: 'pdf-word', label: 'PDF para Word', from: 'PDF', to: 'WORD', icon: '📝' },
  { id: 'word-pdf', label: 'Word para PDF', from: 'WORD', to: 'PDF', icon: '📋' },
  { id: 'video-mp3', label: 'Extrair MP3', from: 'Vídeo', to: 'MP3', icon: '🎵' },
  { id: 'compress-video', label: 'Comprimir Vídeo', from: 'Vídeo', to: 'Vídeo Comprimido', icon: '🎬' },
  { id: 'split-pdf', label: 'Dividir PDF', from: 'PDF', to: 'PDFs Separados', icon: '✂️' },
  { id: 'merge-pdf', label: 'Juntar PDF', from: 'PDFs', to: 'PDF Único', icon: '🔗' },
  { id: 'reduce-pdf', label: 'Reduzir PDF', from: 'PDF', to: 'PDF Comprimido', icon: '📉' }
];

const Index = () => {
  const [activeConversion, setActiveConversion] = useState('png-jpg');

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      
      <div className="flex">
        {/* Left ad space */}
        <div className="hidden md:block w-[160px] h-full fixed left-0">
          {/* AdSense will be placed here */}
          <div className="h-full" />
        </div>
        
        {/* Main content - centered with margin on sides for ads */}
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12" style={{ margin: '0 auto' }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 animate-fade-in">
              Conversor de Arquivos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              Ferramentas de conversão minimalistas e eficientes para seus arquivos.
            </p>
          </div>
          
          {/* Conversion type selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {conversionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveConversion(type.id)}
                className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 rounded-lg ${
                  activeConversion === type.id 
                  ? 'bg-brand-blue text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          
          {/* Active conversion tool */}
          <ConversionTool 
            conversionType={activeConversion} 
            conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
          />
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto mt-20">
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">Rápido</h3>
              <p className="text-gray-600">Conversão instantânea sem perda de qualidade</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">Seguro</h3>
              <p className="text-gray-600">Processamento local, seus arquivos não saem do seu dispositivo</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-800">Simples</h3>
              <p className="text-gray-600">Interface intuitiva e fácil de usar</p>
            </div>
          </div>
        </main>
        
        {/* Right ad space */}
        <div className="hidden md:block w-[160px] h-full fixed right-0">
          {/* AdSense will be placed here */}
          <div className="h-full" />
        </div>
      </div>
      
      {/* Bottom ad space */}
      <div className="w-full h-[90px] mt-8">
        {/* AdSense will be placed here */}
        <div className="h-full" />
      </div>
    </div>
  );
};

export default Index;
