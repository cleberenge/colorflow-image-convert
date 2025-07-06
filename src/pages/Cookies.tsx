// Cookies.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

const Cookies = () => (
  <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Política de Cookies - ChoicePDF</title>
      <meta name="description" content="Saiba como o ChoicePDF utiliza cookies para melhorar sua experiência e garantir segurança e transparência." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Política de Cookies</h1>
    <p className="mb-4">Utilizamos cookies essenciais para garantir o funcionamento adequado das ferramentas. Estes armazenam informações como idioma preferido e configurações da interface, melhorando sua experiência sem coletar dados identificáveis.</p>
    <p className="mb-4">Também usamos cookies analíticos anonimizados para entender como os usuários interagem com a plataforma. Esses dados agregados nos ajudam a otimizar recursos e identificar possíveis falhas. Nenhum cookie é usado para fins de publicidade comportamental.</p>
    <p className="mb-4">Você pode revisar e modificar suas preferências de cookies a qualquer momento usando nosso sistema de gestão de consentimento. Nosso site está em conformidade com a LGPD e o GDPR, assegurando total transparência e controle ao usuário.</p>
  </div>
);
export default Cookies;
