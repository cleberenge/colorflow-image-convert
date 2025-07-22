
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
        <Helmet>
          <title>Formulário de Contato - ChoicePDF</title>
          <meta name="description" content="Entre em contato com a equipe do ChoicePDF para suporte, feedback ou dúvidas sobre nossos serviços de conversão." />
          <meta name="robots" content="index, follow" />
        </Helmet>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Formulário de Contato</h1>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <p className="text-lg mb-4">
              Tem dúvidas, sugestões ou encontrou algum problema?
            </p>
            <p className="text-lg mb-4">
              Entre em contato conosco:
            </p>
            <p className="text-lg font-semibold mb-4">
              E-mail: <a href="mailto:cleber.conteudo@gmail.com" className="text-blue-600 hover:underline">cleber.conteudo@gmail.com</a>
            </p>
            <p className="text-base text-gray-600">
              Ou preencha nosso formulário de contato abaixo.
            </p>
            <p className="text-base text-gray-600 mt-2">
              Respondemos o mais rápido possível!
            </p>
          </div>
        </div>

        <div className="mb-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
