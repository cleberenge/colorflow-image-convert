
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

  return (
    <div className="flex justify-center mb-6 max-w-3xl mx-auto">
      {orderedConversions.map((type) => {
        const conversionColor = getConversionColor(type.id);
        return (
          <button
            key={type.id}
            onClick={() => onConversionChange(type.id as ConversionType)}
            className="px-2 py-2 mx-0 flex items-center justify-center transition-all duration-300 flex-1 rounded-md relative"
            style={{
              boxShadow: activeConversion === type.id 
                ? `0 0 20px ${conversionColor}60, 0 0 40px ${conversionColor}30` 
                : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 25px ${conversionColor}70, 0 0 50px ${conversionColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = activeConversion === type.id 
                ? `0 0 20px ${conversionColor}60, 0 0 40px ${conversionColor}30` 
                : 'none';
            }}
          >
            <ConversionIcon conversionType={type.id} className="w-4 h-4 flex-shrink-0 mr-0.5" />
            <span 
              className={`text-xs font-medium text-center leading-tight ${
                activeConversion === type.id ? 'text-black' : 'text-gray-600'
              }`}
            >
              {type.label[language]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ConversionSelector;
