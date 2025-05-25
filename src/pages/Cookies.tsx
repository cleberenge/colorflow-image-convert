
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
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Utilizamos cookies essenciais para garantir o funcionamento adequado de nossos serviços de conversão. Estes cookies técnicos armazenam preferências básicas como idioma selecionado e configurações de interface, melhorando sua experiência sem coletar informações pessoais identificáveis.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Cookies analíticos nos ajudam a entender como você interage com nossa plataforma, permitindo identificar problemas e otimizar funcionalidades. Estes dados são sempre anonimizados e agregados, impossibilitando identificação individual. Você pode desabilitar estes cookies nas configurações do seu navegador sem afetar funcionalidades essenciais.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-left">
            Não utilizamos cookies de publicidade comportamental ou tracking de terceiros. Todos os cookies que definimos têm propósitos claros e específicos relacionados ao funcionamento de nossos serviços. Você tem controle total sobre quais cookies aceitar e pode revisar ou modificar suas preferências a qualquer momento.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Cookies;
