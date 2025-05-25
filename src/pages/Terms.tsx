
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.terms.title}
          </h1>
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Ao utilizar nossos serviços de conversão de arquivos, você concorda com estes termos de uso. Nossa plataforma é oferecida gratuitamente para uso pessoal e comercial, com limitações razoáveis de tamanho e frequência para garantir qualidade do serviço para todos os usuários.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Você é responsável por garantir que possui os direitos necessários sobre os arquivos que converte e que seu uso está em conformidade com as leis aplicáveis. Proibimos o uso de nossos serviços para atividades ilegais, distribuição de malware ou violação de direitos autorais de terceiros.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Embora nos esforcemos para manter nossos serviços sempre disponíveis e funcionais, não podemos garantir operação ininterrupta. Reservamos o direito de modificar estes termos e nossos serviços a qualquer momento, sempre notificando os usuários sobre mudanças significativas através de nossos canais oficiais.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
