
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';
import { splitPdf } from '@/utils/pdfSplitter';
import { mergePdfs } from '@/utils/pdfMerger';

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
      
      if (conversionType === 'merge-pdf') {
        console.log('Mesclando PDFs no client-side');
        updateProgress(30);
        
        const results = await mergePdfs(files);
        convertedFiles.push(...results);
        
        updateProgress(80);
        console.log('Mesclagem de PDFs concluída com sucesso');
      } else {
        // Processar outros tipos de conversão
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileStartProgress = 20 + (i * 60 / files.length);
          updateProgress(fileStartProgress);

          try {
            let results: ConvertedFile[];

            if (conversionType === 'png-jpg') {
              console.log(`Converting ${file.name} to JPG on client-side`);
              const convertedFile = await convertPngToJpg(file, 0.9);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'jpg-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side`);
              const convertedFile = await convertJpgToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'word-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
              const convertedFile = await convertWordToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'split-pdf') {
              console.log(`Splitting ${file.name} on client-side`);
              results = await splitPdf(file, { mode: 'single' });
            } else {
              throw new Error(`Unsupported client-side conversion: ${conversionType}`);
            }

            convertedFiles.push(...results);
            updateProgress(fileStartProgress + (60 / files.length));
            
            console.log(`Successfully processed ${file.name}`);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }
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
