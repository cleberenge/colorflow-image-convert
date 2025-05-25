
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.privacy.title}
          </h1>
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Sua privacidade é nossa prioridade absoluta. Processamos a maioria das conversões diretamente no seu navegador, o que significa que seus arquivos nunca deixam seu dispositivo. Para conversões que requerem processamento em servidor, utilizamos conexões criptografadas e excluímos todos os arquivos imediatamente após o processo.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Não armazenamos, compartilhamos ou vendemos seus dados pessoais para terceiros. Coletamos apenas informações técnicas básicas e anônimas para melhorar nossos serviços, como tipo de navegador e estatísticas de uso agregadas. Essas informações não podem ser usadas para identificá-lo pessoalmente.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-left">
            Implementamos as mais rigorosas medidas de segurança da indústria, incluindo criptografia de ponta a ponta e protocolos de segurança avançados. Revisamos regularmente nossas práticas de privacidade para garantir conformidade com as leis internacionais de proteção de dados, incluindo LGPD e GDPR.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
