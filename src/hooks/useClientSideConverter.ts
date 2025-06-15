
import { useState } from 'react';
import { ConvertedFile, ConversionType } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { splitPdf } from '@/utils/pdfSplitter';
import { mergePdfs } from '@/utils/pdfMerger';
import { compressPdfClientSide } from '@/utils/pdfCompressor';

export const useClientSideConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertClientSide = async (
    files: File[],
    conversionType: ConversionType,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];

    try {
      updateProgress(5);

      if (conversionType === 'reduce-pdf') {
        // Para redução de PDF, processar um arquivo por vez
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`[ClientSideConverter] Comprimindo PDF ${i + 1}/${files.length}: ${file.name}`);
          
          // Callback de progresso específico para este arquivo
          const fileProgressCallback = (progress: number) => {
            // Distribuir o progresso entre os arquivos
            const baseProgress = 5 + (i * 85 / files.length);
            const fileProgress = (progress / 100) * (85 / files.length);
            updateProgress(Math.min(baseProgress + fileProgress, 95));
          };
          
          const compressedFile = await compressPdfClientSide(file, {}, fileProgressCallback);
          // Correctly create ConvertedFile object
          convertedFiles.push({ 
            file: compressedFile, 
            originalName: file.name 
          });
        }
      } else if (conversionType === 'png-jpg') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const jpgFile = await convertPngToJpg(file);
          convertedFiles.push({ file: jpgFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'jpg-pdf') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const pdfFile = await convertJpgToPdf(file);
          convertedFiles.push({ file: pdfFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'split-pdf') {
        const file = files[0];
        updateProgress(20);
        
        const splitFiles = await splitPdf(file);
        updateProgress(80);
        
        splitFiles.forEach((splitFile, index) => {
          convertedFiles.push({ file: splitFile, originalName: `${file.name}-page-${index + 1}` });
        });
      } else if (conversionType === 'merge-pdf') {
        updateProgress(20);
        const mergedFile = await mergePdfs(files);
        updateProgress(80);
        
        convertedFiles.push({ file: mergedFile, originalName: 'merged.pdf' });
      }

      updateProgress(100);
      return convertedFiles;

    } catch (error) {
      console.error('[ClientSideConverter] Erro na conversão:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};
