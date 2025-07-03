
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
    <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
      <main className="max-w-4xl mx-auto px-4 py-1">
        <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
          <div className="flex-1 mt-6">
            <h1 className="text-4xl font-bold text-gray-700 animate-fade-in mb-0 leading-tight">
              O melhor e mais rápido
            </h1>
            <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight">
              Ferramenta gratuita e segura para conversão de arquivos
            </h2>
            <h2 className="text-xl text-gray-600 animate-fade-in mb-0 leading-tight mt-0">
              Mantenha esse projeto livre com qualquer doação
            </h2>
          </div>
          <div className="flex-shrink-0 p-1 relative">
            <img 
              src="/lovable-uploads/621cf7a8-1c99-489f-ac67-6573c3dcaa96.png" 
              alt="QR Code" 
              className="w-40 h-40 object-contain"
            />
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
