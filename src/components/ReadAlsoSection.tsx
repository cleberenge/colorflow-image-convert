import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  emoji: string;
  path: string;
}

interface ReadAlsoSectionProps {
  currentPostId?: number;
  maxPosts?: number;
}

const ReadAlsoSection: React.FC<ReadAlsoSectionProps> = ({ 
  currentPostId, 
  maxPosts = 3 
}) => {
  const blogPosts: BlogPost[] = [
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

  // Pega os próximos posts na sequência após o post atual
  const currentIndex = blogPosts.findIndex(post => post.id === currentPostId);
  const relatedPosts = currentIndex !== -1 
    ? blogPosts.slice(currentIndex + 1, currentIndex + 1 + maxPosts)
    : blogPosts.slice(0, maxPosts);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        📚 Leia também
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <Link to={post.path} className="block group">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{post.emoji}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-3">
                      <span className="text-blue-600 font-medium text-sm group-hover:underline">
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
    </div>
  );
};

export default ReadAlsoSection;