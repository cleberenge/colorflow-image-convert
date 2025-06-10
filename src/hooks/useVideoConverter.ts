
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

        // Para conversão de vídeo, mostrar mensagem explicativa
        if (conversionType === 'video-mp3') {
          throw new Error(
            'Conversão de vídeo para MP3 não está disponível no momento devido às limitações do Supabase Edge Runtime. ' +
            'Recomendações: ' +
            '1. Use VLC Media Player (gratuito) para converter localmente ' +
            '2. Use sites como CloudConvert.com ou Online-Convert.com ' +
            '3. Use apps móveis como "Video to MP3 Converter" ' +
            'Desculpe pelo inconveniente!'
          );
        }

        if (conversionType === 'compress-video') {
          throw new Error(
            'Compressão de vídeo não está disponível no momento devido às limitações do Supabase Edge Runtime. ' +
            'Recomendações: ' +
            '1. Use HandBrake (gratuito) para compressão local ' +
            '2. Use sites como TinyWow.com ou Clideo.com ' +
            '3. Use apps móveis como "Video Compressor" ' +
            'Desculpe pelo inconveniente!'
          );
        }

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
