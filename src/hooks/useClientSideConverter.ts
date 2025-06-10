
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
      // Progresso inicial mais suave
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(10);
      
      if (conversionType === 'merge-pdf') {
        console.log('Mesclando PDFs no client-side');
        updateProgress(15);
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(25);
        
        const results = await mergePdfs(files);
        convertedFiles.push(...results);
        
        updateProgress(85);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('Mesclagem de PDFs concluída com sucesso');
      } else if (conversionType === 'reduce-pdf') {
        console.log('Comprimindo PDF no client-side');
        updateProgress(15);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 20 + (i * 60 / files.length);
          const progressPerFile = 60 / files.length;
          
          updateProgress(baseProgress);
          await new Promise(resolve => setTimeout(resolve, 300));
          
          try {
            console.log(`Comprimindo ${file.name}`);
            
            const results = await compressPdfClientSide(file, (fileProgress) => {
              // Garantir que o progresso está entre 0-100 e calcular corretamente
              const normalizedFileProgress = Math.min(Math.max(fileProgress, 0), 100);
              const totalProgress = baseProgress + (normalizedFileProgress * progressPerFile / 100);
              const finalProgress = Math.min(Math.max(totalProgress, 0), 95);
              updateProgress(finalProgress);
            });
            
            convertedFiles.push(...results);
            updateProgress(baseProgress + progressPerFile);
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log(`${file.name} comprimido com sucesso`);
          } catch (error) {
            console.error(`Erro ao comprimir ${file.name}:`, error);
            throw error;
          }
        }
      } else {
        // Processar outros tipos de conversão com progresso melhorado
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileStartProgress = 15 + (i * 65 / files.length);
          updateProgress(fileStartProgress);
          await new Promise(resolve => setTimeout(resolve, 200));

          try {
            let results: ConvertedFile[];

            // Progresso durante o processamento
            updateProgress(fileStartProgress + 5);
            await new Promise(resolve => setTimeout(resolve, 300));

            if (conversionType === 'png-jpg') {
              console.log(`Converting ${file.name} to JPG on client-side`);
              updateProgress(fileStartProgress + 15);
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertPngToJpg(file, 0.9);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'jpg-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side`);
              updateProgress(fileStartProgress + 15);
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertJpgToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'word-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
              updateProgress(fileStartProgress + 15);
              await new Promise(resolve => setTimeout(resolve, 500));
              const convertedFile = await convertWordToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'split-pdf') {
              console.log(`Splitting ${file.name} on client-side`);
              updateProgress(fileStartProgress + 15);
              await new Promise(resolve => setTimeout(resolve, 600));
              results = await splitPdf(file, { mode: 'single' });
            } else {
              throw new Error(`Unsupported client-side conversion: ${conversionType}`);
            }

            convertedFiles.push(...results);
            updateProgress(fileStartProgress + (65 / files.length));
            await new Promise(resolve => setTimeout(resolve, 150));
            
            console.log(`Successfully processed ${file.name}`);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }
        }
      }
      
      // Progresso final mais suave
      updateProgress(85);
      await new Promise(resolve => setTimeout(resolve, 300));
      updateProgress(92);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(97);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(100);
      
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};

// Função para comprimir PDF no client-side - CORRIGIDA
const compressPdfClientSide = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ConvertedFile[]> => {
  const { PDFDocument } = await import('pdf-lib');
  
  onProgress(5);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log(`Iniciando compressão de ${file.name}, tamanho original: ${file.size} bytes`);
    
    const arrayBuffer = await file.arrayBuffer();
    onProgress(15);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    onProgress(30);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log(`PDF carregado, ${pdfDoc.getPageCount()} páginas`);
    
    // Estratégia de compressão mais eficaz
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: false, // Desabilitar para reduzir tamanho
      addDefaultPage: false,
      objectsPerTick: 10, // Reduzir para processar mais eficientemente
      updateFieldAppearances: false,
      subset: true, // Importante: criar subset das fontes
    });
    
    onProgress(80);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar se houve redução significativa
    const originalSize = file.size;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
    
    console.log(`Compressão concluída:`);
    console.log(`- Tamanho original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Tamanho comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Redução: ${compressionRatio.toFixed(2)}%`);
    
    // Se não houve redução significativa, tentar estratégia alternativa
    let finalBytes = compressedPdfBytes;
    if (compressionRatio < 5) {
      console.log('Aplicando compressão alternativa...');
      
      // Estratégia alternativa: recomprimir com configurações mais agressivas
      const altDoc = await PDFDocument.load(compressedPdfBytes);
      finalBytes = await altDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 5,
        updateFieldAppearances: false,
      });
      
      const altSize = finalBytes.length;
      const altRatio = ((originalSize - altSize) / originalSize) * 100;
      console.log(`- Compressão alternativa: ${(altSize / 1024 / 1024).toFixed(2)} MB (${altRatio.toFixed(2)}% redução)`);
    }
    
    onProgress(95);
    await new Promise(resolve => setTimeout(resolve, 200));
    
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
