
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ConverterPngParaPdf from '../../../src/pages/blog/ConverterPngParaPdf'
import DiferencaJpgPngPdf from '../../../src/pages/blog/DiferencaJpgPngPdf'
import ReduzirTamanhoPdf from '../../../src/pages/blog/ReduzirTamanhoPdf'
import ProtegerPdfSenha from '../../../src/pages/blog/ProtegerPdfSenha'
import ErrosEnviarArquivosEmail from '../../../src/pages/blog/ErrosEnviarArquivosEmail'

const BLOG_POSTS = {
  'converter-png-para-pdf': {
    component: ConverterPngParaPdf,
    title: 'Como converter PNG para PDF de forma rápida e fácil',
    description: 'Aprenda como converter arquivos PNG para PDF online de forma gratuita e segura'
  },
  'diferenca-jpg-png-pdf': {
    component: DiferencaJpgPngPdf,
    title: 'Diferenças entre JPG, PNG e PDF: Qual usar?',
    description: 'Entenda as principais diferenças entre os formatos JPG, PNG e PDF'
  },
  'reduzir-tamanho-pdf': {
    component: ReduzirTamanhoPdf,
    title: 'Como reduzir o tamanho de um PDF sem perder qualidade',
    description: 'Aprenda como reduzir o tamanho de arquivos PDF mantendo a qualidade'
  },
  'proteger-pdf-senha': {
    component: ProtegerPdfSenha,
    title: 'Como proteger PDF com senha',
    description: 'Aprenda como adicionar senha de proteção aos seus arquivos PDF'
  },
  'erros-enviar-arquivos-email': {
    component: ErrosEnviarArquivosEmail,
    title: 'Erros comuns ao enviar arquivos por email',
    description: 'Conheça os erros mais comuns ao enviar arquivos por email e como evitá-los'
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = BLOG_POSTS[params.slug as keyof typeof BLOG_POSTS]
  
  if (!post) {
    return {
      title: 'Post não encontrado - ChoicePDF',
      description: 'O post que você procura não foi encontrado'
    }
  }

  return {
    title: `${post.title} | ChoicePDF`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
    alternates: {
      canonical: `https://choicepdf.com/blog/${params.slug}`
    }
  }
}

export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = BLOG_POSTS[params.slug as keyof typeof BLOG_POSTS]
  
  if (!post) {
    notFound()
  }
  
  const Component = post.component
  return <Component />
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({
    slug,
  }))
}
