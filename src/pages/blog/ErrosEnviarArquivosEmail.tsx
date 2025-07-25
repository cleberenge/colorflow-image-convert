
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import ReadAlsoSection from '@/components/ReadAlsoSection';

const ErrosEnviarArquivosEmail = () => {
  return (
    <>
      <Helmet>
        <title>Os 5 erros mais comuns ao enviar arquivos por e-mail | ChoicePDF</title>
        <meta name="description" content="Evite os erros mais comuns ao enviar arquivos por e-mail. Dicas práticas para enviar documentos de forma profissional." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📄 Os 5 erros mais comuns ao enviar arquivos por e-mail (e como evitar)
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Enviar arquivos por e-mail parece simples, mas muitos cometem erros que poderiam ser evitados com pequenas mudanças.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1️⃣ Enviar arquivos muito pesados</h2>
                <p className="mb-6">Use formatos otimizados e, se necessário, compacte os arquivos antes.</p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2️⃣ Não converter para PDF</h2>
                <p className="mb-6">Arquivos editáveis (como Word ou PowerPoint) podem ter a formatação alterada ao abrir. Sempre prefira enviar em PDF.</p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3️⃣ Nomear mal os arquivos</h2>
                <p className="mb-6">Evite nomes como "arquivo_final_versao2_corrigido.pdf". Use nomes claros: "contrato_cliente_junho2025.pdf".</p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4️⃣ Esquecer anexos</h2>
                <p className="mb-6">Sim, isso ainda acontece. Verifique antes de enviar.</p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5️⃣ Enviar para a pessoa errada</h2>
                <p className="mb-6">Revise os destinatários para não expor informações sensíveis.</p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Dica bônus</h2>
                <p className="mb-6">
                  Para compartilhar muitos arquivos, considere enviar um link para um serviço de nuvem em vez de anexá-los todos ao e-mail.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    👉 Use as ferramentas do ChoicePDF para preparar seus arquivos e enviar de forma profissional!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReadAlsoSection currentPostId={5} />
        </main>
      </div>
    </>
  );
};

export default ErrosEnviarArquivosEmail;
