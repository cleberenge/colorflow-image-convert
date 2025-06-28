
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, MessageSquare, Clock } from 'lucide-react';

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">Email</h3>
            <p className="text-gray-600">Envie suas dúvidas e sugestões</p>
            <p className="text-blue-500 font-medium mt-2">cleber.conteudo@gmail.com</p>
          </div>
          
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">Suporte</h3>
            <p className="text-gray-600">Ajuda técnica especializada</p>
          </div>
          
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">Horário</h3>
            <p className="text-gray-600">Segunda a sexta, 9h às 18h</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
