
import React from 'react';
import ConversionTool from '@/components/ConversionTool';
import ConversionSelector from '@/components/ConversionSelector';
import PageLinksGrid from '@/components/PageLinksGrid';
import { useLanguage } from '@/hooks/useLanguage';
import { ConversionType } from '@/types/fileConverter';

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
  const { t } = useLanguage();

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-4" style={{ margin: '0 auto' }}>
      <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
        <div className="flex-1 mt-8">
          <h1 className="text-4xl font-bold text-gray-700 animate-fade-in mb-1 leading-tight">
            O melhor e mais rápido
          </h1>
          <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight">
            Ferramenta gratuita e segura para conversão de arquivos
          </h2>
        </div>
        <div className="flex-shrink-0 p-2">
          <img 
            src="/lovable-uploads/c880cfc0-6988-4e2c-a30a-b72afd14e84a.png" 
            alt="QR Code" 
            className="w-40 h-40 object-contain"
          />
        </div>
      </div>
      
      <div className="mt-1">
        <ConversionSelector
          orderedConversions={orderedConversions}
          activeConversion={activeConversion}
          onConversionChange={onConversionChange}
        />
      </div>
      
      <div className="bg-white rounded-xl p-6 mt-1">
        <ConversionTool 
          key={activeConversion}
          conversionType={activeConversion} 
          conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
        />
      </div>
      
      <div className="mt-1">
        <PageLinksGrid pageLinks={pageLinks} />
      </div>
    </main>
  );
};

export default MainContent;
