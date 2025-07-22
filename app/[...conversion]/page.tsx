
import { notFound } from 'next/navigation'
import Index from '../../src/pages/Index'
import type { Metadata } from 'next'

// Mapeamento de URLs para tipos de conversão
const CONVERSION_ROUTES = {
  'png-to-jpg': 'png-jpg',
  'jpg-to-pdf': 'jpg-pdf',
  'split-pdf': 'split-pdf',
  'merge-pdf': 'merge-pdf',
  'reduce-pdf': 'reduce-pdf',
  'reduce-jpg': 'reduce-jpg',
  'reduce-png': 'reduce-png',
  'svg-to-png': 'svg-png',
  'jpg-to-webp': 'jpg-webp',
  'svg-to-jpg': 'svg-jpg',
  'html-to-pdf': 'html-pdf',
  'csv-to-json': 'csv-json',
  'csv-to-excel': 'csv-excel'
} as const

const CONVERSION_METADATA = {
  'png-to-jpg': {
    title: 'Converter PNG para JPG - ChoicePDF',
    description: 'Converta PNG para JPG online de forma gratuita e segura com ChoicePDF'
  },
  'jpg-to-pdf': {
    title: 'Converter JPG para PDF - ChoicePDF',
    description: 'Converta JPG para PDF online de forma gratuita e segura com ChoicePDF'
  },
  'split-pdf': {
    title: 'Dividir PDF - ChoicePDF',
    description: 'Divida PDF online de forma gratuita e segura com ChoicePDF'
  },
  'merge-pdf': {
    title: 'Juntar PDF - ChoicePDF',
    description: 'Junte PDF online de forma gratuita e segura com ChoicePDF'
  },
  'reduce-pdf': {
    title: 'Reduzir PDF - ChoicePDF',
    description: 'Reduza PDF online de forma gratuita e segura com ChoicePDF'
  },
  'reduce-jpg': {
    title: 'Reduzir JPG - ChoicePDF',
    description: 'Reduza JPG online de forma gratuita e segura com ChoicePDF'
  },
  'reduce-png': {
    title: 'Reduzir PNG - ChoicePDF',
    description: 'Reduza PNG online de forma gratuita e segura com ChoicePDF'
  },
  'svg-to-png': {
    title: 'Converter SVG para PNG - ChoicePDF',
    description: 'Converta SVG para PNG online de forma gratuita e segura com ChoicePDF'
  },
  'jpg-to-webp': {
    title: 'Converter JPG para WebP - ChoicePDF',
    description: 'Converta JPG para WebP online de forma gratuita e segura com ChoicePDF'
  },
  'svg-to-jpg': {
    title: 'Converter SVG para JPG - ChoicePDF',
    description: 'Converta SVG para JPG online de forma gratuita e segura com ChoicePDF'
  },
  'html-to-pdf': {
    title: 'Converter HTML para PDF - ChoicePDF',
    description: 'Converta HTML para PDF online de forma gratuita e segura com ChoicePDF'
  },
  'csv-to-json': {
    title: 'Converter CSV para JSON - ChoicePDF',
    description: 'Converta CSV para JSON online de forma gratuita e segura com ChoicePDF'
  },
  'csv-to-excel': {
    title: 'Converter CSV para Excel - ChoicePDF',
    description: 'Converta CSV para Excel online de forma gratuita e segura com ChoicePDF'
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { conversion: string[] } 
}): Promise<Metadata> {
  const conversionPath = params.conversion[0]
  const metadata = CONVERSION_METADATA[conversionPath as keyof typeof CONVERSION_METADATA]
  
  if (!metadata) {
    return {
      title: 'ChoicePDF - O melhor e mais rápido conversor',
      description: 'O melhor e mais rápido conversor de arquivos online de forma gratuita e segura'
    }
  }

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
    },
    alternates: {
      canonical: `https://choicepdf.com/${conversionPath}`
    }
  }
}

export default function ConversionPage({ 
  params 
}: { 
  params: { conversion: string[] } 
}) {
  const conversionPath = params.conversion[0]
  const conversionType = CONVERSION_ROUTES[conversionPath as keyof typeof CONVERSION_ROUTES]
  
  if (!conversionType) {
    notFound()
  }
  
  return <Index />
}

export async function generateStaticParams() {
  return Object.keys(CONVERSION_ROUTES).map((conversion) => ({
    conversion: [conversion],
  }))
}
