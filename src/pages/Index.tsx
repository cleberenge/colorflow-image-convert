
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import { ConversionType } from '@/types/fileConverter';
import { conversionTypes, getOrderedConversions } from '@/data/conversionTypes';
import { pageLinks } from '@/data/pageLinks';

const Index = () => {
  const [activeConversion, setActiveConversion] = useState<ConversionType>('png-jpg');

  const orderedConversions = getOrderedConversions();

  const handleConversionChange = (newConversion: ConversionType) => {
    setActiveConversion(newConversion);
  };

  return (
    <>
      <Helmet>
        <title>ChoicePDF - O melhor e mais rápido conversor</title>
        <meta name="description" content="O melhor e mais rápido conversor de arquivos PNG para JPG, JPG para PDF, dividir PDF, juntar PDF e reduzir PDF. Ferramenta online gratuita e segura." />
        <meta name="keywords" content="converter PDF, PNG para JPG, JPG para PDF, dividir PDF, juntar PDF, reduzir PDF" />
        <meta property="og:title" content="ChoicePDF - O melhor e mais rápido conversor" />
        <meta property="og:description" content="O melhor e mais rápido conversor de arquivos online de forma gratuita e segura" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://choicepdf.com/" />
      </Helmet>
      
      <div className="min-h-screen text-gray-700" style={{ backgroundColor: '#DBEAFE' }}>
        <Header activeConversion={activeConversion} />
        
        <div className="flex">
          {/* Left ad space */}
          <div className="hidden md:block w-[160px] h-full fixed left-0">
            <div className="h-full" />
          </div>
          
          <MainContent
            orderedConversions={orderedConversions}
            activeConversion={activeConversion}
            onConversionChange={handleConversionChange}
            pageLinks={pageLinks}
            conversionTypes={conversionTypes}
          />
          
          {/* Right ad space */}
          <div className="hidden md:block w-[160px] h-full fixed right-0">
            <div className="h-full" />
          </div>
        </div>
        
        {/* Bottom ad space */}
        <div className="w-full h-[90px] mt-8">
          <div className="h-full" />
        </div>
        
        {/* Footer */}
        <footer className="w-full py-4 px-6" style={{ backgroundColor: '#DBEAFE' }}>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ChoicePDF. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
