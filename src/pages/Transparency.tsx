
import React from 'react';
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';

const Transparency = () => {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
        <Helmet>
          <title>Transparência - ChoicePDF</title>
          <meta name="description" content="Conheça nossa política de transparência e como protegemos seus dados no ChoicePDF." />
        </Helmet>
        
        <h1 className="text-3xl font-bold mb-4">Transparência</h1>
        <p className="mb-4">No ChoicePDF, acreditamos que a confiança é fundamental. Por isso, mantemos total transparência sobre como nossas ferramentas funcionam e como lidamos com seus dados.</p>
        <p className="mb-4">Os arquivos enviados para conversão não são armazenados em nossos servidores.</p>
        <p className="mb-4">Nenhuma informação pessoal é exigida para utilizar nossos serviços. Apenas coletamos dados técnicos mínimos (como estatísticas anônimas de uso) para melhorar a plataforma.</p>
        <p className="mb-4">Se quiser saber mais sobre como protegemos sua privacidade, consulte nossa Política de Privacidade.</p>
      </div>
    </div>
  );
};

export default Transparency;
