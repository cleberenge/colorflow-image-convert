
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import ReadAlsoSection from '@/components/ReadAlsoSection';

const ProtegerPdfSenha = () => {
  return (
    <>
      <Helmet>
        <title>Guia completo: proteger um PDF com senha | ChoicePDF</title>
        <meta name="description" content="Aprenda como proteger documentos PDF com senha para garantir a segurança de informações confidenciais." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📄 Guia completo: proteger um PDF com senha
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Documentos com informações confidenciais precisam ser protegidos. Adicionar uma senha ao seu PDF é uma forma eficaz de impedir acessos não autorizados.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Por que proteger um PDF?</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>Evita que terceiros leiam ou editem o arquivo.</li>
                  <li>Protege contratos, relatórios financeiros e dados pessoais.</li>
                  <li>Garante que apenas quem tem a senha possa abrir.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Como proteger</h2>
                <div className="space-y-4 mb-6">
                  <p><strong>1️⃣</strong> Acesse uma ferramenta de proteção de PDF (em breve no ChoicePDF).</p>
                  <p><strong>2️⃣</strong> Envie o arquivo e escolha uma senha segura.</p>
                  <p><strong>3️⃣</strong> Baixe o PDF protegido.</p>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Senhas seguras</h2>
                <p className="mb-6">
                  Use combinações de letras maiúsculas, minúsculas, números e símbolos para tornar sua senha mais forte.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    👉 Assim que a ferramenta estiver disponível, proteja seus documentos com segurança no ChoicePDF!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReadAlsoSection currentPostId={4} />
        </main>
      </div>
    </>
  );
};

export default ProtegerPdfSenha;
