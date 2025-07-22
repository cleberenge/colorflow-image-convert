
// src/components/MainContent.tsx

import React from 'react';
import ConversionTool from '@/components/ConversionTool';
import ConversionSelector from '@/components/ConversionSelector';
import PageLinksGrid from '@/components/PageLinksGrid';
import { Toaster } from '@/components/ui/toaster';
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
  const activeInfo = conversionTypes.find(t => t.id === activeConversion);

  // Lista das conversões que devem ter "Converter" no início
  const conversionsWithConverter = [
    'png-jpg',
    'jpg-pdf', 
    'svg-png',
    'jpg-webp',
    'svg-jpg',
    'html-pdf',
    'csv-json'
  ];

  // Função para obter o título com ou sem "Converter"
  const getConversionTitle = () => {
    const baseTitle = activeInfo?.label?.pt || 'Conversão de arquivos';
    
    if (conversionsWithConverter.includes(activeConversion)) {
      // Se já começa com "Converter", mantém como está
      if (baseTitle.startsWith('Converter')) {
        return baseTitle;
      }
      // Caso contrário, adiciona "Converter" no início
      return `Converter ${baseTitle}`;
    }
    
    return baseTitle;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
      <main className="max-w-4xl mx-auto px-4 py-1">
        <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
          <div className="flex-1 mt-6">
            <h1 className="text-3xl font-bold animate-fade-in mb-2" style={{ color: '#000000' }}>
              {getConversionTitle()}
            </h1>
            <p className="text-lg mb-4" style={{ color: '#000000' }}>
              Converta {activeInfo?.from} para {activeInfo?.to} gratuitamente, com segurança e diretamente no seu navegador.
            </p>
            <p className="text-sm mb-4" style={{ color: '#000000' }}>
              Para começar, selecione ou arraste seu arquivo. O processamento será automático e seu arquivo convertido estará disponível para download em segundos.
            </p>
            <p className="text-sm mb-4" style={{ color: '#000000' }}>
              Sua privacidade é prioridade: a maioria das conversões ocorre localmente no seu navegador, sem envio para servidores.
            </p>
          </div>
          <div className="flex-shrink-0 p-1 relative" style={{ marginTop: '24px' }}>
            <img 
              src="/lovable-uploads/3a8f2786-6621-4544-9c02-2049444074f3.png" 
              alt="Doe para apoiar o ChoicePDF via QR Code do Pix" 
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
            conversionInfo={activeInfo || conversionTypes[0]} 
          />
        </div>

        <div className="-mt-6 mb-8">
          <PageLinksGrid pageLinks={pageLinks} />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainContent;
