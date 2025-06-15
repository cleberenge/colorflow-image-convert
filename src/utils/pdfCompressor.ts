
export interface CompressionOptions {
  quality?: number;
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export const compressPdfClientSide = async (
  file: File, 
  options: CompressionOptions = {},
  progressCallback?: (progress: number) => void
): Promise<File> => {
  console.log('[PDFCompressor] === INICIANDO COMPRESSÃO COM CELERY ===');
  console.log(`[PDFCompressor] Arquivo: ${file.name}, Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Validação simples
  if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
    console.error('[PDFCompressor] Arquivo inválido:', file);
    throw new Error('Por favor, envie um arquivo PDF válido.');
  }

  try {
    console.log('[PDFCompressor] Enviando para API com Celery...');
    
    // Progresso inicial
    if (progressCallback) {
      console.log('[PDFCompressor] Atualizando progresso para 5%');
      progressCallback(5);
    }
    
    // FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('[PDFCompressor] FormData criado, fazendo requisição para /compress...');
    
    // Primeira requisição para iniciar a compressão
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData
    });
    
    console.log('[PDFCompressor] Resposta recebida - Status:', response.status, 'StatusText:', response.statusText);
    console.log('[PDFCompressor] Content-Type da resposta:', response.headers.get('content-type'));
    
    if (!response.ok) {
      console.error('[PDFCompressor] Erro na resposta HTTP:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      let errorMessage = `Erro HTTP ${response.status}`;
      
      try {
        const errorText = await response.text();
        console.error('[PDFCompressor] Corpo da resposta de erro:', errorText);
        errorMessage += `: ${errorText}`;
      } catch (textError) {
        console.error('[PDFCompressor] Erro ao ler texto da resposta:', textError);
      }
      
      throw new Error(`Erro ao enviar o arquivo para compressão - ${errorMessage}`);
    }
    
    // Verificar o content-type para decidir como processar a resposta
    const contentType = response.headers.get('content-type') || '';
    console.log('[PDFCompressor] Content-Type detectado:', contentType);
    
    // Se for PDF direto, processar como blob
    if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
      console.log('[PDFCompressor] Resposta é PDF direto, processando como blob...');
      
      if (progressCallback) progressCallback(90);
      
      const blob = await response.blob();
      
      console.log('[PDFCompressor] Blob recebido:', {
        size: blob.size,
        type: blob.type
      });
      
      // Verificação básica
      if (blob.size === 0) {
        console.error('[PDFCompressor] Arquivo comprimido está vazio');
        throw new Error('Arquivo comprimido está vazio');
      }
      
      if (progressCallback) progressCallback(95);
      
      // Criar nome do arquivo
      const compressedFileName = "compressed_" + file.name;
      
      // Criar arquivo final
      const resultFile = new File([blob], compressedFileName, { 
        type: 'application/pdf',
        lastModified: Date.now()
      });

      // Log de estatísticas
      const originalSize = file.size;
      const compressedSize = resultFile.size;
      const reduction = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100) : 0;
      
      console.log(`[PDFCompressor] === RESULTADO FINAL (DIRETO) ===`);
      console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
      console.log(`[PDFCompressor] === SUCESSO ===`);
      
      if (progressCallback) progressCallback(100);
      
      return resultFile;
    }
    
    // Se for JSON, processar como task
    let data;
    try {
      const responseText = await response.text();
      console.log('[PDFCompressor] Texto da resposta:', responseText.substring(0, 200) + '...');
      
      data = JSON.parse(responseText);
      console.log('[PDFCompressor] Dados JSON recebidos:', data);
    } catch (jsonError) {
      console.error('[PDFCompressor] Erro ao fazer parse do JSON:', jsonError);
      console.error('[PDFCompressor] Resposta não é JSON válido, tentando como texto...');
      
      // Se não conseguir fazer parse, talvez seja um PDF com content-type errado
      const blob = await response.blob();
      if (blob.size > 0) {
        console.log('[PDFCompressor] Tratando resposta como PDF (fallback)...');
        
        const compressedFileName = "compressed_" + file.name;
        const resultFile = new File([blob], compressedFileName, { 
          type: 'application/pdf',
          lastModified: Date.now()
        });
        
        if (progressCallback) progressCallback(100);
        return resultFile;
      }
      
      throw new Error('Resposta da API não é nem JSON nem PDF válido');
    }
    
    if (!data.task_id) {
      console.error('[PDFCompressor] task_id não encontrado na resposta:', data);
      throw new Error('Erro ao enviar o arquivo - task_id não encontrado');
    }
    
    console.log('[PDFCompressor] Task ID recebido com sucesso:', data.task_id);
    
    // Progresso após envio
    if (progressCallback) {
      console.log('[PDFCompressor] Atualizando progresso para 15%');
      progressCallback(15);
    }
    
    // Polling para verificar o status da compressão
    return new Promise((resolve, reject) => {
      let currentProgress = 15;
      let pollCount = 0;
      const maxPolls = 100; // 5 minutos com intervalo de 3s
      
      const pollInterval = setInterval(async () => {
        try {
          pollCount++;
          console.log(`[PDFCompressor] Poll #${pollCount}/${maxPolls} - Verificando status da task:`, data.task_id);
          
          // Incrementa o progresso gradualmente enquanto aguarda
          if (currentProgress < 85) {
            currentProgress += Math.random() * 5 + 2;
            if (progressCallback) {
              progressCallback(Math.min(currentProgress, 85));
            }
          }
          
          const checkResponse = await fetch(`https://compressor-api-tj3z.onrender.com/result/${data.task_id}`);
          
          console.log(`[PDFCompressor] Poll #${pollCount} - Status da verificação:`, {
            status: checkResponse.status,
            statusText: checkResponse.statusText,
            url: checkResponse.url
          });
          
          if (checkResponse.status === 200) {
            // Compressão concluída
            console.log('[PDFCompressor] Compressão concluída! Baixando arquivo...');
            
            if (progressCallback) progressCallback(90);
            
            const blob = await checkResponse.blob();
            
            console.log('[PDFCompressor] Blob recebido:', {
              size: blob.size,
              type: blob.type
            });
            
            // Verificação básica
            if (blob.size === 0) {
              console.error('[PDFCompressor] Arquivo comprimido está vazio');
              throw new Error('Arquivo comprimido está vazio');
            }
            
            if (progressCallback) progressCallback(95);
            
            // Criar nome do arquivo
            const compressedFileName = "compressed_" + file.name;
            
            // Criar arquivo final
            const resultFile = new File([blob], compressedFileName, { 
              type: 'application/pdf',
              lastModified: Date.now()
            });

            // Log de estatísticas
            const originalSize = file.size;
            const compressedSize = resultFile.size;
            const reduction = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100) : 0;
            
            console.log(`[PDFCompressor] === RESULTADO FINAL ===`);
            console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
            console.log(`[PDFCompressor] === SUCESSO ===`);
            
            if (progressCallback) progressCallback(100);
            
            clearInterval(pollInterval);
            resolve(resultFile);
            
          } else if (checkResponse.status === 202) {
            // Ainda processando
            console.log(`[PDFCompressor] Poll #${pollCount} - Ainda processando... aguardando...`);
            
            if (pollCount >= maxPolls) {
              console.error('[PDFCompressor] Timeout: Muitos polls sem resultado');
              clearInterval(pollInterval);
              reject(new Error('Timeout: A compressão demorou mais de 5 minutos'));
            }
            
          } else {
            // Erro
            console.error(`[PDFCompressor] Poll #${pollCount} - Erro ao verificar status:`, {
              status: checkResponse.status,
              statusText: checkResponse.statusText
            });
            
            let errorText = '';
            try {
              errorText = await checkResponse.text();
              console.error('[PDFCompressor] Texto do erro:', errorText);
            } catch (textError) {
              console.error('[PDFCompressor] Erro ao ler texto da resposta de erro:', textError);
            }
            
            clearInterval(pollInterval);
            reject(new Error(`Erro ao verificar status da compressão (${checkResponse.status}): ${errorText}`));
          }
          
        } catch (pollError) {
          console.error(`[PDFCompressor] Poll #${pollCount} - Erro durante polling:`, pollError);
          console.error('[PDFCompressor] Stack trace:', pollError.stack);
          clearInterval(pollInterval);
          reject(new Error(`Erro durante verificação do status: ${pollError.message}`));
        }
      }, 3000); // Verifica a cada 3 segundos
      
    });

  } catch (error) {
    console.error('[PDFCompressor] === ERRO CAPTURADO ===');
    console.error('[PDFCompressor] Tipo do erro:', typeof error);
    console.error('[PDFCompressor] Erro completo:', error);
    console.error('[PDFCompressor] Stack trace:', error.stack);
    console.error('[PDFCompressor] Mensagem:', error.message);
    
    // Tratamento de erros mais específico
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Erro de conexão: Não foi possível conectar com a API de compressão. Verifique sua conexão com a internet.');
    }
    
    if (error.message && error.message.includes('task_id')) {
      throw error; // Re-throw erros específicos da API
    }
    
    if (error.message && error.message.includes('status')) {
      throw error; // Re-throw erros de status HTTP
    }
    
    if (error.message && error.message.includes('JSON')) {
      throw new Error('Erro na resposta da API: formato de dados inválido');
    }
    
    // Erro genérico com mais detalhes
    throw new Error(`Erro na compressão: ${error.message || 'Erro desconhecido'}`);
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  let estimatedReduction = 25;
  
  if (sizeMB > 10) {
    estimatedReduction = 35;
  } else if (sizeMB > 5) {
    estimatedReduction = 30;
  }
  
  const estimatedSizeMB = sizeMB * (1 - estimatedReduction / 100);
  
  return {
    originalSizeMB: sizeMB.toFixed(2),
    estimatedSizeMB: estimatedSizeMB.toFixed(2),
    estimatedReduction: `${estimatedReduction}%`
  };
};
