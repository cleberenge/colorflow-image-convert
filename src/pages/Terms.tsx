
// Terms.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from '@/components/Header';

const Terms = () => (
  <div className="min-h-screen bg-white text-gray-700">
    <Header />
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
    <Helmet>
      <title>Termos de Uso - ChoicePDF</title>
      <meta name="description" content="Leia os termos de uso da plataforma ChoicePDF. Entenda suas responsabilidades e as regras de utilização dos nossos serviços." />
    </Helmet>
    <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
    <p className="mb-4">Ao utilizar os serviços do ChoicePDF, você concorda com estes Termos de Uso. Nosso serviço é gratuito para fins pessoais e comerciais, desde que respeitados limites de uso justos e razoáveis, para garantir estabilidade e qualidade para todos os usuários.</p>
    <p className="mb-4">É sua responsabilidade garantir que possui os direitos legais sobre os arquivos que envia e que seu uso está em conformidade com a legislação vigente. É proibido utilizar a plataforma para qualquer atividade ilegal, como distribuição de malware, violação de direitos autorais ou disseminação de conteúdo nocivo.</p>
    <p className="mb-4">Podemos alterar estes termos e os serviços a qualquer momento, com aviso prévio em caso de mudanças significativas. Também podemos suspender ou desativar acessos em caso de uso indevido ou abusivo.</p>
    <p className="mb-4">Estes Termos são regidos pelas leis da República Federativa do Brasil e, quando aplicável, por normas internacionais que regulam o ambiente digital.</p>
    </div>
  </div>
);
export default Terms;
