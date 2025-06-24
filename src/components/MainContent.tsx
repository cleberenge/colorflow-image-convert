
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
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: '#DBEAFE' }}>
      <main className="flex-grow max-w-4xl px-4 py-1">
        <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
          <div className="flex-1 mt-6">
            <h1 className="text-4xl font-bold text-gray-700 animate-fade-in mb-0 leading-tight">
              O melhor e mais rápido
            </h1>
            <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight">
              Ferramenta gratuita e segura para conversão de arquivos
            </h2>
            <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight mt-0">
              Mantenha esse projeto livre com uma doação
            </h2>
          </div>
          <div className="flex-shrink-0 p-1 relative">
            <img 
              src="/lovable-uploads/af40c844-9779-4d1b-8d71-02916751b93d.png" 
              alt="QR Code" 
              className="w-40 h-40 object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#DBEAFE', margin: '3px' }}>
                <img 
                  src="/lovable-uploads/7e61da39-146d-44c0-a98a-35e4e5c02466.png" 
                  alt="Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="-mt-3">
          <ConversionSelector
            orderedConversions={orderedConversions}
            activeConversion={activeConversion}
            onConversionChange={onConversionChange}
          />
        </div>
        
        <div className="rounded-xl p-6 -mt-6" style={{ backgroundColor: '#DBEAFE' }}>
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
    </div>
  );
};

export default MainContent;
