
import React from 'react';
import { Link } from 'react-router-dom';
import { getConversionColor } from '@/utils/conversionColors';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  return (
    <header className="w-full py-5 px-6 flex items-center relative" style={{ backgroundColor: '#DBEAFE' }}>
      {/* Navigation positioned 8px to the left of the logo */}
      <div className="flex items-center space-x-6 mr-2">
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
      </div>
      
      <Link to="/" onClick={() => window.location.href = '/'}>
        <PDFChoiceLogo />
      </Link>
    </header>
  );
};

export default Header;
