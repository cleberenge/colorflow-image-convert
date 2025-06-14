
export interface CompressionOptions {
  quality?: number;
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export const compressPdfClientSide = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  console.log('[PDFCompressor] === INICIANDO COMPRESSÃO COM API ===');
  console.log(`[PDFCompressor] Arquivo: ${file.name}, Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[PDFCompressor] Tipo do arquivo: ${file.type}`);
  
  // Validação mais flexível do arquivo PDF
  const fileName = file.name.toLowerCase();
  const isValidPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf' || file.type.includes('pdf');
  
  if (!isValidPdf) {
    throw new Error('Por favor, envie um arquivo PDF válido.');
  }

  try {
    console.log('[PDFCompressor] Preparando FormData...');
    
    // Criar FormData simples
    const formData = new FormData();
    formData.append("file", file, file.name);
    
    console.log('[PDFCompressor] Enviando para API...');
    console.log('[PDFCompressor] URL:', 'https://compressor-api-tj3z.onrender.com/compress');
    
    // Requisição mais simples e direta
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData,
      // Remover headers personalizados - deixar o browser definir automaticamente
      mode: 'cors', // Explicitamente definir modo CORS
    });
    
    console.log('[PDFCompressor] Status da resposta:', response.status);
    console.log('[PDFCompressor] OK?', response.ok);
    
    if (!response.ok) {
      console.error('[PDFCompressor] Resposta não OK:', response.status, response.statusText);
      
      // Tentar ler detalhes do erro
      let errorDetails = '';
      try {
        const contentType = response.headers.get('content-type');
        console.log('[PDFCompressor] Content-Type da resposta:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          errorDetails = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
        } else {
          errorDetails = await response.text();
        }
        console.error('[PDFCompressor] Detalhes do erro:', errorDetails);
      } catch (e) {
        console.error('[PDFCompressor] Não foi possível ler detalhes do erro:', e);
      }
      
      // Mensagens de erro específicas
      switch (response.status) {
        case 413:
          throw new Error('Arquivo muito grande para compressão (limite da API excedido)');
        case 400:
          throw new Error(`Arquivo PDF inválido: ${errorDetails || 'formato não suportado'}`);
        case 422:
          throw new Error(`Erro de validação: ${errorDetails || 'dados inválidos'}`);
        case 500:
          throw new Error('Erro interno do servidor de compressão');
        case 503:
        case 502:
          throw new Error('Servidor temporariamente indisponível (pode estar inicializando)');
        case 429:
          throw new Error('Muitas requisições - aguarde e tente novamente');
        default:
          throw new Error(`Erro da API (${response.status}): ${errorDetails || response.statusText}`);
      }
    }
    
    console.log('[PDFCompressor] Processando resposta...');
    
    // Verificar content-type da resposta
    const contentType = response.headers.get('content-type');
    console.log('[PDFCompressor] Content-Type da resposta:', contentType);
    
    const compressedBlob = await response.blob();
    console.log('[PDFCompressor] Blob recebido - Tamanho:', compressedBlob.size, 'Tipo:', compressedBlob.type);
    
    // Verificações de segurança
    if (compressedBlob.size === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    if (compressedBlob.size >= file.size) {
      console.warn('[PDFCompressor] Arquivo comprimido é maior ou igual ao original');
    }
    
    // Calcular estatísticas
    const originalSize = file.size;
    const compressedSize = compressedBlob.size;
    const reduction = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100) : 0;
    
    console.log(`[PDFCompressor] === RESULTADO ===`);
    console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
    
    // Criar nome do arquivo final
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    const compressedFileName = `${nameWithoutExt}_comprimido.pdf`;
    
    // Criar arquivo final com tipo correto
    const resultFile = new File([compressedBlob], compressedFileName, { 
      type: 'application/pdf',
      lastModified: Date.now()
    });

    console.log(`[PDFCompressor] === SUCESSO ===`);
    console.log(`[PDFCompressor] Arquivo final: ${resultFile.name}`);
    
    return resultFile;

  } catch (error) {
    console.error('[PDFCompressor] === ERRO CAPTURADO ===');
    console.error('[PDFCompressor] Nome do erro:', error.name);
    console.error('[PDFCompressor] Mensagem:', error.message);
    console.error('[PDFCompressor] Stack:', error.stack);
    
    // Tratamento de erros específicos
    if (error.name === 'TypeError') {
      if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar com a API. Verifique se a URL está acessível.');
      }
    }
    
    if (error.name === 'NetworkError') {
      throw new Error('Erro de rede - verifique sua conexão com a internet');
    }
    
    // Se já é um erro tratado, repassa
    if (error.message && typeof error.message === 'string') {
      throw error;
    }
    
    // Erro genérico
    throw new Error('Erro desconhecido na compressão do PDF');
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  let estimatedReduction = 25; // Estimativa realista para API externa
  
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
