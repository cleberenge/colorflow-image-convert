
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { getConversionColor } from '@/utils/conversionColors';

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  const conversionColor = getConversionColor(activeConversion);

  return (
    <header className="w-full py-5 px-6 flex justify-between items-center bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">FC</span>
        </div>
        <span className="text-gray-700 font-semibold text-xl">File Converter</span>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors duration-300"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button
          className="text-white rounded-lg transition-all duration-300"
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
