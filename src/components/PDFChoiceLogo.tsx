
import React from 'react';

interface PDFChoiceLogoProps {
  className?: string;
  showText?: boolean;
}

const PDFChoiceLogo: React.FC<PDFChoiceLogoProps> = ({ className = "w-8 h-8", showText = true }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${className} flex items-center justify-center relative overflow-hidden`}>
        <img 
          src="/lovable-uploads/61301c73-295a-4acd-8a69-c87c01ecda74.png" 
          alt="ChoicePDF Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span 
          className="font-bold text-xl tracking-tight"
          style={{ 
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            color: '#787B7B',
            fontWeight: '600',
            letterSpacing: '-0.025em'
          }}
        >
          ChoicePDF
        </span>
      )}
    </div>
  );
};

export default PDFChoiceLogo;
