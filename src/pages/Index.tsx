
import React from 'react';
import Header from '@/components/Header';
import ImageConverter from '@/components/ImageConverter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream/50 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-brand-teal/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-brand-red/5 rounded-full blur-2xl"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23086788' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      {/* Main content */}
      <div className="relative">
        <Header />
        
        <main className="container mx-auto px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-brand-teal mb-6 animate-fade-in">
              Conversor PNG para JPG
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              Converta seus arquivos PNG para JPG de forma rápida, fácil e gratuita. 
              Interface clean e minimalista para uma experiência perfeita.
            </p>
          </div>
          
          <ImageConverter />
          
          <div className="text-center mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-blue/20 transition-all duration-300">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-semibold text-brand-teal mb-3 text-lg">Rápido</h3>
                <p className="text-gray-600">Conversão instantânea sem perda de qualidade</p>
              </div>
              
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-yellow/20 transition-all duration-300">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="font-semibold text-brand-teal mb-3 text-lg">Seguro</h3>
                <p className="text-gray-600">Processamento local, seus arquivos não saem do seu dispositivo</p>
              </div>
              
              <div className="text-center animate-fade-in group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-red/20 transition-all duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-semibold text-brand-teal mb-3 text-lg">Simples</h3>
                <p className="text-gray-600">Interface intuitiva e fácil de usar</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
