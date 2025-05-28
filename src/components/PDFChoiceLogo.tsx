
import React from 'react';

interface PDFChoiceLogoProps {
  className?: string;
  showText?: boolean;
}

const PDFChoiceLogo: React.FC<PDFChoiceLogoProps> = ({ className = "w-8 h-8", showText = true }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${className} flex items-center justify-center relative overflow-hidden`}>
        <div className="w-full h-full flex items-center justify-center space-x-0.5">
          <div className="w-1 h-5 bg-red-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-orange-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-yellow-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-blue-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-purple-400 rounded-sm"></div>
          <div className="w-1 h-5 bg-pink-500 rounded-sm"></div>
        </div>
      </div>
      {showText && (
        <span className="text-black font-bold text-xl tracking-tight" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          ChoicePDF
        </span>
      )}
    </div>
  );
};

export default PDFChoiceLogo;
