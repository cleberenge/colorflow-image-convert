
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
      console.log(`[ILoveAPI] === INICIANDO COMPRESSÃO DETALHADA ===`);
      console.log(`[ILoveAPI] Arquivo: ${file.name}`);
      console.log(`[ILoveAPI] Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Tipo: ${file.type}`);
      console.log(`[ILoveAPI] Última modificação: ${new Date(file.lastModified).toISOString()}`);
      
      // Verificar se é um PDF válido antes de enviar
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = new TextDecoder().decode(uint8Array.slice(0, 10));
      
      console.log(`[ILoveAPI] === VALIDAÇÃO DO ARQUIVO ORIGINAL ===`);
      console.log(`[ILoveAPI] Header completo: "${header}"`);
      console.log(`[ILoveAPI] Primeiros 50 bytes:`, Array.from(uint8Array.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      console.log(`[ILoveAPI] Últimos 20 bytes:`, Array.from(uint8Array.slice(-20)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      if (!header.startsWith('%PDF-')) {
        throw new Error('O arquivo selecionado não é um PDF válido. Por favor, selecione um arquivo PDF.');
      }
      
      // Verificar se o PDF termina com %%EOF
      const endBytes = new TextDecoder().decode(uint8Array.slice(-10));
      console.log(`[ILoveAPI] Final do arquivo: "${endBytes}"`);
      
      updateProgress(5);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(10);
      
      // Chama a edge function que usa ILoveAPI
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversionType', 'reduce-pdf');
      
      updateProgress(15);
      console.log('[ILoveAPI] === ENVIANDO PARA EDGE FUNCTION ===');
      console.log('[ILoveAPI] FormData criado com arquivo anexado');
      
      const response = await fetch('/api/compress-pdf-iloveapi', {
        method: 'POST',
        body: formData,
      });
      
      updateProgress(60);
      console.log(`[ILoveAPI] === RESPOSTA DA EDGE FUNCTION ===`);
      console.log(`[ILoveAPI] Status: ${response.status}`);
      console.log(`[ILoveAPI] Status Text: ${response.statusText}`);
      console.log(`[ILoveAPI] Headers completos:`, Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      console.log(`[ILoveAPI] Content-Type: ${contentType}`);
      console.log(`[ILoveAPI] Content-Length: ${contentLength}`);
      
      if (!response.ok) {
        console.error('[ILoveAPI] === ERRO NA RESPOSTA ===');
        const errorText = await response.text();
        console.error('[ILoveAPI] Texto do erro:', errorText);
        
        // Tentar parsear como JSON para ver se há mais detalhes
        try {
          const errorJson = JSON.parse(errorText);
          console.error('[ILoveAPI] Erro JSON:', errorJson);
          throw new Error(`Erro na compressão (${response.status}): ${errorJson.error || errorJson.details || errorText}`);
        } catch (parseError) {
          console.error('[ILoveAPI] Erro não é JSON válido');
          throw new Error(`Erro na compressão (${response.status}): ${errorText || 'Erro desconhecido'}`);
        }
      }
      
      updateProgress(75);
      
      // Verificar se a resposta é realmente um PDF
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error(`[ILoveAPI] ERRO: Content-Type inválido: ${contentType}`);
        const responseText = await response.text();
        console.error('[ILoveAPI] Conteúdo da resposta:', responseText.substring(0, 500));
        throw new Error('Resposta do servidor não é um PDF válido');
      }
      
      updateProgress(80);
      
      const compressedBlob = await response.blob();
      console.log(`[ILoveAPI] === BLOB RECEBIDO ===`);
      console.log(`[ILoveAPI] Blob size: ${compressedBlob.size} bytes`);
      console.log(`[ILoveAPI] Blob type: ${compressedBlob.type}`);
      
      if (compressedBlob.size === 0) {
        throw new Error('O arquivo comprimido está vazio. Tente novamente ou use um arquivo diferente.');
      }
      
      updateProgress(85);
      
      // Verificar os bytes do arquivo comprimido em detalhes
      const compressedArrayBuffer = await compressedBlob.arrayBuffer();
      const compressedUint8Array = new Uint8Array(compressedArrayBuffer);
      const compressedHeader = new TextDecoder().decode(compressedUint8Array.slice(0, 20));
      
      console.log(`[ILoveAPI] === VALIDAÇÃO DO ARQUIVO COMPRIMIDO ===`);
      console.log(`[ILoveAPI] Tamanho: ${compressedArrayBuffer.byteLength} bytes`);
      console.log(`[ILoveAPI] Header: "${compressedHeader}"`);
      console.log(`[ILoveAPI] Primeiros 100 bytes:`, Array.from(compressedUint8Array.slice(0, 100)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      console.log(`[ILoveAPI] Últimos 50 bytes:`, Array.from(compressedUint8Array.slice(-50)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      // Verificar PDF válido - mais flexível
      if (!compressedHeader.startsWith('%PDF-')) {
        console.error('[ILoveAPI] === ARQUIVO COMPRIMIDO INVÁLIDO ===');
        console.error('[ILoveAPI] Header esperado: %PDF-');
        console.error('[ILoveAPI] Header recebido:', compressedHeader);
        
        // Log do conteúdo para análise
        const textContent = new TextDecoder().decode(compressedUint8Array.slice(0, 1000));
        console.error('[ILoveAPI] Conteúdo completo dos primeiros 1000 bytes:', textContent);
        
        // Verificar se é uma resposta de erro em JSON
        if (textContent.includes('{') && textContent.includes('}')) {
          try {
            const errorObj = JSON.parse(textContent);
            throw new Error(`Erro da API ILoveAPI: ${errorObj.error || errorObj.message || 'Erro desconhecido'}`);
          } catch (parseError) {
            console.error('[ILoveAPI] Não foi possível parsear como JSON');
          }
        }
        
        throw new Error('Erro na compressão: arquivo resultante não é um PDF válido. Verifique se o arquivo original está íntegro.');
      }
      
      // Verificar se o PDF tem estrutura válida
      const pdfContent = new TextDecoder().decode(compressedUint8Array);
      if (!pdfContent.includes('%%EOF')) {
        console.warn('[ILoveAPI] AVISO: PDF pode estar incompleto - não encontrado %%EOF');
      }
      
      updateProgress(95);
      
      const originalName = file.name.split('.')[0];
      const compressedFileName = `${originalName}_compressed.pdf`;
      
      // Criar o arquivo a partir do arrayBuffer já lido
      const compressedFile = new File([compressedArrayBuffer], compressedFileName, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      console.log(`[ILoveAPI] === COMPRESSÃO CONCLUÍDA COM SUCESSO ===`);
      console.log(`[ILoveAPI] Arquivo final: ${compressedFile.name}`);
      console.log(`[ILoveAPI] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[ILoveAPI] Redução: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(2)}%`);
      
      updateProgress(100);
      
      return [{ file: compressedFile, originalName: file.name }];
      
    } catch (error) {
      console.error('[ILoveAPI] === ERRO DETALHADO NA COMPRESSÃO ===');
      console.error('[ILoveAPI] Tipo do erro:', typeof error);
      console.error('[ILoveAPI] Erro completo:', error);
      console.error('[ILoveAPI] Mensagem:', error.message);
      console.error('[ILoveAPI] Stack trace:', error.stack);
      
      // Log do contexto atual
      console.error('[ILoveAPI] Contexto do erro:');
      console.error('- Arquivo:', file.name);
      console.error('- Tamanho:', file.size);
      console.error('- Tipo:', file.type);
      
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  return { compressPdfWithILoveApi, isConverting };
};
