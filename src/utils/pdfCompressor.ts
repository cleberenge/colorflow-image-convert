
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
    throw new Error('Por favor, envie um arquivo PDF válido.');
  }

  try {
    console.log('[PDFCompressor] Enviando para API com Celery...');
    
    // Progresso inicial
    if (progressCallback) progressCallback(5);
    
    // FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('[PDFCompressor] Fazendo requisição para /compress...');
    
    // Primeira requisição para iniciar a compressão
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData
    });
    
    console.log('[PDFCompressor] Status da resposta:', response.status);
    
    if (!response.ok) {
      console.error('[PDFCompressor] Erro na resposta:', response.status, response.statusText);
      throw new Error("Erro ao enviar o arquivo para compressão");
    }
    
    const data = await response.json();
    console.log('[PDFCompressor] Resposta recebida:', data);
    
    if (!data.task_id) {
      throw new Error('Erro ao enviar o arquivo - task_id não encontrado');
    }
    
    console.log('[PDFCompressor] Task ID recebido:', data.task_id);
    
    // Progresso após envio
    if (progressCallback) progressCallback(15);
    
    // Polling para verificar o status da compressão
    return new Promise((resolve, reject) => {
      let currentProgress = 15;
      
      const pollInterval = setInterval(async () => {
        try {
          console.log('[PDFCompressor] Verificando status da task:', data.task_id);
          
          // Incrementa o progresso gradualmente enquanto aguarda
          if (currentProgress < 85) {
            currentProgress += Math.random() * 5 + 2; // Incremento entre 2-7%
            if (progressCallback) progressCallback(Math.min(currentProgress, 85));
          }
          
          const checkResponse = await fetch(`https://compressor-api-tj3z.onrender.com/result/${data.task_id}`);
          
          console.log('[PDFCompressor] Status da verificação:', checkResponse.status);
          
          if (checkResponse.status === 200) {
            // Compressão concluída
            console.log('[PDFCompressor] Compressão concluída! Baixando arquivo...');
            
            if (progressCallback) progressCallback(90);
            
            const blob = await checkResponse.blob();
            
            console.log('[PDFCompressor] Blob recebido - Tamanho:', blob.size);
            
            // Verificação básica
            if (blob.size === 0) {
              throw new Error('Arquivo comprimido está vazio');
            }
            
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
            
            console.log(`[PDFCompressor] === RESULTADO ===`);
            console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
            console.log(`[PDFCompressor] === SUCESSO ===`);
            
            if (progressCallback) progressCallback(100);
            
            clearInterval(pollInterval);
            resolve(resultFile);
            
          } else if (checkResponse.status === 202) {
            // Ainda processando
            console.log('[PDFCompressor] Ainda processando... aguardando...');
            
          } else {
            // Erro
            console.error('[PDFCompressor] Erro ao verificar status:', checkResponse.status);
            clearInterval(pollInterval);
            reject(new Error('Erro ao verificar status da compressão'));
          }
          
        } catch (pollError) {
          console.error('[PDFCompressor] Erro durante polling:', pollError);
          clearInterval(pollInterval);
          reject(new Error('Erro durante verificação do status'));
        }
      }, 3000); // Verifica a cada 3 segundos
      
      // Timeout após 5 minutos
      setTimeout(() => {
        clearInterval(pollInterval);
        reject(new Error('Timeout: A compressão demorou mais de 5 minutos'));
      }, 300000);
    });

  } catch (error) {
    console.error('[PDFCompressor] === ERRO ===');
    console.error('[PDFCompressor] Erro capturado:', error);
    
    // Mensagens de erro específicas
    if (error.message && (error.message.includes('comprimir') || error.message.includes('task_id') || error.message.includes('status'))) {
      throw error;
    }
    
    // Erro genérico
    throw new Error('Ocorreu um erro durante a compressão.');
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
