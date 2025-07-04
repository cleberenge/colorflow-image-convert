import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import { ConversionType } from '@/types/fileConverter';
import { conversionTypes, getOrderedConversions } from '@/data/conversionTypes';
import { pageLinks } from '@/data/pageLinks';

const Index = () => {
  const [activeConversion, setActiveConversion] = useState<ConversionType>('png-jpg');
  const navigate = useNavigate();
  const location = useLocation();

  const orderedConversions = getOrderedConversions();

  // Mapeamento de URLs para tipos de conversão
  const urlToConversionMap: Record<string, ConversionType> = {
    '/png-to-jpg': 'png-jpg',
    '/jpg-to-pdf': 'jpg-pdf',
    '/split-pdf': 'split-pdf',
    '/merge-pdf': 'merge-pdf',
    '/reduce-pdf': 'reduce-pdf',
    '/reduce-jpg': 'reduce-jpg',
    '/reduce-png': 'reduce-png',
    '/svg-to-png': 'svg-png',
    '/jpg-to-webp': 'jpg-webp',
    '/svg-to-jpg': 'svg-jpg',
    '/html-to-pdf': 'html-pdf',
    '/csv-to-json': 'csv-json',
    '/csv-to-excel': 'csv-excel'
  };

  // Mapeamento de tipos de conversão para URLs
  const conversionToUrlMap: Record<ConversionType, string> = {
    'png-jpg': '/png-to-jpg',
    'jpg-pdf': '/jpg-to-pdf',
    'split-pdf': '/split-pdf',
    'merge-pdf': '/merge-pdf',
    'reduce-pdf': '/reduce-pdf',
    'reduce-jpg': '/reduce-jpg',
    'reduce-png': '/reduce-png',
    'svg-png': '/svg-to-png',
    'jpg-webp': '/jpg-to-webp',
    'svg-jpg': '/svg-to-jpg',
    'html-pdf': '/html-to-pdf',
    'csv-json': '/csv-to-json',
    'csv-excel': '/csv-to-excel'
  };

  // Definir conversão ativa baseada na URL atual
  useEffect(() => {
    const currentPath = location.pathname;
    const conversionFromUrl = urlToConversionMap[currentPath];
    
    if (conversionFromUrl) {
      setActiveConversion(conversionFromUrl);
    } else if (currentPath === '/') {
      // Se estiver na raiz, manter png-jpg como padrão
      setActiveConversion('png-jpg');
    }
  }, [location.pathname]);

  const handleConversionChange = (newConversion: ConversionType) => {
    setActiveConversion(newConversion);
    const newUrl = conversionToUrlMap[newConversion];
    navigate(newUrl, { replace: true });
  };

  // Obter título e descrição baseados na conversão ativa
  const getPageMetadata = (conversion: ConversionType) => {
    const conversionInfo = conversionTypes.find(t => t.id === conversion);
    if (!conversionInfo) {
      return {
        title: 'ChoicePDF - O melhor e mais rápido conversor',
        description: 'O melhor e mais rápido conversor de arquivos online de forma gratuita e segura'
      };
    }

    const conversionLabel = conversionInfo.label.pt;
    return {
      title: `${conversionLabel} - ChoicePDF`,
      description: `Converta ${conversionInfo.from} para ${conversionInfo.to} online de forma gratuita e segura com ChoicePDF`
    };
  };

  const { title, description } = getPageMetadata(activeConversion);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="converter PDF, PNG para JPG, JPG para PDF, dividir PDF, juntar PDF, reduzir PDF" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://choicepdf.com${conversionToUrlMap[activeConversion]}`} />
      </Helmet>
      
      <div className="min-h-screen text-gray-700" style={{ backgroundColor: '#DBEAFE' }}>
        <Header activeConversion={activeConversion} />
        
        <MainContent
          orderedConversions={orderedConversions}
          activeConversion={activeConversion}
          onConversionChange={handleConversionChange}
          pageLinks={pageLinks}
          conversionTypes={conversionTypes}
        />
        
        {/* Bottom ad space */}
        <div className="w-full h-[90px] mt-8">
          <div className="h-full" />
        </div>
        
        {/* Footer */}
        <footer className="w-full py-4 px-6" style={{ backgroundColor: '#DBEAFE' }}>
          <div className="flex justify-center items-center">
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
