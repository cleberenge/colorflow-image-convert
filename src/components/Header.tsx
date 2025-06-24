
import React from 'react';
import { Link } from 'react-router-dom';
import { getConversionColor } from '@/utils/conversionColors';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  return (
    <header className="w-full py-5 px-6 flex justify-start items-center" style={{ backgroundColor: '#DBEAFE' }}>
      <Link to="/" onClick={() => window.location.href = '/'}>
        <PDFChoiceLogo />
      </Link>
    </header>
  );
};

export default Header;
