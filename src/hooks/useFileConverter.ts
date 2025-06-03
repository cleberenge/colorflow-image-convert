
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const convertFiles = async (files: File[], conversionType: string) => {
    setIsConverting(true);
    setProgress(0);

    try {
      const convertedFiles: { file: File; originalName: string }[] = [];

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Determine which edge function to use
      let functionName: string;
      if (conversionType.includes('video') || conversionType === 'compress-video') {
        functionName = 'convert-video';
      } else if (conversionType.includes('pdf') || conversionType.includes('jpg-pdf')) {
        functionName = 'convert-pdf';
      } else if (conversionType.includes('png') || conversionType.includes('jpg')) {
        functionName = 'convert-image';
      } else {
        throw new Error(`Unsupported conversion type: ${conversionType}`);
      }

      console.log(`Using edge function: ${functionName} for conversion type: ${conversionType}`);

      if (conversionType === 'merge-pdf' && files.length > 1) {
        // Special handling for PDF merge
        const formData = new FormData();
        formData.append('conversionType', conversionType);
        files.forEach((file, index) => {
          formData.append('files', file);
        });

        const { data, error } = await supabase.functions.invoke(functionName, {
          body: formData,
        });

        if (error) throw error;

        // Convert response to file
        const blob = new Blob([data], { type: 'application/pdf' });
        const mergedFile = new File([blob], 'merged.pdf', { type: 'application/pdf' });
        convertedFiles.push({ file: mergedFile, originalName: 'merged_files' });

      } else {
        // Process each file individually
        for (const file of files) {
          console.log(`Converting file: ${file.name}`);
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('conversionType', conversionType);

          const { data, error } = await supabase.functions.invoke(functionName, {
            body: formData,
          });

          if (error) {
            console.error(`Error converting ${file.name}:`, error);
            throw error;
          }

          // Create file from response
          let mimeType: string;
          let extension: string;
          
          if (conversionType === 'png-jpg') {
            mimeType = 'image/jpeg';
            extension = 'jpg';
          } else if (conversionType === 'jpg-pdf') {
            mimeType = 'application/pdf';
            extension = 'pdf';
          } else if (conversionType === 'video-mp3') {
            mimeType = 'audio/mpeg';
            extension = 'mp3';
          } else if (conversionType === 'compress-video') {
            mimeType = file.type;
            extension = file.name.split('.').pop() || 'mp4';
          } else if (conversionType === 'reduce-pdf') {
            mimeType = 'application/pdf';
            extension = 'pdf';
          } else {
            mimeType = file.type;
            extension = file.name.split('.').pop() || 'file';
          }

          const blob = new Blob([data], { type: mimeType });
          const originalName = file.name.split('.')[0];
          let newFileName: string;
          
          if (conversionType === 'reduce-pdf') {
            newFileName = `${originalName}_compressed.${extension}`;
          } else if (conversionType === 'compress-video') {
            newFileName = `${originalName}_compressed.${extension}`;
          } else {
            newFileName = `${originalName}.${extension}`;
          }
          
          const convertedFile = new File([blob], newFileName, { type: mimeType });
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          console.log(`File converted successfully: ${newFileName}`);
        }
      }

      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: "Conversão concluída!",
        description: `${files.length} arquivo(s) convertido(s) com sucesso.`,
      });

      return convertedFiles;

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao processar os arquivos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return {
    convertFiles,
    isConverting,
    progress,
  };
};
