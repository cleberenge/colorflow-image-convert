
import { ConversionType } from '@/types/fileConverter';

const conversionColors: Record<ConversionType, string> = {
  'png-jpg': '#FFD700',
  'jpg-pdf': '#FF6B6B',
  'split-pdf': '#4ECDC4',
  'merge-pdf': '#45B7D1',
  'protect-pdf': '#9B59B6'
};

export const getConversionColor = (conversionType: ConversionType): string => {
  return conversionColors[conversionType] || '#6B7280';
};
