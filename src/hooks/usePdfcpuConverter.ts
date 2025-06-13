
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';

export const usePdfcpuConverter = () => {
  const [isConverting, setIsConverting] = useState(false);

  const compressPdfWithPdfcpu = async (
    file: File,
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    
    try {
      console.log(`[PDFCPU] Iniciando compressão: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      
      updateProgress(10);
      
      // Chama a edge function que usa pdfcpu
      const formData = new FormData();
      formData.append('file', file);
      
      updateProgress(30);
      
      const response = await fetch('/api/compress-pdf-pdfcpu', {
        method: 'POST',
        body: formData,
      });
      
      updateProgress(70);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PDFCPU] Erro na resposta:', errorText);
        
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
      
      updateProgress(95);
      
      const originalName = file.name.split('.')[0];
      const compressedFileName = `${originalName}_compressed.pdf`;
      
      const compressedFile = new File([compressedBlob], compressedFileName, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      console.log(`[PDFCPU] Sucesso: ${file.name} -> ${compressedFile.name}`);
      console.log(`[PDFCPU] Redução: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('[PDFCPU] Erro:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return { compressPdfWithPdfcpu, isConverting };
};
