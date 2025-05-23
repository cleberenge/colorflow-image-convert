
import React, { useState } from 'react';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';

// Conversion types
const conversionTypes = [
  { id: 'png-jpg', label: 'PNG para JPG', from: 'PNG', to: 'JPG' },
  { id: 'jpg-pdf', label: 'JPG para PDF', from: 'JPG', to: 'PDF' },
  { id: 'pdf-doc', label: 'PDF para DOC', from: 'PDF', to: 'DOC' },
  { id: 'doc-pdf', label: 'DOC para PDF', from: 'DOC', to: 'PDF' },
  { id: 'video-mp3', label: 'Extrair MP3', from: 'Vídeo', to: 'MP3' },
  { id: 'compress-video', label: 'Comprimir Vídeo', from: 'Vídeo', to: 'Vídeo Comprimido' }
];

const Index = () => {
  const [activeConversion, setActiveConversion] = useState('png-jpg');

  return (
    <div className="min-h-screen bg-brand-teal text-white">
      <Header />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-brand-cream animate-fade-in">
            Conversor de Arquivos
          </h1>
          <p className="text-xl text-brand-cream/90 max-w-2xl mx-auto animate-fade-in">
            Ferramentas de conversão minimalistas e eficientes para seus arquivos.
          </p>
        </div>
        
        {/* Conversion type selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {conversionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveConversion(type.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeConversion === type.id 
                ? 'bg-brand-yellow text-brand-teal font-medium' 
                : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {/* Active conversion tool */}
        <ConversionTool 
          conversionType={activeConversion} 
          conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
        />
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold mb-3 text-lg">Rápido</h3>
            <p className="text-white/80">Conversão instantânea sem perda de qualidade</p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold mb-3 text-lg">Seguro</h3>
            <p className="text-white/80">Processamento local, seus arquivos não saem do seu dispositivo</p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-3 text-lg">Simples</h3>
            <p className="text-white/80">Interface intuitiva e fácil de usar</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
