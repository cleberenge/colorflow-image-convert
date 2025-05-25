
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.about.title}
          </h1>
        </div>
        
        <div className="prose prose-gray max-w-none text-center space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Nossa plataforma foi criada para simplificar sua vida digital, oferecendo ferramentas de conversão de arquivos rápidas, seguras e totalmente gratuitas. Acreditamos que a tecnologia deve ser acessível a todos, sem complicações ou custos ocultos.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Com foco na privacidade e segurança, processamos seus arquivos localmente sempre que possível, garantindo que suas informações permaneçam protegidas. Nossa interface intuitiva permite que qualquer pessoa, independentemente do nível técnico, realize conversões profissionais em segundos.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Estamos constantemente evoluindo para atender às suas necessidades, adicionando novos formatos e funcionalidades baseados no feedback da nossa comunidade. Junte-se a milhares de usuários que já descobriram a simplicidade e eficiência das nossas ferramentas.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
