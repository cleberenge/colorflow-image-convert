
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ConvertedFile } from '@/types/fileConverter';

export const useServerSideConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertServerSide = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];

    try {
      // Determine which edge function to use
      let functionName: string;
      if (conversionType.includes('pdf') || conversionType.includes('jpg-pdf')) {
        functionName = 'convert-pdf';
      } else if (conversionType.includes('png') || conversionType.includes('jpg')) {
        functionName = 'convert-image';
      } else {
        throw new Error(`Unsupported conversion type: ${conversionType}`);
      }

      console.log(`Using edge function: ${functionName} for conversion type: ${conversionType}`);
      updateProgress(20);

      if (conversionType === 'merge-pdf' && files.length > 1) {
        // Special handling for PDF merge
        const formData = new FormData();
        formData.append('conversionType', conversionType);
        files.forEach((file) => {
          formData.append('files', file);
        });

        updateProgress(50);

        const { data, error } = await supabase.functions.invoke(functionName, {
          body: formData,
        });

        if (error) throw error;

        updateProgress(80);

        const blob = new Blob([data], { type: 'application/pdf' });
        const mergedFile = new File([blob], 'merged.pdf', { type: 'application/pdf' });
        convertedFiles.push({ file: mergedFile, originalName: 'merged_files' });

      } else {
        // Process each file individually
        const progressPerFile = 60 / files.length;
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Processing file: ${file.name}`);
          
          const fileStartProgress = 20 + (i * progressPerFile);
          updateProgress(fileStartProgress);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('conversionType', conversionType);

          console.log(`Calling edge function ${functionName} for ${file.name}`);

          const { data, error } = await supabase.functions.invoke(functionName, {
            body: formData,
          });

          if (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw new Error(error.message || `Erro ao processar ${file.name}`);
          }

          updateProgress(fileStartProgress + (progressPerFile * 0.7));

          // Create file from response
          let mimeType: string;
          let extension: string;
          let newFileName: string;
          
          if (conversionType === 'reduce-pdf') {
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

          const blob = new Blob([data], { type: mimeType });
          
          if (blob.size === 0) {
            throw new Error(`Arquivo convertido está vazio: ${file.name}`);
          }
          
          const convertedFile = new File([blob], newFileName, { type: mimeType });
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          console.log(`File processed successfully: ${newFileName}, MIME type: ${mimeType}, size: ${convertedFile.size}`);
          
          updateProgress(fileStartProgress + progressPerFile);
        }
      }

      updateProgress(90);
      setTimeout(() => updateProgress(100), 200);
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertServerSide, isConverting };
};
