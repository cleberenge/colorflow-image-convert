
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
      console.log(`[ILoveAPI] === INICIANDO COMPRESSÃO ===`);
      console.log(`[ILoveAPI] Arquivo: ${file.name}`);
      console.log(`[ILoveAPI] Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Tipo: ${file.type}`);
      console.log(`[ILoveAPI] Última modificação: ${new Date(file.lastModified).toISOString()}`);
      
      // Verificar se é um PDF válido antes de enviar
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = new TextDecoder().decode(uint8Array.slice(0, 5));
      
      console.log(`[ILoveAPI] Header do arquivo original: "${header}"`);
      console.log(`[ILoveAPI] Primeiros 20 bytes:`, Array.from(uint8Array.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
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
      console.log('[ILoveAPI] Enviando para compressão via edge function...');
      
      const response = await fetch('/api/compress-pdf-iloveapi', {
        method: 'POST',
        body: formData,
      });
      
      updateProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));
      updateProgress(75);
      
      console.log(`[ILoveAPI] Status da resposta: ${response.status}`);
      console.log(`[ILoveAPI] Headers da resposta:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ILoveAPI] Erro na resposta da API:', errorText);
        
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
      console.log(`[ILoveAPI] Blob recebido:`);
      console.log(`- Tamanho: ${compressedBlob.size} bytes`);
      console.log(`- Tipo: ${compressedBlob.type}`);
      
      if (compressedBlob.size === 0) {
        throw new Error('O arquivo comprimido está vazio. Tente novamente ou use um arquivo diferente.');
      }
      
      // Vamos verificar os primeiros bytes do arquivo comprimido para debug
      const compressedArrayBuffer = await compressedBlob.arrayBuffer();
      const compressedUint8Array = new Uint8Array(compressedArrayBuffer);
      const compressedHeader = new TextDecoder().decode(compressedUint8Array.slice(0, 10));
      
      console.log(`[ILoveAPI] Arquivo comprimido recebido:`);
      console.log(`- Header: "${compressedHeader}"`);
      console.log(`- Primeiros 20 bytes:`, Array.from(compressedUint8Array.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      console.log(`- Últimos 10 bytes:`, Array.from(compressedUint8Array.slice(-10)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      // Verificar se parece ser um PDF válido
      if (!compressedHeader.startsWith('%PDF-')) {
        console.error('[ILoveAPI] ERRO: Arquivo comprimido não tem header de PDF válido!');
        console.error('[ILoveAPI] Header recebido:', compressedHeader);
        
        // Vamos ver se é algum tipo de resposta de erro
        const textContent = new TextDecoder().decode(compressedUint8Array.slice(0, 500));
        console.error('[ILoveAPI] Conteúdo como texto:', textContent);
        
        throw new Error('Erro na compressão: arquivo resultante não é um PDF válido. Verifique se o arquivo original está íntegro.');
      }
      
      updateProgress(95);
      
      const originalName = file.name.split('.')[0];
      const compressedFileName = `${originalName}_compressed.pdf`;
      
      // Criar o arquivo a partir do arrayBuffer já lido
      const compressedFile = new File([compressedArrayBuffer], compressedFileName, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      console.log(`[ILoveAPI] === COMPRESSÃO CONCLUÍDA ===`);
      console.log(`[ILoveAPI] Arquivo criado: ${compressedFile.name}`);
      console.log(`[ILoveAPI] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Redução: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(2)}%`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('[ILoveAPI] === ERRO NA COMPRESSÃO ===');
      console.error('[ILoveAPI] Erro:', error);
      console.error('[ILoveAPI] Stack trace:', error.stack);
      
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
