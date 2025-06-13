
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
      console.log(`[ILoveAPI] Iniciando compressão: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      
      updateProgress(10);
      
      // Chama a edge function que usa ILoveAPI
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversionType', 'reduce-pdf');
      
      updateProgress(30);
      
      const response = await fetch('/api/compress-pdf-iloveapi', {
        method: 'POST',
        body: formData,
      });
      
      updateProgress(70);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ILoveAPI] Erro na resposta:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorJson.details || errorText);
        } catch {
          throw new Error(`Erro na compressão (${response.status}): ${errorText}`);
        }
      }
      
      updateProgress(85);
      
      const compressedBlob = await response.blob();
      
      if (compressedBlob.size === 0) {
        throw new Error('O arquivo comprimido está vazio. Tente novamente.');
      }
      
      // Verificação básica apenas - não validação excessiva
      const arrayBuffer = await compressedBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Apenas verificar se tem algum conteúdo
      if (uint8Array.length < 100) {
        throw new Error('Arquivo comprimido muito pequeno ou inválido.');
      }
      
      updateProgress(95);
      
      const originalName = file.name.split('.')[0];
      const compressedFileName = `${originalName}_compressed.pdf`;
      
      const compressedFile = new File([arrayBuffer], compressedFileName, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      console.log(`[ILoveAPI] Sucesso: ${file.name} -> ${compressedFile.name}`);
      console.log(`[ILoveAPI] Redução: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('[ILoveAPI] Erro:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return { compressPdfWithILoveApi, isConverting };
};
