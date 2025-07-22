
import React from 'react';
import ConversionSelector from './ConversionSelector';
import ConversionTool from './ConversionTool';
import PageLinksGrid from './PageLinksGrid';
import CookieBanner from './CookieBanner';
import { ConversionType } from '@/types/fileConverter';
import { useLanguage } from '@/hooks/useLanguage';

interface MainContentProps {
  orderedConversions: any[];
  activeConversion: ConversionType;
  onConversionChange: (conversion: ConversionType) => void;
  pageLinks: any[];
  conversionTypes: any[];
}

const MainContent: React.FC<MainContentProps> = ({
  orderedConversions,
  activeConversion,
  onConversionChange,
  pageLinks,
  conversionTypes
}) => {
  const { language } = useLanguage();

  const getActiveConversionInfo = () => {
    return conversionTypes.find(type => type.id === activeConversion);
  };

  const getMainTitle = () => {
    const conversionInfo = getActiveConversionInfo();
    if (!conversionInfo) return 'Converter PNG para JPG';
    
    // Mapear os tipos de conversão para os títulos com "Converter"
    const titleMap: Record<string, string> = {
      'png-jpg': 'Converter PNG para JPG',
      'jpg-pdf': 'Converter JPG para PDF',
      'svg-png': 'Converter SVG para PNG',
      'jpg-webp': 'Converter JPG para WebP',
      'svg-jpg': 'Converter SVG para JPG',
      'html-pdf': 'Converter HTML para PDF',
      'csv-json': 'Converter CSV para JSON',
      'csv-excel': 'Converter CSV para Excel',
      'split-pdf': 'Converter Dividir PDF',
      'merge-pdf': 'Converter Juntar PDF',
      'reduce-pdf': 'Converter Reduzir PDF',
      'reduce-jpg': 'Converter Reduzir JPG',
      'reduce-png': 'Converter Reduzir PNG'
    };
    
    return titleMap[activeConversion] || `Converter ${conversionInfo.from} para ${conversionInfo.to}`;
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
          {getMainTitle()}
        </h1>
        
        <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: '#000000' }}>
          Converta seus arquivos de forma rápida, segura e gratuita. Sem necessidade de registro ou instalação.
        </p>

        <p className="text-sm mb-4 max-w-2xl mx-auto" style={{ color: '#000000' }}>
          Para começar, selecione seus arquivos ou arraste-os para a área destacada abaixo.
        </p>

        <p className="text-xs mb-8 max-w-2xl mx-auto" style={{ color: '#000000' }}>
          Sua privacidade é importante. Todos os arquivos são processados localmente no seu navegador ou excluídos dos nossos servidores após 1 hora.
        </p>
      </div>

      <ConversionSelector
        orderedConversions={orderedConversions}
        activeConversion={activeConversion}
        onConversionChange={onConversionChange}
      />

      <div className="mb-12">
        <ConversionTool 
          conversionType={activeConversion}
          conversionInfo={getActiveConversionInfo()}
        />
      </div>

      <PageLinksGrid links={pageLinks} />
      
      <CookieBanner />
    </main>
  );
};

export default MainContent;
