
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from 'react-helmet-async'
import CookieConsentManager from "@/components/CookieConsentManager"
import '../src/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChoicePDF - O melhor e mais rápido conversor',
  description: 'O melhor e mais rápido conversor de arquivos online de forma gratuita e segura',
  keywords: 'converter PDF, PNG para JPG, JPG para PDF, dividir PDF, juntar PDF, reduzir PDF',
  authors: [{ name: 'ChoicePDF' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ChoicePDF - O melhor e mais rápido conversor',
    description: 'O melhor e mais rápido conversor de arquivos online de forma gratuita e segura',
    type: 'website',
    siteName: 'ChoicePDF',
  },
}

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon-v2.svg" type="image/svg+xml" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1335803637660594"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <TooltipProvider>
              {children}
              <CookieConsentManager />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
