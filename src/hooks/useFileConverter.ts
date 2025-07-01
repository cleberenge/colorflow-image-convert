import { useState } from 'react';
import { ConvertedFile, ConversionType } from '@/types/fileConverter';
import { validateFileCount } from '@/utils/fileValidation';
import { useClientSideConverter } from '@/hooks/useClientSideConverter';
import { useVideoConverter } from '@/hooks/useVideoConverter';

export const useFileConverter = () => {
  const [progress, setProgress] = useState(0);
  
  const { convertClientSide, isConverting: isClientConverting } = useClientSideConverter();
  const { convertVideoFiles, isConverting: isVideoConverting } = useVideoConverter();

  const isConverting = isClientConverting || isVideoConverting;

  // Progress update function that ensures always increasing values
  let currentProgress = 0;
  const updateProgress = (newProgress: number) => {
    if (newProgress > currentProgress) {
      currentProgress = newProgress;
      setProgress(currentProgress);
    }
  };

  const convertFiles = async (files: File[], conversionType: ConversionType, progressCallback?: (progress: number) => void) => {
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

      // Handle all conversions through client-side converter
      if (['png-jpg', 'jpg-pdf', 'split-pdf', 'merge-pdf', 'reduce-pdf', 'reduce-jpg', 'reduce-png', 'svg-png', 'svg-jpg', 'jpg-webp', 'html-pdf', 'csv-json', 'csv-excel'].includes(conversionType)) {
        convertedFiles = await convertClientSide(files, conversionType, progressUpdate);
      } else {
        throw new Error(`Tipo de conversão não suportado: ${conversionType}`);
      }

      return convertedFiles;

    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  };

  return {
    convertFiles,
    isConverting,
    progress,
  };
};
