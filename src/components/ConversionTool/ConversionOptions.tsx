
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConversionIcon from '@/components/ConversionIcon';
import { ConversionType } from '@/types/fileConverter';

interface ConversionOption {
  value: ConversionType;
  label: string;
  description: string;
}

interface ConversionOptionsProps {
  selectedConversion: ConversionType;
  onConversionChange: (value: string) => void;
}

const conversionOptions: ConversionOption[] = [
  { value: 'png-jpg', label: 'Converter PNG para JPG', description: '' },
  { value: 'jpg-pdf', label: 'Converter JPG para PDF', description: '' },
  { value: 'split-pdf', label: 'Dividir PDF', description: '' },
  { value: 'merge-pdf', label: 'Juntar PDF', description: '' },
  { value: 'reduce-pdf', label: 'Reduzir PDF', description: '' },
  { value: 'reduce-jpg', label: 'Reduzir JPG', description: '' },
  { value: 'reduce-png', label: 'Reduzir PNG', description: '' },
  { value: 'svg-png', label: 'Converter SVG para PNG', description: '' },
  { value: 'jpg-webp', label: 'Converter JPG para WebP', description: '' },
  { value: 'svg-jpg', label: 'Converter SVG para JPG', description: '' },
  { value: 'html-pdf', label: 'Converter HTML para PDF', description: '' },
  { value: 'csv-json', label: 'Converter CSV para JSON', description: '' },
  { value: 'csv-excel', label: 'Converter CSV para Excel', description: '' },
];

const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  selectedConversion,
  onConversionChange
}) => {
  return (
    <Card className="w-full max-w-3xl p-2 bg-white border border-gray-200">
      <div className="space-y-2">
        <h2 className="text-base font-semibold" style={{ color: '#000000' }}>Opções de Conversão</h2>
        <Select onValueChange={onConversionChange} value={selectedConversion}>
          <SelectTrigger className="w-full [&>svg]:hidden">
            <SelectValue placeholder="Selecione o tipo de conversão" />
          </SelectTrigger>
          <SelectContent>
            {conversionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <ConversionIcon conversionType={option.value} className="w-5 h-5" />
                  <span style={{ color: '#000000' }}>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default ConversionOptions;
