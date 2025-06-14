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
  
  // Validar se é um arquivo PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Por favor, envie um arquivo PDF válido.');
  }

  try {
    console.log('[PDFCompressor] Preparando envio para API...');
    
    // Criar FormData para envio
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('[PDFCompressor] Enviando para API de compressão...');
    console.log('[PDFCompressor] URL da API: https://compressor-api-tj3z.onrender.com/compress');
    
    // Fazer requisição para a API com timeout aumentado
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos
    
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData,
      signal: controller.signal,
      headers: {
        // Não definir Content-Type para permitir boundary automático do FormData
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('[PDFCompressor] Status da resposta:', response.status);
    console.log('[PDFCompressor] Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('[PDFCompressor] Erro na API:', response.status, response.statusText);
      
      // Tentar ler o corpo da resposta para mais detalhes
      let errorDetails = '';
      try {
        const errorText = await response.text();
        console.error('[PDFCompressor] Detalhes do erro:', errorText);
        errorDetails = errorText;
      } catch (e) {
        console.error('[PDFCompressor] Não foi possível ler detalhes do erro');
      }
      
      // Mensagens de erro mais específicas baseadas no status
      if (response.status === 413) {
        throw new Error('Arquivo muito grande para compressão (limite da API: ~10MB)');
      } else if (response.status === 400) {
        throw new Error('Arquivo PDF inválido ou corrompido');
      } else if (response.status === 500) {
        throw new Error('Erro interno do servidor de compressão');
      } else if (response.status === 503 || response.status === 502) {
        throw new Error('Servidor de compressão temporariamente indisponível (API pode estar "dormindo" - tente novamente em 1 minuto)');
      } else if (response.status === 429) {
        throw new Error('Muitas requisições - aguarde um momento e tente novamente');
      } else {
        throw new Error(`Erro na API de compressão (${response.status}): ${errorDetails || response.statusText}`);
      }
    }
    
    console.log('[PDFCompressor] Recebendo arquivo comprimido...');
    
    // Receber o blob comprimido
    const compressedBlob = await response.blob();
    
    // Verificar se recebemos um arquivo válido
    if (compressedBlob.size === 0) {
      throw new Error('Arquivo comprimido está vazio - possível erro na API');
    }
    
    // Verificar se recebemos realmente um PDF
    if (compressedBlob.type && !compressedBlob.type.includes('pdf')) {
      console.warn('[PDFCompressor] Tipo de arquivo recebido:', compressedBlob.type);
    }
    
    // Calcular redução de tamanho
    const originalSize = file.size;
    const compressedSize = compressedBlob.size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100);
    
    console.log(`[PDFCompressor] === RESULTADO ===`);
    console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
    
    // Criar nome do arquivo comprimido
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    const compressedFileName = `${nameWithoutExt}_comprimido.pdf`;
    
    // Criar o arquivo final
    const resultFile = new File([compressedBlob], compressedFileName, { 
      type: 'application/pdf',
      lastModified: Date.now()
    });

    console.log(`[PDFCompressor] === SUCESSO ===`);
    console.log(`[PDFCompressor] Arquivo final: ${resultFile.name}`);
    console.log(`[PDFCompressor] Redução final: ${reduction.toFixed(1)}%`);
    
    if (reduction < 1) {
      console.warn('[PDFCompressor] AVISO: Redução mínima - PDF já estava otimizado');
    }
    
    return resultFile;

  } catch (error) {
    console.error('[PDFCompressor] === ERRO ===');
    console.error('[PDFCompressor] Tipo do erro:', error.name);
    console.error('[PDFCompressor] Mensagem:', error.message);
    console.error('[PDFCompressor] Detalhes completos:', error);
    
    // Tratamento de erros de rede mais específico
    if (error.name === 'AbortError') {
      throw new Error('Compressão cancelada - tempo limite de 2 minutos excedido. A API pode estar lenta.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Erro de rede
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar com a API. Verifique se a URL está correta ou se há bloqueio de CORS.');
      } else {
        throw new Error('Erro de conexão de rede - verifique sua internet ou tente novamente');
      }
    } else if (error.message && error.message.includes('NetworkError')) {
      throw new Error('Erro de rede - a API pode estar indisponível ou bloqueada pelo navegador');
    } else if (error.message) {
      throw error; // Repassar erros já tratados
    } else {
      throw new Error('Erro desconhecido na compressão do PDF');
    }
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  // Estimativas mais realistas para compressão server-side
  let estimatedReduction = 20; // API geralmente consegue melhor compressão
  
  if (sizeMB > 10) {
    estimatedReduction = 30;
  } else if (sizeMB > 5) {
    estimatedReduction = 25;
  }
  
  const estimatedSizeMB = sizeMB * (1 - estimatedReduction / 100);
  
  return {
    originalSizeMB: sizeMB.toFixed(2),
    estimatedSizeMB: estimatedSizeMB.toFixed(2),
    estimatedReduction: `${estimatedReduction}%`
  };
};
