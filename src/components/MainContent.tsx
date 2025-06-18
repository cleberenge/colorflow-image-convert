
import React from 'react';
import ConversionTool from '@/components/ConversionTool';
import ConversionSelector from '@/components/ConversionSelector';
import PageLinksGrid from '@/components/PageLinksGrid';
import { useLanguage } from '@/hooks/useLanguage';
import { ConversionType } from '@/types/fileConverter';
import { QrCode } from 'lucide-react';

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
      <div className="mb-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-700 animate-fade-in flex-1">
            O melhor e mais rápido conversor
          </h1>
          <QrCode className="w-12 h-12 text-gray-600 ml-4" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl text-gray-600 animate-fade-in flex-1">
            {t.subtitle}
          </p>
          <QrCode className="w-10 h-10 text-gray-600 ml-4" />
        </div>
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
