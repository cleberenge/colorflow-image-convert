
import { useState } from 'react';
import { ConvertedFile, ConversionType } from '@/types/fileConverter';
import { validateFileCount } from '@/utils/fileValidation';
import { useClientSideConverter } from '@/hooks/useClientSideConverter';

export const useFileConverter = () => {
  const [progress, setProgress] = useState(0);
  
  const { convertClientSide, isConverting: isClientConverting } = useClientSideConverter();

  const isConverting = isClientConverting;

  // Progress update function that ensures always increasing values
  let currentProgress = 0;
  const updateProgress = (newProgress: number) => {
    if (newProgress > currentProgress) {
      currentProgress = newProgress;
      setProgress(currentProgress);
    }
  };

  const convertFiles = async (files: File[], conversionType: ConversionType) => {
    try {
      // Reset progress
      currentProgress = 0;
      setProgress(0);

      // Validate file count
      validateFileCount(files);

      // Initial progress
      updateProgress(5);

      let convertedFiles: ConvertedFile[];

      // All conversions now handled client-side only
      if (['png-jpg', 'jpg-pdf', 'split-pdf', 'merge-pdf', 'reduce-pdf'].includes(conversionType)) {
        convertedFiles = await convertClientSide(files, conversionType, updateProgress);
      } else {
        throw new Error(`Tipo de conversão não suportado: ${conversionType}`);
      }

      return convertedFiles;

    } catch (error) {
      console.error('Conversion error:', error);
      // Remove toast notification for errors
      throw error;
    }
  };

  return {
    convertFiles,
    isConverting,
    progress,
  };
};
