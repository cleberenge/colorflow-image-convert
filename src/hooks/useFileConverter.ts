import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';

export const useFileConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const convertFiles = async (files: File[], conversionType: string) => {
    setIsConverting(true);
    setProgress(0);

    try {
      const convertedFiles: { file: File; originalName: string }[] = [];
      let currentProgress = 0;

      // Função para atualizar progresso de forma sempre crescente
      const updateProgress = (newProgress: number) => {
        if (newProgress > currentProgress) {
          currentProgress = newProgress;
          setProgress(currentProgress);
        }
      };

      // Progresso inicial (0-10%)
      updateProgress(10);

      // Handle PNG to JPG conversion client-side
      if (conversionType === 'png-jpg') {
        updateProgress(20);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Converting ${file.name} to JPG on client-side`);
          
          const fileStartProgress = 20 + (i * 60 / files.length);
          updateProgress(fileStartProgress);

          try {
            const jpgFile = await convertPngToJpg(file, 0.9);
            convertedFiles.push({ file: jpgFile, originalName: file.name });
            updateProgress(fileStartProgress + (60 / files.length));
            
            console.log(`Successfully converted ${file.name} to ${jpgFile.name}`);
          } catch (error) {
            console.error(`Error converting ${file.name}:`, error);
            throw error;
          }
        }
        
        updateProgress(90);
        setTimeout(() => updateProgress(100), 200);
        return convertedFiles;
      }

      // Handle JPG to PDF conversion client-side
      if (conversionType === 'jpg-pdf') {
        updateProgress(20);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Converting ${file.name} to PDF on client-side`);
          
          const fileStartProgress = 20 + (i * 60 / files.length);
          updateProgress(fileStartProgress);

          try {
            const pdfFile = await convertJpgToPdf(file);
            convertedFiles.push({ file: pdfFile, originalName: file.name });
            updateProgress(fileStartProgress + (60 / files.length));
            
            console.log(`Successfully converted ${file.name} to ${pdfFile.name}`);
          } catch (error) {
            console.error(`Error converting ${file.name}:`, error);
            throw error;
          }
        }
        
        updateProgress(90);
        setTimeout(() => updateProgress(100), 200);
        return convertedFiles;
      }

      // Handle Word to PDF conversion client-side
      if (conversionType === 'word-pdf') {
        updateProgress(20);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
          
          const fileStartProgress = 20 + (i * 60 / files.length);
          updateProgress(fileStartProgress);

          try {
            const pdfFile = await convertWordToPdf(file);
            convertedFiles.push({ file: pdfFile, originalName: file.name });
            updateProgress(fileStartProgress + (60 / files.length));
            
            console.log(`Successfully converted ${file.name} to ${pdfFile.name}`);
          } catch (error) {
            console.error(`Error converting ${file.name}:`, error);
            throw error;
          }
        }
        
        updateProgress(90);
        setTimeout(() => updateProgress(100), 200);
        return convertedFiles;
      }

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

      // Progresso de preparação (10-20%)
      updateProgress(20);

      if (conversionType === 'merge-pdf' && files.length > 1) {
        // Special handling for PDF merge
        const formData = new FormData();
        formData.append('conversionType', conversionType);
        files.forEach((file, index) => {
          formData.append('files', file);
        });

        // Progresso de processamento (20-80%)
        updateProgress(50);

        const { data, error } = await supabase.functions.invoke(functionName, {
          body: formData,
        });

        if (error) throw error;

        updateProgress(80);

        // Convert response to file
        const blob = new Blob([data], { type: 'application/pdf' });
        const mergedFile = new File([blob], 'merged.pdf', { type: 'application/pdf' });
        convertedFiles.push({ file: mergedFile, originalName: 'merged_files' });

      } else {
        // Process each file individually
        const progressPerFile = 60 / files.length; // 60% do progresso total dividido pelos arquivos
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Processing file: ${file.name}`);
          
          // Validar tipo de arquivo para video-mp3
          if (conversionType === 'video-mp3') {
            const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
            if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i)) {
              throw new Error(`Formato de vídeo não suportado: ${file.name}. Use MP4, AVI, MOV, WMV, FLV, WebM ou MKV.`);
            }
          }
          
          // Progresso por arquivo (20% + progresso do arquivo atual)
          const fileStartProgress = 20 + (i * progressPerFile);
          updateProgress(fileStartProgress);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('conversionType', conversionType);

          const { data, error } = await supabase.functions.invoke(functionName, {
            body: formData,
          });

          if (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }

          // Progresso intermediário do arquivo
          updateProgress(fileStartProgress + (progressPerFile * 0.7));

          // Create file from response with correct MIME types
          let mimeType: string;
          let extension: string;
          let newFileName: string;
          
          if (conversionType === 'jpg-pdf') {
            mimeType = 'application/pdf';
            extension = 'pdf';
            const originalName = file.name.split('.')[0];
            newFileName = `${originalName}.${extension}`;
          } else if (conversionType === 'video-mp3') {
            mimeType = 'audio/mpeg';
            extension = 'mp3';
            const originalName = file.name.split('.')[0];
            newFileName = `${originalName}.${extension}`;
          } else if (conversionType === 'compress-video') {
            mimeType = file.type;
            extension = file.name.split('.').pop() || 'mp4';
            const originalName = file.name.split('.')[0];
            newFileName = `${originalName}_compressed.${extension}`;
          } else if (conversionType === 'reduce-pdf') {
            mimeType = 'application/pdf';
            extension = 'pdf';
            const originalName = file.name.split('.')[0];
            newFileName = `${originalName}_compressed.${extension}`;
          } else {
            mimeType = file.type;
            extension = file.name.split('.').pop() || 'file';
            const originalName = file.name.split('.')[0];
            newFileName = `${originalName}.${extension}`;
          }

          // Ensure data is treated as binary
          const blob = new Blob([data], { type: mimeType });
          const convertedFile = new File([blob], newFileName, { type: mimeType });
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          console.log(`File processed successfully: ${newFileName}, MIME type: ${mimeType}`);
          
          // Finalizar progresso do arquivo
          updateProgress(fileStartProgress + progressPerFile);
        }
      }

      // Progresso final (80-100%)
      updateProgress(90);
      setTimeout(() => updateProgress(100), 200);

      return convertedFiles;

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os arquivos.",
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
