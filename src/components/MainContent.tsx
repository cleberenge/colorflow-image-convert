
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
    <main className="flex-grow max-w-4xl mx-auto px-4 py-12" style={{ margin: '0 auto' }}>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-700 animate-fade-in">
          O melhor e mais rápido conversor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl animate-fade-in">
          {t.subtitle}
        </p>
      </div>
      
      <ConversionSelector
        orderedConversions={orderedConversions}
        activeConversion={activeConversion}
        onConversionChange={onConversionChange}
      />
      
      <div className="bg-white rounded-xl p-6">
        <ConversionTool 
          key={activeConversion}
          conversionType={activeConversion} 
          conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
        />
      </div>
      
      <PageLinksGrid pageLinks={pageLinks} />
    </main>
  );
};

export default MainContent;
