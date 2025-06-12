import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';
import { splitPdf } from '@/utils/pdfSplitter';
import { mergePdfs } from '@/utils/pdfMerger';
import { useILoveApiConverter } from './useILoveApiConverter';

export const useClientSideConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const { compressPdfWithILoveApi } = useILoveApiConverter();

  const convertClientSide = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];

    try {
      updateProgress(1);
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(3);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(5);
      
      if (conversionType === 'merge-pdf') {
        console.log('Mesclando PDFs no client-side');
        updateProgress(8);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(12);
        
        const results = await mergePdfs(files);
        convertedFiles.push(...results);
        
        updateProgress(90);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('Mesclagem de PDFs concluída com sucesso');
      } else if (conversionType === 'reduce-pdf') {
        console.log('Iniciando compressão de PDF usando ILoveAPI');
        updateProgress(7);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(10);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 75 / files.length);
          
          updateProgress(Math.min(baseProgress + 2, 85));
          await new Promise(resolve => setTimeout(resolve, 200));
          
          try {
            console.log(`Comprimindo ${file.name} usando ILoveAPI`);
            
            const results = await compressPdfWithILoveApi(file, (fileProgress) => {
              const totalProgress = baseProgress + ((fileProgress / 100) * (75 / files.length));
              updateProgress(Math.min(Math.max(totalProgress, baseProgress + 2), 85));
            });
            
            convertedFiles.push(...results);
            
            const finalProgress = baseProgress + (75 / files.length);
            updateProgress(Math.min(finalProgress, 85));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log(`${file.name} comprimido com sucesso`);
          } catch (error) {
            console.error(`Erro ao comprimir ${file.name}:`, error);
            throw error;
          }
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 8 + (i * 77 / files.length);
          updateProgress(Math.min(baseProgress + 1, 85));
          await new Promise(resolve => setTimeout(resolve, 200));

          try {
            let results: ConvertedFile[];

            updateProgress(Math.min(baseProgress + 3, 85));
            await new Promise(resolve => setTimeout(resolve, 150));
            updateProgress(Math.min(baseProgress + 6, 85));
            await new Promise(resolve => setTimeout(resolve, 200));

            if (conversionType === 'png-jpg') {
              console.log(`Converting ${file.name} to JPG on client-side`);
              updateProgress(Math.min(baseProgress + 10, 85));
              await new Promise(resolve => setTimeout(resolve, 300));
              const convertedFile = await convertPngToJpg(file, 0.9);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'jpg-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side`);
              updateProgress(Math.min(baseProgress + 10, 85));
              await new Promise(resolve => setTimeout(resolve, 300));
              const convertedFile = await convertJpgToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'word-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
              updateProgress(Math.min(baseProgress + 10, 85));
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertWordToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'split-pdf') {
              console.log(`Splitting ${file.name} on client-side`);
              updateProgress(Math.min(baseProgress + 10, 85));
              await new Promise(resolve => setTimeout(resolve, 500));
              results = await splitPdf(file, { mode: 'single' });
            } else {
              throw new Error(`Unsupported client-side conversion: ${conversionType}`);
            }

            convertedFiles.push(...results);
            updateProgress(Math.min(baseProgress + (77 / files.length), 85));
            await new Promise(resolve => setTimeout(resolve, 150));
            
            console.log(`Successfully processed ${file.name}`);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }
        }
      }
      
      updateProgress(87);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(90);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(93);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(96);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(98);
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(100);
      
      console.log('Conversão finalizada, arquivos convertidos:', convertedFiles.length);
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};
