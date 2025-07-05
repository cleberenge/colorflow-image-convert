
import { ConversionType } from '@/types/fileConverter';
import { getConversionColor } from '@/utils/conversionColors';

export const useConversionColors = () => {
  // Função para definir a cor do texto na área de upload para cada tipo de conversão
  const getUploadTextColor = (conversionType: ConversionType): string => {
    const textColorMap: Record<ConversionType, string> = {
      'png-jpg': '#000000',          
      'jpg-pdf': '#000000',          
      'split-pdf': '#000000',        
      'merge-pdf': '#000000',        
      'reduce-pdf': '#FFFFFF',       
      'reduce-jpg': '#EB5559',       
      'reduce-png': '#FFFFFF',       
      'svg-png': '#000000',          
      'jpg-webp': '#FFFFFF',         
      'svg-jpg': '#FDEE00',          
      'html-pdf': '#C2FBEF',         
      'csv-json': '#000000',         
      'csv-excel': '#FFFFFF',        
    };
    
    return textColorMap[conversionType] || '#000000';
  };

  // Função para definir a cor do texto dos botões
  const getButtonTextColor = (conversionType: ConversionType): string => {
    const buttonTextColorMap: Record<ConversionType, string> = {
      'png-jpg': '#000000',          
      'jpg-pdf': '#000000',          
      'split-pdf': '#000000',        
      'merge-pdf': '#000000',        
      'reduce-pdf': '#FFFFFF',       
      'reduce-jpg': '#EB5559',       
      'reduce-png': '#FFFFFF',       
      'svg-png': '#000000',          
      'jpg-webp': '#FFFFFF',         
      'svg-jpg': '#FDEE00',          
      'html-pdf': '#C2FBEF',         
      'csv-json': '#000000',         
      'csv-excel': '#FFFFFF',        
    };
    
    return buttonTextColorMap[conversionType] || '#FFFFFF';
  };

  // Função para definir a cor dos números dos arquivos
  const getFileNumberColor = (conversionType: ConversionType): string => {
    const numberColorMap: Record<ConversionType, string> = {
      'png-jpg': '#000000',          
      'jpg-pdf': '#000000',          
      'split-pdf': '#000000',        
      'merge-pdf': '#000000',        
      'reduce-pdf': '#FFFFFF',       
      'reduce-jpg': '#EB5559',       
      'reduce-png': '#FFFFFF',       
      'svg-png': '#000000',          
      'jpg-webp': '#FFFFFF',         
      'svg-jpg': '#FDEE00',          
      'html-pdf': '#C2FBEF',         
      'csv-json': '#000000',         
      'csv-excel': '#FFFFFF',        
    };
    
    return numberColorMap[conversionType] || '#FFFFFF';
  };

  return {
    getUploadTextColor,
    getButtonTextColor,
    getFileNumberColor,
    getConversionColor
  };
};
