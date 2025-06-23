
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
    <main className="flex-grow max-w-4xl mx-auto px-4 py-1" style={{ margin: '0 auto' }}>
      <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
        <div className="flex-1 mt-6">
          <h1 className="text-4xl font-bold text-gray-700 animate-fade-in mb-0 leading-tight">
            O melhor e mais rápido
          </h1>
          <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight">
            Ferramenta gratuita e segura para conversão de arquivos
          </h2>
        </div>
        <div className="flex-shrink-0 p-1 relative flex flex-col items-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/af40c844-9779-4d1b-8d71-02916751b93d.png" 
              alt="QR Code" 
              className="w-40 h-40 object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center" style={{ margin: '0.5px' }}>
                <img 
                  src="/lovable-uploads/7e61da39-146d-44c0-a98a-35e4e5c02466.png" 
                  alt="Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Donation</p>
        </div>
      </div>
      
      <div className="mt-2">
        <ConversionSelector
          orderedConversions={orderedConversions}
          activeConversion={activeConversion}
          onConversionChange={onConversionChange}
        />
      </div>
      
      <div className="bg-white rounded-xl p-6 -mt-6">
        <ConversionTool 
          key={activeConversion}
          conversionType={activeConversion} 
          conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
        />
      </div>
      
      <div className="-mt-6">
        <PageLinksGrid pageLinks={pageLinks} />
      </div>
    </main>
  );
};

export default MainContent;
