// Privacy.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

const Privacy = () => (
  <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Privacidade - ChoicePDF</title>
      <meta name="description" content="Saiba como protegemos seus dados e garantimos sua privacidade ao usar o ChoicePDF. Cumprimos com a LGPD e o GDPR." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
    <p className="mb-4">Sua privacidade é nossa prioridade absoluta. A maioria das conversões é processada diretamente no seu navegador, o que significa que seus arquivos nunca saem do seu dispositivo. Para os casos em que o processamento no servidor é necessário, utilizamos conexões criptografadas (HTTPS) e excluímos automaticamente todos os arquivos após a conversão.</p>
    <p className="mb-4">Não armazenamos, compartilhamos ou vendemos seus dados pessoais a terceiros. Coletamos apenas informações técnicas anônimas, como tipo de navegador e métricas de uso, exclusivamente para melhorar nossos serviços. Esses dados são agregados e não permitem identificação individual.</p>
    <p className="mb-4">Você pode revisar e ajustar suas preferências de cookies a qualquer momento por meio do nosso sistema de consentimento. Implementamos protocolos rigorosos de segurança e revisamos regularmente nossas práticas para garantir conformidade com a LGPD (Lei Geral de Proteção de Dados) e o GDPR (Regulamento Europeu de Proteção de Dados).</p>
    <p className="mb-4">Se desejar exercer seus direitos de acesso, retificação ou exclusão de dados pessoais, entre em contato conosco. Responderemos em até 10 dias úteis conforme exigido por lei.</p>
  </div>
);
export default Privacy;
