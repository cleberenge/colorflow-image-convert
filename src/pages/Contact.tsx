// Contact.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

const Contact = () => (
  <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Contato - ChoicePDF</title>
      <meta name="description" content="Entre em contato com a equipe do ChoicePDF. Suporte rápido e eficaz para dúvidas, sugestões e suporte técnico." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Fale Conosco</h1>
    <p className="mb-4">Valorizamos cada usuário e estamos prontos para ajudar. Nossa equipe de suporte trabalha para garantir que você tenha a melhor experiência possível com nossas ferramentas.</p>
    <p className="mb-4">Se você encontrou algum problema técnico, tem sugestões ou deseja compartilhar sua experiência, envie um e-mail para: <strong>cleber.engeamb@gmail.com.com</strong></p>
    <p className="mb-4">Respondemos todas as mensagens dentro de 24 horas úteis. Seu feedback é fundamental para nosso crescimento e desenvolvimento de novas funcionalidades. Conte conosco!</p>
  </div>
);
export default Contact;
