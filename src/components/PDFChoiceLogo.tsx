
import React from 'react';

interface PDFChoiceLogoProps {
  className?: string;
  showText?: boolean;
}

const PDFChoiceLogo: React.FC<PDFChoiceLogoProps> = ({ className = "w-8 h-8", showText = true }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${className} rounded-xl flex items-center justify-center relative overflow-hidden`}
           style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)' }}>
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
      </div>
      {showText && (
        <span className="text-gray-900 font-bold text-xl tracking-tight" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          ChoicePDF
        </span>
      )}
    </div>
  );
};

export default PDFChoiceLogo;
