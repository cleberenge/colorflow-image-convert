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
        console.log('Comprimindo PDF usando servidor com Ghostscript');
        updateProgress(10);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 15 + (i * 70 / files.length);
          
          updateProgress(Math.min(baseProgress, 90));
          await new Promise(resolve => setTimeout(resolve, 300));
          
          try {
            console.log(`Comprimindo ${file.name} usando servidor`);
            
            const results = await compressPdfWithServer(file, (fileProgress) => {
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

// Função para comprimir PDF usando servidor com Ghostscript
const compressPdfWithServer = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ConvertedFile[]> => {
  
  onProgress(10);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log(`Iniciando compressão de ${file.name}, tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversionType', 'reduce-pdf');
    
    onProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Enviando arquivo para compressão no servidor...');
    
    const response = await fetch('/api/convert-pdf', {
      method: 'POST',
      body: formData,
    });
    
    onProgress(70);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do servidor:', errorText);
      throw new Error(`Erro na compressão: ${response.status} - ${errorText}`);
    }
    
    // Verificar se a resposta é realmente um PDF
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error('Resposta do servidor não é um PDF válido');
    }
    
    const compressedBlob = await response.blob();
    const finalSize = compressedBlob.size;
    
    if (finalSize === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    onProgress(90);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const compressionRatio = ((file.size - finalSize) / file.size) * 100;
    
    console.log(`Compressão concluída:`);
    console.log(`- Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Tamanho comprimido: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Redução: ${compressionRatio.toFixed(2)}%`);
    
    const originalName = file.name.split('.')[0];
    const compressedFileName = `${originalName}_compressed.pdf`;
    
    const compressedFile = new File([compressedBlob], compressedFileName, {
      type: 'application/pdf',
    });
    
    onProgress(100);
    
    return [{ file: compressedFile, originalName: file.name }];
    
  } catch (error) {
    console.error('Erro na compressão no servidor:', error);
    throw new Error(`Falha ao comprimir ${file.name}: ${error.message}`);
  }
};
