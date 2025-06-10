
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
      // Progresso inicial suave
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(5);
      
      if (conversionType === 'merge-pdf') {
        console.log('Mesclando PDFs no client-side');
        updateProgress(10);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(20);
        
        const results = await mergePdfs(files);
        convertedFiles.push(...results);
        
        updateProgress(90);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('Mesclagem de PDFs concluída com sucesso');
      } else if (conversionType === 'reduce-pdf') {
        console.log('Comprimindo PDF no client-side');
        updateProgress(10);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 15 + (i * 70 / files.length);
          
          updateProgress(Math.min(baseProgress, 90));
          await new Promise(resolve => setTimeout(resolve, 300));
          
          try {
            console.log(`Comprimindo ${file.name}`);
            
            const results = await compressPdfClientSide(file, (fileProgress) => {
              const totalProgress = baseProgress + (fileProgress * 70 / files.length / 100);
              updateProgress(Math.min(Math.max(totalProgress, 0), 90));
            });
            
            convertedFiles.push(...results);
            updateProgress(Math.min(baseProgress + (70 / files.length), 90));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log(`${file.name} comprimido com sucesso`);
          } catch (error) {
            console.error(`Erro ao comprimir ${file.name}:`, error);
            throw error;
          }
        }
      } else {
        // Processar outros tipos de conversão com progresso otimizado
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 75 / files.length);
          updateProgress(Math.min(baseProgress, 90));
          await new Promise(resolve => setTimeout(resolve, 200));

          try {
            let results: ConvertedFile[];

            // Progresso durante o processamento
            updateProgress(Math.min(baseProgress + 5, 90));
            await new Promise(resolve => setTimeout(resolve, 300));

            if (conversionType === 'png-jpg') {
              console.log(`Converting ${file.name} to JPG on client-side`);
              updateProgress(Math.min(baseProgress + 15, 90));
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertPngToJpg(file, 0.9);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'jpg-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side`);
              updateProgress(Math.min(baseProgress + 15, 90));
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertJpgToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'word-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
              updateProgress(Math.min(baseProgress + 15, 90));
              await new Promise(resolve => setTimeout(resolve, 500));
              const convertedFile = await convertWordToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'split-pdf') {
              console.log(`Splitting ${file.name} on client-side`);
              updateProgress(Math.min(baseProgress + 15, 90));
              await new Promise(resolve => setTimeout(resolve, 600));
              results = await splitPdf(file, { mode: 'single' });
            } else {
              throw new Error(`Unsupported client-side conversion: ${conversionType}`);
            }

            convertedFiles.push(...results);
            updateProgress(Math.min(baseProgress + (75 / files.length), 90));
            await new Promise(resolve => setTimeout(resolve, 150));
            
            console.log(`Successfully processed ${file.name}`);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }
        }
      }
      
      // Progresso final suave
      updateProgress(92);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(96);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(100);
      
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};

// Função para comprimir PDF no client-side - MELHORADA
const compressPdfClientSide = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ConvertedFile[]> => {
  const { PDFDocument } = await import('pdf-lib');
  
  onProgress(10);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log(`Iniciando compressão de ${file.name}, tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const arrayBuffer = await file.arrayBuffer();
    onProgress(20);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    onProgress(40);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log(`PDF carregado, ${pdfDoc.getPageCount()} páginas`);
    
    // Estratégia 1: Salvar com configurações básicas de compressão
    console.log('Aplicando compressão básica...');
    const basicCompressed = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });
    
    onProgress(60);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let finalBytes = basicCompressed;
    let finalSize = basicCompressed.length;
    
    // Estratégia 2: Se não houve redução significativa, tentar recompressão
    if (finalSize >= file.size * 0.85) {
      console.log('Aplicando compressão mais agressiva...');
      
      try {
        // Recriar PDF com páginas otimizadas
        const optimizedPdf = await PDFDocument.create();
        const pageCount = pdfDoc.getPageCount();
        
        // Limitar a 100 páginas para evitar problemas de memória
        const pagesToProcess = Math.min(pageCount, 100);
        const copiedPages = await optimizedPdf.copyPages(pdfDoc, Array.from({ length: pagesToProcess }, (_, i) => i));
        
        copiedPages.forEach((page) => {
          optimizedPdf.addPage(page);
        });
        
        onProgress(80);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const recompressedBytes = await optimizedPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
        });
        
        // Usar o melhor resultado
        if (recompressedBytes.length < finalSize) {
          finalBytes = recompressedBytes;
          finalSize = recompressedBytes.length;
          console.log('Compressão agressiva foi mais eficaz');
        }
        
      } catch (recompressError) {
        console.log('Compressão agressiva falhou, usando resultado básico:', recompressError);
      }
    }
    
    onProgress(95);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const compressionRatio = ((file.size - finalSize) / file.size) * 100;
    
    console.log(`Compressão concluída:`);
    console.log(`- Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Tamanho comprimido: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Redução: ${compressionRatio.toFixed(2)}%`);
    
    const originalName = file.name.split('.')[0];
    const compressedFileName = `${originalName}_compressed.pdf`;
    
    const compressedFile = new File([finalBytes], compressedFileName, {
      type: 'application/pdf',
    });
    
    onProgress(100);
    
    return [{ file: compressedFile, originalName: file.name }];
    
  } catch (error) {
    console.error('Erro na compressão client-side:', error);
    throw new Error(`Falha ao comprimir ${file.name}: ${error.message}`);
  }
};
