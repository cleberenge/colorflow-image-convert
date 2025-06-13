import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';
import { splitPdf } from '@/utils/pdfSplitter';
import { mergePdfs } from '@/utils/pdfMerger';
import { usePdfcpuConverter } from './usePdfcpuConverter';

export const useClientSideConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const { compressPdfWithPdfcpu } = usePdfcpuConverter();

  const convertClientSide = async (
    files: File[], 
    conversionType: string,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];

    try {
      console.log(`[ClientSideConverter] Iniciando conversão: ${conversionType}, arquivos: ${files.length}`);
      
      updateProgress(1);
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(3);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(5);
      
      if (conversionType === 'merge-pdf') {
        console.log('[ClientSideConverter] Mesclando PDFs no client-side');
        updateProgress(8);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(12);
        
        const results = await mergePdfs(files);
        convertedFiles.push(...results);
        
        updateProgress(90);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('[ClientSideConverter] Mesclagem de PDFs concluída com sucesso');
      } else if (conversionType === 'reduce-pdf') {
        console.log('[ClientSideConverter] Iniciando compressão de PDF usando PDFCPU');
        updateProgress(7);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(10);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 75 / files.length);
          
          console.log(`[ClientSideConverter] Comprimindo arquivo ${i + 1}/${files.length}: ${file.name}`);
          console.log(`[ClientSideConverter] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          
          updateProgress(Math.min(baseProgress + 2, 85));
          await new Promise(resolve => setTimeout(resolve, 200));
          
          try {
            const results = await compressPdfWithPdfcpu(file, (fileProgress) => {
              const totalProgress = baseProgress + ((fileProgress / 100) * (75 / files.length));
              updateProgress(Math.min(Math.max(totalProgress, baseProgress + 2), 85));
            });
            
            console.log(`[ClientSideConverter] Arquivo comprimido com sucesso:`, results);
            convertedFiles.push(...results);
            
            const finalProgress = baseProgress + (75 / files.length);
            updateProgress(Math.min(finalProgress, 85));
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            console.error(`[ClientSideConverter] Erro ao comprimir ${file.name}:`, error);
            throw new Error(`Erro na compressão de ${file.name}: ${error.message}`);
          }
        }
        
        console.log(`[ClientSideConverter] Compressão finalizada. Total de arquivos convertidos: ${convertedFiles.length}`);
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
      
      console.log(`[ClientSideConverter] Conversão finalizada com SUCESSO! Arquivos convertidos: ${convertedFiles.length}`);
      console.log('[ClientSideConverter] Detalhes dos arquivos convertidos:', convertedFiles.map(cf => ({
        name: cf.file.name,
        size: `${(cf.file.size / 1024 / 1024).toFixed(2)} MB`,
        type: cf.file.type
      })));
      
      return convertedFiles;
    } catch (error) {
      console.error('[ClientSideConverter] ERRO na conversão:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};
