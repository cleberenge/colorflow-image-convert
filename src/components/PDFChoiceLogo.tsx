
import React from 'react';

interface PDFChoiceLogoProps {
  className?: string;
  showText?: boolean;
}

const PDFChoiceLogo: React.FC<PDFChoiceLogoProps> = ({ className = "w-8 h-8", showText = true }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`${className} rounded-lg flex items-center justify-center relative overflow-hidden`}
           style={{ background: 'linear-gradient(135deg, #D81159 0%, #F97316 50%, #10B981 100%)' }}>
        <svg className="w-5 h-5 text-white font-bold" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
      </div>
      {showText && (
        <span className="text-gray-700 font-bold text-xl">PDFChoice</span>
      )}
    </div>
  );
};

export default PDFChoiceLogo;
