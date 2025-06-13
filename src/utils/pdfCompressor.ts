
import { PDFDocument } from 'pdf-lib';

export interface CompressionOptions {
  quality?: number; // 0.1 to 1.0
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export const compressPdfClientSide = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  console.log('[PDFCompressor] === INICIANDO COMPRESSÃO CLIENT-SIDE ===');
  console.log(`[PDFCompressor] Arquivo original: ${file.name}`);
  console.log(`[PDFCompressor] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB (${file.size} bytes)`);
  
  const { 
    quality = 0.6, // Reduzindo para 60% para maior compressão
    removeMetadata = true, 
    optimizeImages = true 
  } = options;

  console.log(`[PDFCompressor] Opções: quality=${quality}, removeMetadata=${removeMetadata}, optimizeImages=${optimizeImages}`);

  try {
    // Ler o arquivo PDF
    console.log('[PDFCompressor] Lendo arquivo PDF...');
    const arrayBuffer = await file.arrayBuffer();
    console.log(`[PDFCompressor] Arquivo lido: ${arrayBuffer.byteLength} bytes`);
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    console.log(`[PDFCompressor] PDF carregado com ${pdfDoc.getPageCount()} páginas`);
    
    // Remover metadados se solicitado
    if (removeMetadata) {
      console.log('[PDFCompressor] Removendo metadados...');
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      pdfDoc.setCreationDate(undefined);
      pdfDoc.setModificationDate(undefined);
    }

    // Configurar opções de salvamento para máxima compressão
    console.log('[PDFCompressor] Salvando PDF otimizado...');
    const saveOptions = {
      useObjectStreams: true, // Usar streams de objetos para reduzir tamanho
      addDefaultPage: false,
      objectsPerTick: 100, // Processar mais objetos por tick
      updateFieldAppearances: false, // Não atualizar aparências de campos
    };

    console.log('[PDFCompressor] Opções de salvamento:', saveOptions);

    // Salvar o PDF otimizado
    const compressedBytes = await pdfDoc.save(saveOptions);
    
    console.log(`[PDFCompressor] PDF salvo: ${compressedBytes.length} bytes`);

    // Criar novo arquivo
    const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
    const compressedSize = compressedBlob.size;
    const compressionRatio = ((file.size - compressedSize) / file.size * 100);
    
    console.log(`[PDFCompressor] === COMPRESSÃO CONCLUÍDA ===`);
    console.log(`[PDFCompressor] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Tamanho comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Redução: ${compressionRatio.toFixed(1)}% (${(file.size - compressedSize)} bytes economizados)`);
    
    // Verificar se houve redução significativa
    if (compressionRatio < 1) {
      console.warn('[PDFCompressor] AVISO: Pouca ou nenhuma redução de tamanho alcançada');
      console.warn('[PDFCompressor] Isso pode indicar que o PDF já está otimizado ou contém principalmente imagens/gráficos');
    }
    
    // Gerar nome do arquivo
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    const compressedFileName = `${nameWithoutExt}_comprimido.pdf`;
    
    const resultFile = new File([compressedBlob], compressedFileName, { 
      type: 'application/pdf',
      lastModified: Date.now()
    });

    console.log(`[PDFCompressor] Arquivo final criado: ${resultFile.name}, ${resultFile.size} bytes`);
    
    return resultFile;

  } catch (error) {
    console.error('[PDFCompressor] === ERRO NA COMPRESSÃO ===');
    console.error('[PDFCompressor] Erro detalhado:', error);
    console.error('[PDFCompressor] Stack trace:', error.stack);
    
    // Tentar retornar informações mais específicas sobre o erro
    if (error.message?.includes('Invalid PDF')) {
      throw new Error('O arquivo não é um PDF válido ou está corrompido');
    } else if (error.message?.includes('encrypted')) {
      throw new Error('PDF protegido por senha não pode ser comprimido');
    } else {
      throw new Error(`Erro ao comprimir PDF: ${error.message || 'Erro desconhecido'}`);
    }
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  // Estimativas baseadas em testes típicos com PDF-lib
  let estimatedReduction = 10; // porcentagem padrão (mais conservadora)
  
  if (sizeMB > 20) {
    estimatedReduction = 20;
  } else if (sizeMB > 10) {
    estimatedReduction = 15;
  } else if (sizeMB > 5) {
    estimatedReduction = 12;
  }
  
  const estimatedSizeMB = sizeMB * (1 - estimatedReduction / 100);
  
  return {
    originalSizeMB: sizeMB.toFixed(2),
    estimatedSizeMB: estimatedSizeMB.toFixed(2),
    estimatedReduction: `${estimatedReduction}%`
  };
};
