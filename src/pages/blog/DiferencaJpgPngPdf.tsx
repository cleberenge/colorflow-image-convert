
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import ReadAlsoSection from '@/components/ReadAlsoSection';

const DiferencaJpgPngPdf = () => {
  return (
    <>
      <Helmet>
        <title>Qual é a diferença entre JPG, PNG e PDF? | ChoicePDF</title>
        <meta name="description" content="Entenda as diferenças entre os formatos JPG, PNG e PDF. Saiba quando usar cada formato para obter os melhores resultados." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📄 Qual é a diferença entre JPG, PNG e PDF?
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Você já se perguntou qual a diferença entre esses formatos tão comuns? Cada um tem suas vantagens e serve para situações específicas. Vamos explicar para você!
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">📷 JPG</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>Comprime as imagens para ocupar menos espaço.</li>
                  <li>Ideal para fotos e compartilhamento rápido.</li>
                  <li>Pode perder um pouco da qualidade.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">🖼 PNG</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>Mantém alta qualidade, sem perdas.</li>
                  <li>Suporta transparência.</li>
                  <li>Ideal para logos, gráficos e imagens detalhadas.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">📄 PDF</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>Formato universal para documentos.</li>
                  <li>Mantém texto, imagens e layout intactos.</li>
                  <li>Perfeito para impressão ou envio formal.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Quando usar cada um?</h2>
                <div className="space-y-2 mb-6">
                  <p><strong>✔ JPG:</strong> para fotos e redes sociais.</p>
                  <p><strong>✔ PNG:</strong> para gráficos, transparências ou qualidade máxima.</p>
                  <p><strong>✔ PDF:</strong> para documentos finais, apresentações ou quando quiser garantir que nada será alterado.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    👉 Transforme seus arquivos para o formato ideal com as ferramentas do ChoicePDF!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReadAlsoSection currentPostId={2} />
        </main>
      </div>
    </>
  );
};

export default DiferencaJpgPngPdf;
