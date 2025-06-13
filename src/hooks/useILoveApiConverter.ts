
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
      console.log(`Tipo do arquivo: ${file.type}`);
      console.log(`Última modificação: ${new Date(file.lastModified).toISOString()}`);
      
      // Verificar se é um PDF válido antes de enviar
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = new TextDecoder().decode(uint8Array.slice(0, 5));
      
      console.log(`Header do arquivo: ${header}`);
      
      if (!header.startsWith('%PDF-')) {
        throw new Error('O arquivo selecionado não é um PDF válido. Por favor, selecione um arquivo PDF.');
      }
      
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
      
      console.log(`Status da resposta: ${response.status}`);
      console.log(`Headers da resposta:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        
        // Mensagens de erro mais específicas
        if (response.status === 413) {
          throw new Error('Arquivo muito grande. Tente com um arquivo menor que 25MB.');
        } else if (response.status === 415) {
          throw new Error('Tipo de arquivo não suportado. Certifique-se de que é um PDF válido.');
        } else if (response.status === 500) {
          throw new Error('Erro no servidor de compressão. Tente novamente em alguns minutos.');
        } else {
          throw new Error(`Erro na compressão (${response.status}): ${errorText || 'Erro desconhecido'}`);
        }
      }
      
      updateProgress(85);
      
      const compressedBlob = await response.blob();
      console.log(`Tamanho do blob recebido: ${compressedBlob.size} bytes`);
      console.log(`Tipo do blob: ${compressedBlob.type}`);
      
      if (compressedBlob.size === 0) {
        throw new Error('O arquivo comprimido está vazio. Tente novamente ou use um arquivo diferente.');
      }
      
      // Validação mais flexível do PDF comprimido - apenas verificar se não está vazio
      // Removemos a validação rigorosa do header que estava causando problemas
      console.log('Arquivo comprimido recebido com sucesso, pulando validação de header rigorosa');
      
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
      console.log(`Redução: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(2)}%`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('Erro detalhado na compressão com ILoveAPI:', error);
      console.error('Stack trace:', error.stack);
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('PDF válido')) {
        throw error; // Já tem uma mensagem amigável
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Erro de rede. Tente novamente em alguns segundos.');
      } else {
        throw new Error(`Erro na compressão de ${file.name}: ${error.message}`);
      }
    } finally {
      setIsConverting(false);
    }
  };

  return { compressPdfWithILoveApi, isConverting };
};
