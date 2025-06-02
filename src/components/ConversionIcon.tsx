
import React from 'react';

interface ConversionIconProps {
  conversionType: string;
  className?: string;
}

const ConversionIcon: React.FC<ConversionIconProps> = ({ conversionType, className = "w-6 h-6" }) => {
  const getIconAndColor = () => {
    switch (conversionType) {
      case 'png-jpg':
        return {
          color: '#820263', // roxo escuro (trocado com reduce-pdf)
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.5L14 17H9zm0-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
          )
        };
      case 'jpg-pdf':
        return {
          color: '#F97316',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7H9v2h6v-2zm0 4H9v2h6v-2z"/>
            </svg>
          )
        };
      case 'pdf-word':
        return {
          color: '#6366F1',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 4h2v1h-2v-1zm0 2h6v1H8v-1zm0 2h6v1H8v-1z"/>
            </svg>
          )
        };
      case 'word-pdf':
        return {
          color: '#DC2626',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 4v2h3v12h2V6h3V4H8zm6 0h5v2h-5V4zm0 4h5v2h-5V8zm0 4h5v2h-5v-2z"/>
            </svg>
          )
        };
      case 'video-mp3':
        return {
          color: '#10B981',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          )
        };
      case 'compress-video':
        return {
          color: '#8B5CF6',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )
        };
      case 'split-pdf':
        return {
          color: '#559cad',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 16H5V5h6v14zm8 0h-6V5h6v14z"/>
            </svg>
          )
        };
      case 'merge-pdf':
        return {
          color: '#F59E0B',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          )
        };
      case 'reduce-pdf':
        return {
          color: '#D81159', // rosa escuro (trocado com png-jpg)
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h7v-2H6V4h7v5h5v6h2V8l-6-6H6zm9.5 12L12 17.5 8.5 14 12 10.5 15.5 14z"/>
            </svg>
          )
        };
      default:
        return {
          color: '#6B7280',
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
