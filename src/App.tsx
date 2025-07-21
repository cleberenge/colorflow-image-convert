
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import CookieConsentManager from "@/components/CookieConsentManager";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Transparency from "./pages/Transparency";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import ConverterPngParaPdf from "./pages/blog/ConverterPngParaPdf";
import DiferencaJpgPngPdf from "./pages/blog/DiferencaJpgPngPdf";
import ReduzirTamanhoPdf from "./pages/blog/ReduzirTamanhoPdf";
import ProtegerPdfSenha from "./pages/blog/ProtegerPdfSenha";
import ErrosEnviarArquivosEmail from "./pages/blog/ErrosEnviarArquivosEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/png-to-jpg" element={<Index />} />
            <Route path="/jpg-to-pdf" element={<Index />} />
            <Route path="/split-pdf" element={<Index />} />
            <Route path="/merge-pdf" element={<Index />} />
            <Route path="/reduce-pdf" element={<Index />} />
            <Route path="/reduce-jpg" element={<Index />} />
            <Route path="/reduce-png" element={<Index />} />
            <Route path="/svg-to-png" element={<Index />} />
            <Route path="/jpg-to-webp" element={<Index />} />
            <Route path="/svg-to-jpg" element={<Index />} />
            <Route path="/html-to-pdf" element={<Index />} />
            <Route path="/csv-to-json" element={<Index />} />
            <Route path="/csv-to-excel" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/blog/converter-png-para-pdf" element={<ConverterPngParaPdf />} />
            <Route path="/blog/diferenca-jpg-png-pdf" element={<DiferencaJpgPngPdf />} />
            <Route path="/blog/reduzir-tamanho-pdf" element={<ReduzirTamanhoPdf />} />
            <Route path="/blog/proteger-pdf-senha" element={<ProtegerPdfSenha />} />
            <Route path="/blog/erros-enviar-arquivos-email" element={<ErrosEnviarArquivosEmail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsentManager />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
