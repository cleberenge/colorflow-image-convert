
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConvertedFile, ConversionType } from '@/types/fileConverter';
import { validateFileCount } from '@/utils/fileValidation';
import { useClientSideConverter } from '@/hooks/useClientSideConverter';
import { useVideoConverter } from '@/hooks/useVideoConverter';
import { useServerSideConverter } from '@/hooks/useServerSideConverter';

export const useFileConverter = () => {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const { convertClientSide, isConverting: isClientConverting } = useClientSideConverter();
  const { convertVideoFiles, isConverting: isVideoConverting } = useVideoConverter();
  const { convertServerSide, isConverting: isServerConverting } = useServerSideConverter();

  const isConverting = isClientConverting || isVideoConverting || isServerConverting;

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
      updateProgress(10);

      let convertedFiles: ConvertedFile[];

      // Determine conversion method based on type
      if (['png-jpg', 'jpg-pdf', 'word-pdf'].includes(conversionType)) {
        convertedFiles = await convertClientSide(files, conversionType, updateProgress);
      } else if (['video-mp3', 'compress-video'].includes(conversionType)) {
        convertedFiles = await convertVideoFiles(files, conversionType, updateProgress);
      } else {
        convertedFiles = await convertServerSide(files, conversionType, updateProgress);
      }

      return convertedFiles;

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os arquivos.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    convertFiles,
    isConverting,
    progress,
  };
};
