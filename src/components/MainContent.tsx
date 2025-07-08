
// src/components/MainContent.tsx

import React from 'react';
import ConversionTool from '@/components/ConversionTool';
import ConversionSelector from '@/components/ConversionSelector';
import PageLinksGrid from '@/components/PageLinksGrid';
import ContactForm from '@/components/ContactForm';
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
      <main className="max-w-4xl mx-auto px-4 py-1">
        <div className="mb-1 max-w-3xl mx-auto flex items-start gap-6">
          <div className="flex-1 mt-6">
            <h1 className="text-3xl font-bold animate-fade-in mb-2 text-gray-800">
              {activeInfo?.label?.pt || 'Conversão de arquivos'}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Converta {activeInfo?.from} para {activeInfo?.to} gratuitamente, com segurança e diretamente no seu navegador.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Para começar, selecione ou arraste seu arquivo. O processamento será automático e seu arquivo convertido estará disponível para download em segundos.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Sua privacidade é prioridade: a maioria das conversões ocorre localmente no seu navegador, sem envio para servidores.
            </p>
          </div>
          <div className="flex-shrink-0 p-1 relative" style={{ marginTop: '16px' }}>
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

        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainContent;
