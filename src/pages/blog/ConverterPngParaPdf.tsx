
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import ReadAlsoSection from '@/components/ReadAlsoSection';

const ConverterPngParaPdf = () => {
  return (
    <>
      <Helmet>
        <title>Como converter PNG para PDF online de forma rápida e segura | ChoicePDF</title>
        <meta name="description" content="Aprenda como converter imagens PNG em PDF de forma rápida e segura usando o ChoicePDF. Sem instalação, processamento local e totalmente gratuito." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📄 Como converter PNG para PDF online de forma rápida e segura
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Se você precisa transformar uma ou várias imagens PNG em um único documento PDF, você está no lugar certo. O ChoicePDF oferece uma forma simples, rápida e totalmente segura para realizar essa conversão sem precisar instalar nada no seu computador.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Por que converter PNG para PDF?</h2>
                <p className="mb-4">O formato PNG é ótimo para imagens de alta qualidade, mas pode não ser ideal para compartilhar ou imprimir. PDFs, por outro lado:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>São mais leves.</li>
                  <li>Mantêm a formatação.</li>
                  <li>São aceitos em praticamente qualquer lugar (e-mails, impressoras, aplicativos).</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Como converter em 3 passos</h2>
                <div className="space-y-4 mb-6">
                  <p><strong>1️⃣</strong> Acesse a página PNG para PDF do ChoicePDF.</p>
                  <p><strong>2️⃣</strong> Clique no botão para enviar suas imagens ou arraste-as para a área destacada.</p>
                  <p><strong>3️⃣</strong> Aguarde alguns segundos e baixe seu PDF já pronto!</p>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Segurança em primeiro lugar</h2>
                <p className="mb-6">
                  Seus arquivos não são enviados para nenhum servidor. Todo o processamento acontece diretamente no seu navegador, garantindo privacidade total.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    👉 Experimente agora mesmo nossa ferramenta gratuita de PNG para PDF!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReadAlsoSection currentPostId={1} />
        </main>
      </div>
    </>
  );
};

export default ConverterPngParaPdf;
