
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
    <p className="mb-4">O ChoicePDF foi criado para tornar sua vida digital mais simples e produtiva. Oferecemos ferramentas rápidas, seguras e gratuitas para conversão e manipulação de arquivos, diretamente no navegador e sem necessidade de cadastro.</p>
    <p className="mb-4">Nosso objetivo é que qualquer pessoa, independentemente do nível técnico, consiga realizar conversões profissionais em poucos segundos, com total privacidade e segurança. Sempre que possível, os arquivos são processados localmente no seu dispositivo, garantindo que seus dados permaneçam protegidos.</p>
    <p className="mb-4">Desenvolvemos nossas soluções utilizando tecnologias modernas, como WebAssembly e compressão no lado do cliente, para entregar alto desempenho e uma experiência intuitiva.</p>
    <p className="mb-4">Estamos em constante evolução, adicionando novas funcionalidades com base no feedback dos usuários. Se tiver sugestões ou dúvidas, fale conosco através da página de contato. É um prazer ajudar você a trabalhar melhor com seus documentos!</p>
    </div>
  </div>
);
export default About;
