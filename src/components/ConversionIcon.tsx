
import React from 'react';
import { getConversionColor } from '@/utils/conversionColors';

interface ConversionIconProps {
  conversionType: string;
  className?: string;
}

const ConversionIcon: React.FC<ConversionIconProps> = ({ conversionType, className = "w-6 h-6" }) => {
  const getIconAndColor = () => {
    // Usar a mesma cor da área de upload
    const color = getConversionColor(conversionType);
    
    switch (conversionType) {
      case 'png-jpg':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.5L14 17H9zm0-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
          )
        };
      case 'jpg-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7H9v2h6v-2zm0 4H9v2h6v-2z"/>
            </svg>
          )
        };
      case 'pdf-word':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 4h2v1h-2v-1zm0 2h6v1H8v-1zm0 2h6v1H8v-1z"/>
            </svg>
          )
        };
      case 'word-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 4v2h3v12h2V6h3V4H8zm6 0h5v2h-5V4zm0 4h5v2h-5V8zm0 4h5v2h-5v-2z"/>
            </svg>
          )
        };
      case 'reduce-png':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 16H5V5h14v14zm-9-9h4v4h-4v-4zm2 2h2v2h-2v-2z"/>
              <circle cx="8" cy="8" r="1"/>
            </svg>
          )
        };
      case 'reduce-jpg':
        return {
          color,
          icon: (
            <svg className="w-3 h-3" fill="#EB5559" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14l-5-5 1.41-1.41L14 14.17V7h2v10h-2z"/>
            </svg>
          )
        };
      case 'compress-video':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )
        };
      case 'split-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 16H5V5h6v14zm8 0h-6V5h6v14z"/>
            </svg>
          )
        };
      case 'merge-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          )
        };
      case 'reduce-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h7v-2H6V4h7v5h5v6h2V8l-6-6H6zm9.5 12L12 17.5 8.5 14 12 10.5 15.5 14z"/>
            </svg>
          )
        };
      // Ícones únicos e melhorados
      case 'svg-png':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L8 7h3v8h2V7h3l-4-5zm-8 16h16v2H4v-2zm4-4h8l-4-4-4 4z"/>
            </svg>
          )
        };
      case 'jpg-webp':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 5v9l-3-3-4 4-4-4-4 4V5h15zm-15 0H2v16h20V5h-2L12 13 4 5z"/>
              <path d="M7 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
            </svg>
          )
        };
      case 'svg-jpg':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M15 12l-3 3-3-3h2V8h2v4h2z"/>
            </svg>
          )
        };
      case 'html-pdf':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-2 16H10v-2h7v2zm0-4H10v-2h7v2zm0-4H10V9h7v4z"/>
            </svg>
          )
        };
      case 'csv-json':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm0 7V3.5L18.5 9H14zm-4 4h4v1h-4v-1zm0 2h6v1h-6v-1zm0 2h4v1h-4v-1z"/>
              <circle cx="8" cy="13" r="1"/>
              <circle cx="8" cy="15" r="1"/>
              <circle cx="8" cy="17" r="1"/>
            </svg>
          )
        };
      case 'csv-excel':
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-6-8H8v2h4v-2zm4 0h-2v2h2v-2zM8 14h4v2H8v-2zm6 0h2v2h-2v-2z"/>
            </svg>
          )
        };
      default:
        return {
          color,
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6z"/>
            </svg>
          )
        };
    }
  };

  const { color, icon } = getIconAndColor();

  return (
    <div 
      className={`${className} flex items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
  );
};

export default ConversionIcon;
