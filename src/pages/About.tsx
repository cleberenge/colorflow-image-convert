// About.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';

const About = () => (
  <div className="min-h-screen bg-white text-gray-700">
    <Header />
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Sobre - ChoicePDF</title>
      <meta name="description" content="Conheça o propósito e os valores por trás da plataforma ChoicePDF. Saiba como oferecemos conversões rápidas, gratuitas e seguras." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Sobre o ChoicePDF</h1>
    <p className="mb-4">Nossa plataforma foi criada para simplificar sua vida digital, oferecendo ferramentas de conversão de arquivos rápidas, seguras e totalmente gratuitas. Acreditamos que a tecnologia deve ser acessível a todos, sem complicações ou custos ocultos.</p>
    <p className="mb-4">Com foco na privacidade e segurança, processamos seus arquivos localmente sempre que possível, garantindo que suas informações permaneçam protegidas. Nossa interface intuitiva permite que qualquer pessoa, independentemente do nível técnico, realize conversões profissionais em segundos.</p>
    <p className="mb-4">O ChoicePDF nasceu da paixão por produtividade digital, desenvolvido por uma equipe dedicada a facilitar tarefas rotineiras sem comprometer a segurança. Utilizamos tecnologias modernas como WebAssembly, compressão no lado do cliente e renderização reativa para garantir desempenho de ponta.</p>
    <p className="mb-4">Estamos constantemente evoluindo para atender às suas necessidades, adicionando novos formatos e funcionalidades com base no feedback da comunidade. Junte-se a milhares de usuários que já descobriram a simplicidade e eficiência das nossas ferramentas.</p>
    </div>
  </div>
);
export default About;
