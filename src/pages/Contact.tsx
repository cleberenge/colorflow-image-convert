
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
          <title>Fale conosco - ChoicePDF</title>
          <meta name="description" content="Entre em contato com a equipe do ChoicePDF para suporte, feedback ou dúvidas sobre nossos serviços de conversão." />
          <meta name="robots" content="index, follow" />
        </Helmet>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Fale conosco</h1>
          
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
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Sobre o ChoicePDF</h2>
            <p>
              Bem-vindo ao <strong>ChoicePDF</strong> - sua plataforma gratuita e segura para conversão de arquivos!
            </p>
            
            <p className="mt-3">
              Nossa missão é oferecer ferramentas de conversão de alta qualidade que funcionam diretamente no seu navegador, 
              garantindo total privacidade e segurança dos seus documentos. Com processamento local na maioria das conversões, 
              seus arquivos nunca saem do seu dispositivo.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">O que oferecemos:</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Conversão de imagens (PNG, JPG, SVG, WebP)</li>
              <li>Processamento de documentos PDF (divisão, junção, compressão)</li>
              <li>Conversão de documentos (Word para PDF, HTML para PDF)</li>
              <li>Manipulação de dados (CSV para JSON, CSV para Excel)</li>
              <li>Compressão de arquivos de imagem e vídeo</li>
            </ul>
          </div>
          
          <p>
            Todas as nossas ferramentas são <strong>100% gratuitas</strong> e não requerem cadastro ou login. 
            Acreditamos que ferramentas essenciais de produtividade devem ser acessíveis a todos.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Apoie nosso projeto</h2>
            <p>
              O ChoicePDF é mantido através de doações. Se nossas ferramentas são úteis para você, 
              considere fazer uma contribuição usando o QR code disponível na página principal. 
              Cada contribuição nos ajuda a manter o serviço gratuito e melhorar continuamente.
            </p>
          </div>
          
          <p className="text-sm text-gray-500 border-t pt-4">
            <strong>ChoicePDF</strong> - Conversão de arquivos gratuita, rápida e segura.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
