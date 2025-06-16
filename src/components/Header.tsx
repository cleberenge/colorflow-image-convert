
import React from 'react';
import { Link } from 'react-router-dom';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';
import ConversionIcon from '@/components/ConversionIcon';
import { getConversionColor } from '@/utils/conversionColors';
import { ConversionType } from '@/types/fileConverter';
import { useLanguage } from '@/hooks/useLanguage';
import { getOrderedConversions } from '@/data/conversionTypes';

interface HeaderProps {
  activeConversion: ConversionType;
}

const Header: React.FC<HeaderProps> = ({ activeConversion }) => {
  const { t, language } = useLanguage();
  const orderedConversions = getOrderedConversions();

  // QR Code para doação (usando um serviço de QR code online)
  const donationQRCode = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://donate.example.com";

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Lado esquerdo: Logo, navegação e textos principais */}
        <div className="flex items-center space-x-8">
          {/* Logo e navegação */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <PDFChoiceLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">ChoicePDF</span>
            </Link>
            
            <nav className="flex space-x-4">
              {orderedConversions.slice(0, 5).map((type) => (
                <Link
                  key={type.id}
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    activeConversion === type.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ConversionIcon conversionType={type.id} className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label[language]}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Textos principais */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-gray-700 mb-1">
              O melhor e mais rápido conversor
            </h2>
            <p className="text-sm text-gray-600">
              Ferramenta gratuita e segura para conversão de arquivo online
            </p>
          </div>
        </div>

        {/* Lado direito: QR Code para doação */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 mb-1">Apoie o projeto</p>
            <p className="text-xs text-gray-500">Escaneie para doar</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm border">
            <img 
              src={donationQRCode} 
              alt="QR Code para doação"
              className="w-16 h-16"
            />
          </div>
        </div>
      </div>
      
      {/* Versão mobile dos textos principais */}
      <div className="lg:hidden mt-4 text-center">
        <h2 className="text-lg font-bold text-gray-700 mb-1">
          O melhor e mais rápido conversor
        </h2>
        <p className="text-sm text-gray-600">
          Ferramenta gratuita e segura para conversão de arquivo online
        </p>
      </div>
    </header>
  );
};

export default Header;
