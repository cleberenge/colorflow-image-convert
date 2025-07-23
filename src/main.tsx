import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import CookieConsentManager from "@/components/CookieConsentManager"
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <TooltipProvider>
            <App />
            <CookieConsentManager />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>,
)