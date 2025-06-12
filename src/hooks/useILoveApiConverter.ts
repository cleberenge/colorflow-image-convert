
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';

export const useILoveApiConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const compressPdfWithILoveApi = async (
    file: File,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    
    try {
      console.log(`Iniciando compressão com ILoveAPI: ${file.name}, tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      
      updateProgress(5);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(10);
      
      // Chama a edge function que usa ILoveAPI
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversionType', 'reduce-pdf');
      
      updateProgress(15);
      console.log('Enviando para compressão via ILoveAPI...');
      
      const response = await fetch('/api/compress-pdf-iloveapi', {
        method: 'POST',
        body: formData,
      });
      
      updateProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));
      updateProgress(75);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        throw new Error(`Erro na compressão: ${response.status} - ${errorText}`);
      }
      
      updateProgress(85);
      
      const compressedBlob = await response.blob();
      
      if (compressedBlob.size === 0) {
        throw new Error('Arquivo comprimido está vazio');
      }
      
      updateProgress(95);
      
      const originalName = file.name.split('.')[0];
      const compressedFileName = `${originalName}_compressed.pdf`;
      
      const compressedFile = new File([compressedBlob], compressedFileName, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      console.log(`Compressão concluída com sucesso: ${compressedFile.name}`);
      console.log(`Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('Erro na compressão com ILoveAPI:', error);
      throw new Error(`Falha ao comprimir ${file.name}: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return { compressPdfWithILoveApi, isConverting };
};
