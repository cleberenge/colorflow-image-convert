
// Privacy.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';

const Privacy = () => (
  <div className="min-h-screen bg-white text-gray-700">
    <Header />
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Política de Privacidade - ChoicePDF</title>
      <meta name="description" content="Saiba como protegemos seus dados e garantimos sua privacidade ao usar o ChoicePDF." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
    <p className="mb-4">Sua privacidade é uma prioridade para nós.</p>
    <p className="mb-4">Os arquivos que você converte permanecem no seu dispositivo e não são salvos por nós.</p>
    <p className="mb-4">Não vendemos, trocamos ou compartilhamos informações pessoais com terceiros.</p>
    <p className="mb-4">Podemos utilizar cookies e ferramentas de análise para entender melhor como os visitantes usam o site e melhorar continuamente nossos serviços.</p>
    <p className="mb-4">Cumprimos as regulamentações de proteção de dados, incluindo GDPR (Europa) e LGPD (Brasil).</p>
    <p className="mb-4">Se tiver qualquer dúvida sobre nossa política ou quiser solicitar informações, entre em contato conosco.</p>
    </div>
  </div>
);
export default Privacy;
