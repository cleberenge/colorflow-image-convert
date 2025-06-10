
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';
import { validateVideoFile } from '@/utils/fileValidation';
import { useFFmpegConverter } from '@/hooks/useFFmpegConverter';

export const useVideoConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const { convertVideoToMp3, compressVideo, isConverting: isFFmpegConverting } = useFFmpegConverter();

  const convertVideoFiles = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    
    try {
      for (const file of files) {
        validateVideoFile(file, conversionType);
      }

      updateProgress(5);

      if (conversionType === 'video-mp3') {
        console.log('Iniciando conversão de vídeo para MP3 usando FFmpeg.wasm...');
        return await convertVideoToMp3(files, updateProgress);
      } else if (conversionType === 'compress-video') {
        console.log('Iniciando compressão de vídeo usando FFmpeg.wasm...');
        return await compressVideo(files, updateProgress);
      } else {
        throw new Error(`Tipo de conversão não suportado: ${conversionType}`);
      }
    } finally {
      setIsConverting(false);
    }
  };

  return { 
    convertVideoFiles, 
    isConverting: isConverting || isFFmpegConverting 
  };
};
