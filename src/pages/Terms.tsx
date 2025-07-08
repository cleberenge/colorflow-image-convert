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
    <p className="mb-4">Ao utilizar nossos serviços, você concorda com estes termos de uso. O ChoicePDF é gratuito para fins pessoais e comerciais, respeitando limites razoáveis de uso para garantir estabilidade e qualidade para todos os usuários.</p>
    <p className="mb-4">Você é responsável por garantir que possui os direitos legais sobre os arquivos que converte e que seu uso está em conformidade com a legislação vigente. É expressamente proibido o uso da plataforma para fins ilegais, como distribuição de malware, violação de direitos autorais ou disseminação de conteúdo nocivo.</p>
    <p className="mb-4">Nos reservamos o direito de modificar estes termos e nossos serviços a qualquer momento, com aviso prévio sobre mudanças significativas. Também podemos suspender ou desativar contas ou acessos em caso de uso indevido.</p>
    <p className="mb-4">Estes termos são regidos pelas leis da República Federativa do Brasil e, subsidiariamente, por normas internacionais aplicáveis ao ambiente digital.</p>
    </div>
  </div>
);
export default Terms;
