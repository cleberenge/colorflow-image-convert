
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import ReadAlsoSection from '@/components/ReadAlsoSection';

const ReduzirTamanhoPdf = () => {
  return (
    <>
      <Helmet>
        <title>Como reduzir o tamanho de um PDF sem perder qualidade | ChoicePDF</title>
        <meta name="description" content="Aprenda como reduzir o tamanho de arquivos PDF sem comprometer a qualidade. Dicas práticas para comprimir PDFs eficientemente." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📄 Como reduzir o tamanho de um PDF sem perder qualidade
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Os PDFs podem ficar pesados demais para enviar por e-mail ou subir em plataformas. Mas não se preocupe: dá para reduzir o tamanho sem comprometer a legibilidade.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Por que os PDFs ficam pesados?</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>Imagens em alta resolução.</li>
                  <li>Scans de documentos sem compressão.</li>
                  <li>Elementos desnecessários no arquivo.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Como comprimir seu PDF</h2>
                <div className="space-y-4 mb-6">
                  <p><strong>1️⃣</strong> Use uma ferramenta online de compressão de PDF.</p>
                  <p><strong>2️⃣</strong> Otimize as imagens antes de salvar no PDF.</p>
                  <p><strong>3️⃣</strong> Remova páginas ou elementos desnecessários.</p>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Dica extra</h2>
                <p className="mb-6">
                  Sempre guarde uma cópia do original antes de reduzir, caso precise da qualidade máxima depois.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    👉 Em breve teremos também nossa ferramenta de compressão no ChoicePDF. Fique ligado!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReadAlsoSection currentPostId={3} />
        </main>
      </div>
    </>
  );
};

export default ReduzirTamanhoPdf;
