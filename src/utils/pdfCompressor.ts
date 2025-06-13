
import { PDFDocument } from 'pdf-lib';

export interface CompressionOptions {
  quality?: number;
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export const compressPdfClientSide = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  console.log('[PDFCompressor] === INICIANDO COMPRESSÃO SIMPLIFICADA ===');
  console.log(`[PDFCompressor] Arquivo: ${file.name}, Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  
  const { 
    quality = 0.7,
    removeMetadata = true, 
    optimizeImages = true 
  } = options;

  try {
    // Ler o arquivo PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    console.log(`[PDFCompressor] PDF carregado: ${pdfDoc.getPageCount()} páginas`);
    
    // Remover metadados de forma segura
    if (removeMetadata) {
      console.log('[PDFCompressor] Removendo metadados...');
      try {
        // Apenas definir metadados essenciais e seguros
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        // Não mexer com datas para evitar erros
      } catch (error) {
        console.warn('[PDFCompressor] Aviso ao limpar metadados:', error.message);
      }
    }

    // Aplicar compressão básica nas páginas
    if (optimizeImages) {
      console.log('[PDFCompressor] Otimizando páginas...');
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        try {
          const page = pages[i];
          const { width, height } = page.getSize();
          
          // Reduzir páginas muito grandes
          if (width > 1200 || height > 1200) {
            const scale = Math.min(1200 / width, 1200 / height, 0.9);
            page.scale(scale, scale);
            console.log(`[PDFCompressor] Página ${i + 1} redimensionada: ${scale.toFixed(2)}x`);
          }
        } catch (pageError) {
          console.warn(`[PDFCompressor] Erro na página ${i + 1}:`, pageError.message);
        }
      }
    }

    // Salvar com opções de compressão otimizadas
    console.log('[PDFCompressor] Salvando PDF comprimido...');
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
      updateFieldAppearances: false
    });
    
    // Verificar se houve compressão
    const originalSize = file.size;
    const compressedSize = compressedBytes.length;
    const reduction = ((originalSize - compressedSize) / originalSize * 100);
    
    console.log(`[PDFCompressor] === RESULTADO ===`);
    console.log(`[PDFCompressor] Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Redução: ${reduction.toFixed(1)}%`);
    
    // Se a redução foi mínima, tentar uma segunda abordagem
    let finalBytes = compressedBytes;
    
    if (reduction < 3) {
      console.log('[PDFCompressor] Tentando compressão mais agressiva...');
      try {
        const newPdf = await PDFDocument.create();
        const pages = pdfDoc.getPages();
        
        // Copiar páginas com mais compressão
        for (let i = 0; i < Math.min(pages.length, 20); i++) { // Limitar para evitar problemas
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          
          // Aplicar escala mais agressiva
          const { width, height } = copiedPage.getSize();
          const maxDimension = Math.max(width, height);
          if (maxDimension > 800) {
            const scale = 800 / maxDimension;
            copiedPage.scale(scale, scale);
          }
          
          newPdf.addPage(copiedPage);
        }
        
        const aggressiveBytes = await newPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 25
        });
        
        if (aggressiveBytes.length < compressedBytes.length) {
          finalBytes = aggressiveBytes;
          const newReduction = ((originalSize - aggressiveBytes.length) / originalSize * 100);
          console.log(`[PDFCompressor] Compressão agressiva melhor: ${newReduction.toFixed(1)}%`);
        }
        
      } catch (aggressiveError) {
        console.warn('[PDFCompressor] Compressão agressiva falhou:', aggressiveError.message);
      }
    }
    
    // Criar arquivo final
    const compressedBlob = new Blob([finalBytes], { type: 'application/pdf' });
    const finalReduction = ((originalSize - finalBytes.length) / originalSize * 100);
    
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    const compressedFileName = `${nameWithoutExt}_comprimido.pdf`;
    
    const resultFile = new File([compressedBlob], compressedFileName, { 
      type: 'application/pdf',
      lastModified: Date.now()
    });

    console.log(`[PDFCompressor] === SUCESSO ===`);
    console.log(`[PDFCompressor] Arquivo final: ${resultFile.name}`);
    console.log(`[PDFCompressor] Redução final: ${finalReduction.toFixed(1)}%`);
    
    if (finalReduction < 1) {
      console.warn('[PDFCompressor] AVISO: PDF já otimizado ou contém conteúdo não comprimível');
    }
    
    return resultFile;

  } catch (error) {
    console.error('[PDFCompressor] === ERRO ===');
    console.error('[PDFCompressor] Detalhes:', error.message);
    
    // Erros mais específicos
    if (error.message?.includes('Invalid PDF')) {
      throw new Error('PDF inválido ou corrompido');
    } else if (error.message?.includes('encrypted')) {
      throw new Error('PDF protegido por senha');
    } else if (error.message?.includes('creationDate') || error.message?.includes('Date')) {
      throw new Error('Erro nos metadados do PDF');
    } else {
      throw new Error(`Falha na compressão: ${error.message}`);
    }
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  let estimatedReduction = 10; // Mais conservador
  
  if (sizeMB > 10) {
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
