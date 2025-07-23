import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import { ConversionType } from '@/types/fileConverter';
import { conversionTextMap } from '@/data/conversionTextMap';
import { conversionTypes, getOrderedConversions } from '@/data/conversionTypes';
import { pageLinks } from '@/data/pageLinks';

function App() {
  const [activeConversion, setActiveConversion] = useState<ConversionType>('png-jpg');
  const orderedConversions = getOrderedConversions();

  const handleConversionChange = (conversion: ConversionType) => {
    setActiveConversion(conversion);
  };

  const getPageMetadata = (conversionType: ConversionType) => {
    const conversionData = conversionTypes[conversionType];
    if (!conversionData) return { title: 'ChoicePDF', description: 'Conversor de arquivos online' };
    
    const title = `${conversionData.title} - ChoicePDF`;
    const description = `${conversionData.description} de forma gratuita e segura`;
    
    return { title, description };
  };

  const { title, description } = getPageMetadata(activeConversion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="converter PDF, PNG para JPG, JPG para PDF, dividir PDF, juntar PDF, reduzir PDF" />
        <meta name="author" content="ChoicePDF" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ChoicePDF" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      
      <Header 
        activeConversion={activeConversion}
      />
      
      <MainContent 
        activeConversion={activeConversion}
        orderedConversions={orderedConversions}
        onConversionChange={handleConversionChange}
        pageLinks={pageLinks}
        conversionTypes={orderedConversions}
      />
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 ChoicePDF. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;