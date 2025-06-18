
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

const PayPalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.17.17 0 0 0-.17-.17H18.15c-.092 0-.17.077-.17.17v2.383c0 .092.078.17.17.17h2.902c.092 0 .17-.078.17-.17V6.917z"/>
  </svg>
);

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
          <PayPalIcon className="w-16 h-16 text-gray-600 ml-4" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl text-gray-600 animate-fade-in flex-1">
            {t.subtitle}
          </p>
          <PayPalIcon className="w-12 h-12 text-gray-600 ml-4" />
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
