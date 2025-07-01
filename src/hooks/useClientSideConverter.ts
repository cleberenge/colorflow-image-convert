import { useState } from 'react';
import { ConvertedFile, ConversionType } from '@/types/fileConverter';
import { convertPngToJpg } from '@/utils/imageConverter';
import { convertJpgToPdf } from '@/utils/pdfConverter';
import { splitPdf } from '@/utils/pdfSplitter';
import { mergePdfs } from '@/utils/pdfMerger';
import { compressPdfClientSide } from '@/utils/pdfCompressor';
import { convertSvgToPng, convertSvgToJpg, convertJpgToWebp } from '@/utils/advancedImageConverter';
import { convertHtmlToPdf, convertCsvToJson, convertCsvToExcel } from '@/utils/documentConverter';
import { compressJpg, compressPng } from '@/utils/imageCompressor';

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
      } else if (conversionType === 'reduce-jpg') {
        // Compressão de arquivos JPG
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          console.log(`[ClientSideConverter] Comprimindo JPG ${i + 1}/${files.length}: ${file.name}`);
          const compressedFile = await compressJpg(file, 0.7);
          convertedFiles.push({ file: compressedFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'reduce-png') {
        // Compressão de arquivos PNG
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          console.log(`[ClientSideConverter] Comprimindo PNG ${i + 1}/${files.length}: ${file.name}`);
          const compressedFile = await compressPng(file, 0.7);
          convertedFiles.push({ file: compressedFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
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
      } else if (conversionType === 'svg-png') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const pngFile = await convertSvgToPng(file);
          convertedFiles.push({ file: pngFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'svg-jpg') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const jpgFile = await convertSvgToJpg(file);
          convertedFiles.push({ file: jpgFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'jpg-webp') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const webpFile = await convertJpgToWebp(file);
          convertedFiles.push({ file: webpFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'html-pdf') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const pdfFile = await convertHtmlToPdf(file);
          convertedFiles.push({ file: pdfFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'csv-json') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const jsonFile = await convertCsvToJson(file);
          convertedFiles.push({ file: jsonFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'csv-excel') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 70 / files.length);
          updateProgress(baseProgress);
          
          const excelFile = await convertCsvToExcel(file);
          convertedFiles.push({ file: excelFile, originalName: file.name });
          
          updateProgress(baseProgress + (70 / files.length));
        }
      } else if (conversionType === 'split-pdf') {
        const file = files[0];
        updateProgress(20);
        
        const splitFiles = await splitPdf(file);
        updateProgress(80);
        
        splitFiles.forEach((splitFile: ConvertedFile) => {
          convertedFiles.push(splitFile);
        });
      } else if (conversionType === 'merge-pdf') {
        updateProgress(20);
        
        const mergeResult = await mergePdfs(files);
        updateProgress(80);
        
        mergeResult.forEach((mergedFile: ConvertedFile) => {
          convertedFiles.push(mergedFile);
        });
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
