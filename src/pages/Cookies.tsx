
// Cookies.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';

const Cookies = () => (
  <div className="min-h-screen bg-white text-gray-700">
    <Header />
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Política de Cookies - ChoicePDF</title>
      <meta name="description" content="Saiba como o ChoicePDF utiliza cookies para melhorar sua experiência." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Política de Cookies</h1>
    <p className="mb-4">O ChoicePDF usa cookies para oferecer uma experiência melhor aos visitantes.</p>
    <p className="mb-4">Cookies técnicos são necessários para que o site funcione corretamente.</p>
    <p className="mb-4">Cookies de análise ajudam a entender o comportamento dos usuários e aprimorar nossas ferramentas.</p>
    <p className="mb-4">Podemos utilizar cookies de terceiros, como os do Google AdSense, para veicular anúncios relevantes.</p>
    <p className="mb-4">Você pode gerenciar ou desativar os cookies nas configurações do seu navegador. Lembre-se de que isso pode afetar a funcionalidade do site.</p>
    </div>
  </div>
);
export default Cookies;
