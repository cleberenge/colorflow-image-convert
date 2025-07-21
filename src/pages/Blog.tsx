
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Como converter PNG para PDF online de forma rápida e segura",
      description: "Converta PNG em PDF de forma rápida e segura sem instalar nada",
      emoji: "📄",
      path: "/blog/converter-png-para-pdf"
    },
    {
      id: 2,
      title: "Diferença entre JPG, PNG e PDF",
      description: "Entenda qual formato usar em cada situação",
      emoji: "📄",
      path: "/blog/diferenca-jpg-png-pdf"
    },
    {
      id: 3,
      title: "Como reduzir tamanho de PDF",
      description: "Comprima PDFs sem perder qualidade",
      emoji: "📄",
      path: "/blog/reduzir-tamanho-pdf"
    },
    {
      id: 4,
      title: "Como proteger PDF com senha",
      description: "Guia completo para proteger documentos confidenciais",
      emoji: "📄",
      path: "/blog/proteger-pdf-senha"
    },
    {
      id: 5,
      title: "5 erros ao enviar arquivos por e-mail",
      description: "Como evitar problemas comuns no envio de documentos",
      emoji: "📄",
      path: "/blog/erros-enviar-arquivos-email"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blog - ChoicePDF</title>
        <meta name="description" content="Dicas e tutoriais sobre conversão de arquivos, PDFs e formatos de documentos no blog do ChoicePDF." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: '#DBEAFE' }}>
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📚 Blog ChoicePDF
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dicas, tutoriais e guias sobre conversão de arquivos, PDFs e muito mais para você usar melhor nossas ferramentas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {blogPosts.map((post) => (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <Link to={post.path} className="block group">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{post.emoji}</div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {post.description}
                        </p>
                        <div className="mt-3">
                          <span className="text-blue-600 font-medium group-hover:underline">
                            Ler mais →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  💡 Tem alguma dúvida?
                </h3>
                <p className="text-gray-600 mb-4">
                  Não encontrou o que procurava? Entre em contato conosco!
                </p>
                <Link 
                  to="/contact" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Falar Conosco
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
