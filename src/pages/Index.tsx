
import React from 'react';
import Header from '@/components/Header';
import ImageConverter from '@/components/ImageConverter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream/50">
      <Header />
      
      <main className="container mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-brand-teal mb-4 animate-fade-in">
            Conversor PNG para JPG
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Converta seus arquivos PNG para JPG de forma rápida, fácil e gratuita. 
            Interface clean e minimalista para uma experiência perfeita.
          </p>
        </div>
        
        <ImageConverter />
        
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-brand-teal mb-2">Rápido</h3>
              <p className="text-gray-600 text-sm">Conversão instantânea sem perda de qualidade</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-brand-teal mb-2">Seguro</h3>
              <p className="text-gray-600 text-sm">Processamento local, seus arquivos não saem do seu dispositivo</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-brand-teal mb-2">Simples</h3>
              <p className="text-gray-600 text-sm">Interface intuitiva e fácil de usar</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
