
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { getConversionColor } from '@/utils/conversionColors';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  const conversionColor = getConversionColor(activeConversion);

  return (
    <header className="w-full py-5 px-6 flex justify-between items-center bg-white border-b border-gray-200">
      <PDFChoiceLogo />
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 rounded-none transition-colors duration-300"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button
          className="text-white rounded-none transition-all duration-300"
          style={{ 
            backgroundColor: conversionColor,
            borderColor: conversionColor
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
