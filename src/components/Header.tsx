
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-8 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PC</span>
        </div>
        <span className="text-brand-teal font-semibold text-xl">PNG Converter</span>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button
          className="bg-brand-blue hover:bg-brand-teal text-white transition-all duration-300"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
