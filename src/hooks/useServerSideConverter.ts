
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
      updateProgress(5);

      if (conversionType === 'merge-pdf' && files.length > 1) {
        // Special handling for PDF merge
        const formData = new FormData();
        formData.append('conversionType', conversionType);
        files.forEach((file) => {
          formData.append('files', file);
        });

        updateProgress(15);

        const { data, error } = await supabase.functions.invoke(functionName, {
          body: formData,
        });

        if (error) throw error;

        updateProgress(85);

        const blob = new Blob([data], { type: 'application/pdf' });
        const mergedFile = new File([blob], 'merged.pdf', { type: 'application/pdf' });
        convertedFiles.push({ file: mergedFile, originalName: 'merged_files' });
        
        updateProgress(100);

      } else {
        // Process each file individually with smooth progress tracking
        const totalFiles = files.length;
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Processing file ${i + 1}/${totalFiles}: ${file.name}`);
          
          // Calculate base progress for this file (10% to 90% range)
          const baseProgress = 10 + (i * 80 / totalFiles);
          const nextBaseProgress = 10 + ((i + 1) * 80 / totalFiles);
          
          // Incremental progress within file processing
          updateProgress(Math.round(baseProgress));
          
          // Simulate gradual progress during preparation
          await new Promise(resolve => setTimeout(resolve, 100));
          updateProgress(Math.round(baseProgress + (nextBaseProgress - baseProgress) * 0.1));
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('conversionType', conversionType);

          console.log(`Calling edge function ${functionName} for ${file.name}`);
          
          // Progress during API call preparation
          updateProgress(Math.round(baseProgress + (nextBaseProgress - baseProgress) * 0.2));
          await new Promise(resolve => setTimeout(resolve, 150));
          
          updateProgress(Math.round(baseProgress + (nextBaseProgress - baseProgress) * 0.4));

          const { data, error } = await supabase.functions.invoke(functionName, {
            body: formData,
          });

          if (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw new Error(error.message || `Erro ao processar ${file.name}`);
          }

          // Progress during response processing
          updateProgress(Math.round(baseProgress + (nextBaseProgress - baseProgress) * 0.7));
          await new Promise(resolve => setTimeout(resolve, 100));

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
          
          // Complete this file's progress
          updateProgress(Math.round(nextBaseProgress));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Final smooth progress to 100%
      const finalSteps = [92, 94, 96, 98, 100];
      for (const step of finalSteps) {
        updateProgress(step);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertServerSide, isConverting };
};
