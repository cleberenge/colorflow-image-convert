
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

  const convertFiles = async (
    files: File[], 
    conversionType: ConversionType, 
    progressCallback?: (progress: number) => void,
    options?: { password?: string }
  ) => {
    try {
      // Reset progress
      currentProgress = 0;
      setProgress(0);

      // Validate file count
      validateFileCount(files);

      // Use custom progress callback if provided, otherwise use default
      const progressUpdate = progressCallback || updateProgress;

      // Initial progress
      progressUpdate(5);

      let convertedFiles: ConvertedFile[];

      // All conversions now handled client-side only
      if (['png-jpg', 'jpg-pdf', 'split-pdf', 'merge-pdf', 'protect-pdf'].includes(conversionType)) {
        convertedFiles = await convertClientSide(files, conversionType, progressUpdate, options);
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
