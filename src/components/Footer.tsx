
import React from 'react';
import { Link } from 'react-router-dom';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <PDFChoiceLogo />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              ChoicePDF é sua ferramenta online gratuita para converter, comprimir e manipular arquivos PDF e imagens. 
              Rápido, seguro e fácil de usar.
            </p>
          </div>

          {/* Links institucionais */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Sobre o ChoicePDF
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Transparência
                </Link>
              </li>
            </ul>
          </div>

          {/* Links legais */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ChoicePDF. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
