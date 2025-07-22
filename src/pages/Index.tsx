
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import { conversionTypes, getOrderedConversions } from '@/data/conversionTypes';
import { pageLinks } from '@/data/pageLinks';
import { ConversionType } from '@/types/fileConverter';

const Index = () => {
  const [activeConversion, setActiveConversion] = useState<ConversionType>('png-jpg');
  const orderedConversions = getOrderedConversions();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>ChoicePDF - Conversor de Arquivos Online Gratuito</title>
        <meta 
          name="description" 
          content="Converta PNG para JPG, JPG para PDF, comprima PDFs e mais. Ferramenta online gratuita, rápida e segura para conversão de arquivos." 
        />
      </Helmet>
      <Header />
      <MainContent 
        orderedConversions={orderedConversions}
        activeConversion={activeConversion}
        onConversionChange={setActiveConversion}
        pageLinks={pageLinks}
        conversionTypes={conversionTypes}
      />
      <Footer />
    </div>
  );
};

export default Index;
