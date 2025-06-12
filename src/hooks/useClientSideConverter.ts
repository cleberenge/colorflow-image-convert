
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
      // Progresso inicial mais gradual
      updateProgress(2);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(5);
      await new Promise(resolve => setTimeout(resolve, 200));
      
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
        console.log('Iniciando compressão de PDF usando servidor');
        updateProgress(8);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 10 + (i * 75 / files.length);
          
          updateProgress(Math.min(baseProgress, 85));
          await new Promise(resolve => setTimeout(resolve, 400));
          
          try {
            console.log(`Comprimindo ${file.name} usando servidor`);
            
            const results = await compressPdfWithServer(file, (fileProgress) => {
              const totalProgress = baseProgress + ((fileProgress / 100) * (75 / files.length));
              updateProgress(Math.min(Math.max(totalProgress, baseProgress), 85));
            });
            
            convertedFiles.push(...results);
            
            const finalProgress = baseProgress + (75 / files.length);
            updateProgress(Math.min(finalProgress, 85));
            await new Promise(resolve => setTimeout(resolve, 300));
            
            console.log(`${file.name} comprimido com sucesso`);
          } catch (error) {
            console.error(`Erro ao comprimir ${file.name}:`, error);
            throw error;
          }
        }
      } else {
        // Processar outros tipos de conversão com progresso mais suave
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const baseProgress = 8 + (i * 77 / files.length);
          updateProgress(Math.min(baseProgress, 85));
          await new Promise(resolve => setTimeout(resolve, 300));

          try {
            let results: ConvertedFile[];

            // Progresso durante o processamento mais gradual
            updateProgress(Math.min(baseProgress + 3, 85));
            await new Promise(resolve => setTimeout(resolve, 200));
            updateProgress(Math.min(baseProgress + 8, 85));
            await new Promise(resolve => setTimeout(resolve, 300));

            if (conversionType === 'png-jpg') {
              console.log(`Converting ${file.name} to JPG on client-side`);
              updateProgress(Math.min(baseProgress + 15, 85));
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertPngToJpg(file, 0.9);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'jpg-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side`);
              updateProgress(Math.min(baseProgress + 15, 85));
              await new Promise(resolve => setTimeout(resolve, 400));
              const convertedFile = await convertJpgToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'word-pdf') {
              console.log(`Converting ${file.name} to PDF on client-side using mammoth + jsPDF`);
              updateProgress(Math.min(baseProgress + 15, 85));
              await new Promise(resolve => setTimeout(resolve, 500));
              const convertedFile = await convertWordToPdf(file);
              results = [{ file: convertedFile, originalName: file.name }];
            } else if (conversionType === 'split-pdf') {
              console.log(`Splitting ${file.name} on client-side`);
              updateProgress(Math.min(baseProgress + 15, 85));
              await new Promise(resolve => setTimeout(resolve, 600));
              results = await splitPdf(file, { mode: 'single' });
            } else {
              throw new Error(`Unsupported client-side conversion: ${conversionType}`);
            }

            convertedFiles.push(...results);
            updateProgress(Math.min(baseProgress + (77 / files.length), 85));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log(`Successfully processed ${file.name}`);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            throw error;
          }
        }
      }
      
      // Progresso final mais suave e garantido
      updateProgress(87);
      await new Promise(resolve => setTimeout(resolve, 250));
      updateProgress(91);
      await new Promise(resolve => setTimeout(resolve, 250));
      updateProgress(95);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(98);
      await new Promise(resolve => setTimeout(resolve, 150));
      updateProgress(100);
      
      console.log('Conversão finalizada, arquivos convertidos:', convertedFiles.length);
      return convertedFiles;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertClientSide, isConverting };
};

// Função melhorada para comprimir PDF usando servidor
const compressPdfWithServer = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ConvertedFile[]> => {
  
  onProgress(5);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log(`Iniciando compressão de ${file.name}, tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversionType', 'reduce-pdf');
    
    onProgress(15);
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress(25);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log('Enviando arquivo para compressão no servidor...');
    
    const response = await fetch('/api/convert-pdf', {
      method: 'POST',
      body: formData,
    });
    
    onProgress(60);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do servidor:', errorText);
      throw new Error(`Erro na compressão: ${response.status} - ${errorText}`);
    }
    
    onProgress(75);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar se a resposta é realmente um PDF
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      console.error('Content-Type inválido:', contentType);
      const responseText = await response.text();
      console.error('Resposta do servidor:', responseText);
      throw new Error('Resposta do servidor não é um PDF válido');
    }
    
    // Obter o blob diretamente da resposta
    const compressedBlob = await response.blob();
    const finalSize = compressedBlob.size;
    
    if (finalSize === 0 || finalSize < 200) {
      throw new Error('Arquivo comprimido está vazio ou corrompido');
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
    
    // Criar arquivo válido a partir do blob
    const compressedFile = new File([compressedBlob], compressedFileName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
    
    console.log('Arquivo final criado com sucesso:', compressedFile.name, 'Tamanho:', compressedFile.size);
    
    onProgress(100);
    
    return [{ file: compressedFile, originalName: file.name }];
    
  } catch (error) {
    console.error('Erro na compressão no servidor:', error);
    throw new Error(`Falha ao comprimir ${file.name}: ${error.message}`);
  }
};
