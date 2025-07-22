
import React from 'react';
import ConversionIcon from '@/components/ConversionIcon';
import { getConversionColor } from '@/utils/conversionColors';
import { ConversionType } from '@/types/fileConverter';
import { useLanguage } from '@/hooks/useLanguage';

interface ConversionSelectorProps {
  orderedConversions: any[];
  activeConversion: ConversionType;
  onConversionChange: (conversion: ConversionType) => void;
}

const ConversionSelector: React.FC<ConversionSelectorProps> = ({
  orderedConversions,
  activeConversion,
  onConversionChange
}) => {
  const { language } = useLanguage();

  // Dividir conversões em duas linhas
  const firstRow = orderedConversions.slice(0, 6);
  const secondRow = orderedConversions.slice(6, 12);

  const renderRow = (conversions: any[]) => (
    <div className="flex justify-center mb-2 max-w-3xl mx-auto rounded-lg p-0.5" style={{ backgroundColor: '#DBEAFE' }}>
      {conversions.map((type) => {
        const conversionColor = getConversionColor(type.id);
        return (
          <button
            key={type.id}
            onClick={() => onConversionChange(type.id as ConversionType)}
            className={`px-0 py-2 mx-0 flex items-center justify-center transition-all duration-300 flex-1 rounded-md ${
              activeConversion === type.id ? 'hover:bg-gray-100' : 'bg-transparent hover:bg-gray-100'
            }`}
            style={{ backgroundColor: activeConversion === type.id ? '#DBEAFE' : 'transparent' }}
          >
            <ConversionIcon conversionType={type.id} className="w-4 h-4 flex-shrink-0 mr-0.5" />
            <span 
              className="text-xs font-medium text-center leading-tight"
              style={{ color: '#000000' }}
            >
              {type.label[language]}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mb-6">
      {renderRow(firstRow)}
      {secondRow.length > 0 && renderRow(secondRow)}
    </div>
  );
};

export default ConversionSelector;
