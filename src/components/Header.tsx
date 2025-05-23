
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-5 px-6 flex justify-between items-center bg-brand-teal/80 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">FC</span>
        </div>
        <span className="text-brand-cream font-semibold text-xl">File Converter</span>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="border-brand-cream text-brand-cream hover:bg-transparent hover:text-brand-yellow hover:border-brand-yellow rounded-none transition-colors duration-300"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button
          className="bg-brand-yellow hover:bg-transparent hover:border hover:border-brand-yellow hover:text-brand-yellow rounded-none transition-all duration-300"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
