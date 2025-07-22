
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

const Index = () => {
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
      <MainContent />
      <Footer />
    </div>
  );
};

export default Index;
