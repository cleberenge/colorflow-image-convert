
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

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
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
      </div>
    </header>
  );
};

export default Header;
