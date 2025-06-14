
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
    
    // Fazer requisição para a API
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      console.error('[PDFCompressor] Erro na API:', response.status, response.statusText);
      
      // Mensagens de erro mais específicas baseadas no status
      if (response.status === 413) {
        throw new Error('Arquivo muito grande para compressão (limite da API excedido)');
      } else if (response.status === 400) {
        throw new Error('Arquivo PDF inválido ou corrompido');
      } else if (response.status === 500) {
        throw new Error('Erro interno do servidor de compressão');
      } else if (response.status === 503) {
        throw new Error('Serviço de compressão temporariamente indisponível');
      } else {
        throw new Error(`Erro ao comprimir PDF (${response.status})`);
      }
    }
    
    console.log('[PDFCompressor] Recebendo arquivo comprimido...');
    
    // Receber o blob comprimido
    const compressedBlob = await response.blob();
    
    // Verificar se recebemos um arquivo válido
    if (compressedBlob.size === 0) {
      throw new Error('Arquivo comprimido está vazio - possível erro na API');
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
    console.error('[PDFCompressor] Detalhes:', error);
    
    // Tratamento de erros de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Erro de conexão - verifique sua internet ou tente novamente');
    } else if (error.name === 'AbortError') {
      throw new Error('Compressão cancelada - tempo limite excedido');
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
