
import React from 'react';
import { Link } from 'react-router-dom';
import { getConversionColor } from '@/utils/conversionColors';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  return (
    <header className="w-full py-5 px-6 flex justify-between items-center" style={{ backgroundColor: '#DBEAFE' }}>
      <Link to="/" onClick={() => window.location.href = '/'}>
        <PDFChoiceLogo />
      </Link>
      
      <nav className="flex items-center space-x-6" style={{ marginRight: '-8px' }}>
        <Link 
          to="/blog" 
          className="font-medium transition-colors"
          style={{ color: '#787B7B' }}
        >
          Blog
        </Link>
        <Link 
          to="/contact" 
          className="font-medium transition-colors"
          style={{ color: '#787B7B' }}
        >
          Contato
        </Link>
      </nav>
    </header>
  );
};

export default Header;
