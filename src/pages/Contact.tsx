
import React from 'react';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import { useLanguage } from '@/hooks/useLanguage';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.contact.title}
          </h1>
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6 mb-12">
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Valorizamos cada usuário e estamos sempre prontos para ajudar. Nossa equipe de suporte dedicada trabalha incansavelmente para garantir que você tenha a melhor experiência possível com nossas ferramentas de conversão.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Se você encontrou algum problema técnico, tem sugestões de melhorias ou simplesmente quer compartilhar sua experiência conosco, não hesite em entrar em contato. Respondemos a todas as mensagens dentro de 24 horas durante dias úteis.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed text-left">
            Sua opinião é fundamental para nosso crescimento e melhoria contínua. Através do seu feedback, conseguimos identificar oportunidades de aprimoramento e desenvolver novas funcionalidades que realmente fazem a diferença no seu dia a dia.
          </p>
        </div>

        <ContactForm />
      </main>
    </div>
  );
};

export default Contact;
