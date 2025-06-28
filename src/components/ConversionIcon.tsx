
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
          color: '#47E5BC', // atualizado conforme solicitado
          icon: (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.5L14 17H9zm0-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
          )
        };
      case 'jpg-pdf':
        return {
          color: '#FDEE00', // atualizado conforme solicitado
          icon: (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
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
          color: '#F9F9F9', // atualizado conforme solicitado (Reduzir PNG)
          icon: (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
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
          color: '#73D2DE',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 16H5V5h6v14zm8 0h-6V5h6v14z"/>
            </svg>
          )
        };
      case 'merge-pdf':
        return {
          color: '#FF0097', // atualizado conforme solicitado
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          )
        };
      case 'reduce-pdf':
        return {
          color: '#784F41',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h7v-2H6V4h7v5h5v6h2V8l-6-6H6zm9.5 12L12 17.5 8.5 14 12 10.5 15.5 14z"/>
            </svg>
          )
        };
      // Novas conversões
      case 'svg-png':
        return {
          color: '#10B981',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )
        };
      case 'jpg-webp':
        return {
          color: '#3B82F6',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )
        };
      case 'svg-jpg':
        return {
          color: '#EF4444',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H15V1h-6v1H3.5c-.55 0-1 .45-1 1s.45 1 1 1H4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4h.5c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
          )
        };
      case 'html-pdf':
        return {
          color: '#8B5CF6',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          )
        };
      case 'csv-json':
        return {
          color: '#F59E0B',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
            </svg>
          )
        };
      case 'csv-excel':
        return {
          color: '#059669',
          icon: (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-6-8H8v2h4v-2zm4 0h-2v2h2v-2zM8 14h4v2H8v-2zm6 0h2v2h-2v-2z"/>
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
