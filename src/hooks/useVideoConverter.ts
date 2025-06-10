
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ConvertedFile } from '@/types/fileConverter';
import { validateVideoFile } from '@/utils/fileValidation';

export const useVideoConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertVideoFiles = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];
    const progressPerFile = 60 / files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validação específica para vídeo
        validateVideoFile(file, conversionType);
        
        const fileStartProgress = 20 + (i * progressPerFile);
        updateProgress(fileStartProgress);

        console.log(`Converting video file: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversionType', conversionType);

        console.log(`Calling edge function convert-video for ${file.name}`);

        const { data, error } = await supabase.functions.invoke('convert-video', {
          body: formData,
        });

        if (error) {
          console.error(`Error processing ${file.name}:`, error);
          throw new Error(error.message || `Erro ao processar ${file.name}`);
        }

        updateProgress(fileStartProgress + (progressPerFile * 0.7));

        // Create file from response with correct MIME types
        let mimeType: string;
        let extension: string;
        let newFileName: string;
        
        if (conversionType === 'video-mp3') {
          mimeType = 'audio/mpeg';
          extension = 'mp3';
          const originalName = file.name.split('.')[0];
          newFileName = `${originalName}.${extension}`;
        } else if (conversionType === 'compress-video') {
          mimeType = file.type;
          extension = file.name.split('.').pop() || 'mp4';
          const originalName = file.name.split('.')[0];
          newFileName = `${originalName}_compressed.${extension}`;
        } else {
          mimeType = file.type;
          extension = file.name.split('.').pop() || 'file';
          const originalName = file.name.split('.')[0];
          newFileName = `${originalName}.${extension}`;
        }

        const blob = new Blob([data], { type: mimeType });
        
        if (blob.size === 0) {
          throw new Error(`Arquivo convertido está vazio: ${file.name}`);
        }
        
        const convertedFile = new File([blob], newFileName, { type: mimeType });
        convertedFiles.push({ file: convertedFile, originalName: file.name });
        
        console.log(`File processed successfully: ${newFileName}, MIME type: ${mimeType}, size: ${convertedFile.size}`);
        
        updateProgress(fileStartProgress + progressPerFile);
      }

      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertVideoFiles, isConverting };
};
