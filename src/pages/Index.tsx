
import React from 'react';
import Header from '@/components/Header';
import ImageConverter from '@/components/ImageConverter';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Imagem de paisagem de plano de fundo */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')`,
        }}
      ></div>
      
      {/* Camada de sobreposição para garantir legibilidade */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-teal/70 via-transparent to-brand-cream/80"></div>
      
      {/* Sutis padrões de sobreposição */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
              Conversor PNG para JPG
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto animate-fade-in drop-shadow-md">
              Converta seus arquivos PNG para JPG de forma rápida, fácil e gratuita. 
              Interface clean e minimalista para uma experiência perfeita.
            </p>
          </div>
          
          <ImageConverter />
          
          <div className="text-center mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-white/30 transition-all duration-300">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-semibold text-white mb-3 text-lg drop-shadow-md">Rápido</h3>
                <p className="text-white/90 drop-shadow-md">Conversão instantânea sem perda de qualidade</p>
              </div>
              
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-white/30 transition-all duration-300">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="font-semibold text-white mb-3 text-lg drop-shadow-md">Seguro</h3>
                <p className="text-white/90 drop-shadow-md">Processamento local, seus arquivos não saem do seu dispositivo</p>
              </div>
              
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-white/30 transition-all duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-semibold text-white mb-3 text-lg drop-shadow-md">Simples</h3>
                <p className="text-white/90 drop-shadow-md">Interface intuitiva e fácil de usar</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
