
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Transparency = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.transparency.title}
          </h1>
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Acreditamos na transparência total sobre como nossos serviços funcionam. Utilizamos tecnologias web modernas para processar conversões localmente sempre que possível, reduzindo tempo de processamento e maximizando sua privacidade. Quando o processamento remoto é necessário, utilizamos servidores seguros em datacenters certificados.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Nossa receita vem de parcerias estratégicas e publicidade não intrusiva, permitindo manter todos os serviços essenciais gratuitos. Não vendemos dados de usuários nem implementamos tracking invasivo. Todas as métricas coletadas são anonimizadas e usadas exclusivamente para melhorar a experiência do usuário.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-left">
            Publicamos relatórios regulares sobre nossa infraestrutura, políticas de segurança e uso de recursos. Nosso código de conduta e práticas operacionais são revisados por auditores independentes, garantindo que cumprimos os mais altos padrões éticos da indústria de tecnologia.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Transparency;
