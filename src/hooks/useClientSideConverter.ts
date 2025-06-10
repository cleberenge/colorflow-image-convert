
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';

export const useClientSideConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertClientSide = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];

    try {
      updateProgress(20);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 20 + (i * 60 / files.length);
        updateProgress(fileStartProgress);

        try {
          let convertedFile: File;

          if (conversionType === 'png-jpg') {
            console.log(`Converting ${file.name} to JPG on client-side`);
            convertedFile = await convertPngToJpg(file, 0.9);
          } else if (conversionType === 'jpg-pdf') {
            console.log(`Converting ${file.name} to PDF on client-side`);
            convertedFile = await convertJpgToPdf(file);
          } else if (conversionType === 'word-pdf') {
            console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
            convertedFile = await convertWordToPdf(file);
          } else {
            throw new Error(`Unsupported client-side conversion: ${conversionType}`);
          }

          convertedFiles.push({ file: convertedFile, originalName: file.name });
          updateProgress(fileStartProgress + (60 / files.length));
          
          console.log(`Successfully converted ${file.name} to ${convertedFile.name}`);
        } catch (error) {
          console.error(`Error converting ${file.name}:`, error);
          throw error;
        }
      }
      
      updateProgress(90);
      setTimeout(() => updateProgress(100), 200);
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};
