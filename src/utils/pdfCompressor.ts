
export interface CompressionOptions {
  quality?: number;
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export const compressPdfClientSide = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  console.log('[PDFCompressor] === INICIANDO COMPRESSÃO ===');
  console.log(`[PDFCompressor] Arquivo: ${file.name}, Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Validação simples como no script JS
  if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Por favor, envie um arquivo PDF válido.');
  }

  try {
    console.log('[PDFCompressor] Criando FormData...');
    
    // FormData exatamente como no script JS
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('[PDFCompressor] Enviando para API...');
    
    // Requisição simples como no script JS - sem headers customizados
    const response = await fetch("https://compressor-api-tj3z.onrender.com/compress", {
      method: "POST",
      body: formData
    });
    
    console.log('[PDFCompressor] Status da resposta:', response.status);
    console.log('[PDFCompressor] OK?', response.ok);
    
    if (!response.ok) {
      console.error('[PDFCompressor] Erro na resposta:', response.status, response.statusText);
      throw new Error("Erro ao comprimir o PDF");
    }
    
    console.log('[PDFCompressor] Obtendo blob...');
    const blob = await response.blob();
    
    console.log('[PDFCompressor] Blob recebido - Tamanho:', blob.size);
    
    // Verificação básica
    if (blob.size === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    // Criar nome do arquivo como no script JS
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
    
    return resultFile;

  } catch (error) {
    console.error('[PDFCompressor] === ERRO ===');
    console.error('[PDFCompressor] Erro capturado:', error);
    
    // Mensagens de erro simples como no script JS
    if (error.message && error.message.includes('comprimir')) {
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
