
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
    quality = 0.4, // Mais agressivo - 40% de qualidade
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
    
    // Remover metadados corretamente - usar valores válidos em vez de undefined
    if (removeMetadata) {
      console.log('[PDFCompressor] Removendo metadados...');
      try {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('CompressedPDF');
        pdfDoc.setCreator('CompressedPDF');
        // Usar data atual em vez de undefined
        const now = new Date();
        pdfDoc.setCreationDate(now);
        pdfDoc.setModificationDate(now);
        console.log('[PDFCompressor] Metadados removidos com sucesso');
      } catch (metadataError) {
        console.warn('[PDFCompressor] Erro ao remover metadados (continuando):', metadataError);
      }
    }

    // Tentar otimizar imagens se possível
    if (optimizeImages) {
      console.log('[PDFCompressor] Tentando otimizar imagens...');
      try {
        // Percorrer páginas e tentar reduzir qualidade de imagens
        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          console.log(`[PDFCompressor] Processando página ${i + 1}/${pages.length}`);
          
          // Reduzir tamanho da página se muito grande (compressão espacial)
          const { width, height } = page.getSize();
          if (width > 2000 || height > 2000) {
            const scale = Math.min(2000 / width, 2000 / height);
            page.scale(scale, scale);
            console.log(`[PDFCompressor] Página ${i + 1} redimensionada para ${scale.toFixed(2)}x`);
          }
        }
      } catch (imageError) {
        console.warn('[PDFCompressor] Erro na otimização de imagens (continuando):', imageError);
      }
    }

    // Configurar opções de salvamento para máxima compressão
    console.log('[PDFCompressor] Salvando PDF otimizado...');
    const saveOptions = {
      useObjectStreams: true, // Usar streams de objetos para reduzir tamanho
      addDefaultPage: false,
      objectsPerTick: 50, // Menos objetos por tick para mais compressão
      updateFieldAppearances: false, // Não atualizar aparências de campos
      // Remover recursos não utilizados
      subset: true,
    };

    console.log('[PDFCompressor] Opções de salvamento:', saveOptions);

    // Salvar o PDF otimizado
    const compressedBytes = await pdfDoc.save(saveOptions);
    
    console.log(`[PDFCompressor] PDF salvo: ${compressedBytes.length} bytes`);

    // Se não houve compressão significativa, tentar abordagem mais agressiva
    let finalBytes = compressedBytes;
    const initialReduction = ((file.size - compressedBytes.length) / file.size * 100);
    
    if (initialReduction < 5) {
      console.log('[PDFCompressor] Pouca compressão inicial, tentando abordagem mais agressiva...');
      
      try {
        // Recriar PDF do zero copiando apenas o conteúdo essencial
        const newPdfDoc = await PDFDocument.create();
        const pages = pdfDoc.getPages();
        
        for (let i = 0; i < pages.length; i++) {
          console.log(`[PDFCompressor] Copiando página ${i + 1} de forma otimizada...`);
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
          
          // Reduzir qualidade da página
          const { width, height } = copiedPage.getSize();
          const targetScale = Math.min(1.0, Math.min(1200 / width, 1200 / height));
          if (targetScale < 1.0) {
            copiedPage.scale(targetScale, targetScale);
          }
          
          newPdfDoc.addPage(copiedPage);
        }
        
        // Definir metadados mínimos
        newPdfDoc.setTitle('');
        newPdfDoc.setAuthor('');
        newPdfDoc.setProducer('CompressedPDF');
        
        const aggressiveBytes = await newPdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 25,
        });
        
        console.log(`[PDFCompressor] Compressão agressiva: ${aggressiveBytes.length} bytes`);
        
        if (aggressiveBytes.length < compressedBytes.length) {
          finalBytes = aggressiveBytes;
          console.log('[PDFCompressor] Usando resultado da compressão agressiva');
        }
        
      } catch (aggressiveError) {
        console.warn('[PDFCompressor] Compressão agressiva falhou, usando resultado inicial:', aggressiveError);
      }
    }

    // Criar novo arquivo
    const compressedBlob = new Blob([finalBytes], { type: 'application/pdf' });
    const compressedSize = compressedBlob.size;
    const compressionRatio = ((file.size - compressedSize) / file.size * 100);
    
    console.log(`[PDFCompressor] === COMPRESSÃO CONCLUÍDA ===`);
    console.log(`[PDFCompressor] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Tamanho comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PDFCompressor] Redução: ${compressionRatio.toFixed(1)}% (${(file.size - compressedSize)} bytes economizados)`);
    
    // Verificar se houve redução significativa
    if (compressionRatio < 1) {
      console.warn('[PDFCompressor] AVISO: Pouca ou nenhuma redução de tamanho alcançada');
      console.warn('[PDFCompressor] Isso pode indicar que o PDF já está otimizado ou contém principalmente imagens/gráficos comprimidos');
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
    } else if (error.message?.includes('creationDate')) {
      throw new Error('Erro nos metadados do PDF - tentando compressão alternativa');
    } else {
      throw new Error(`Erro ao comprimir PDF: ${error.message || 'Erro desconhecido'}`);
    }
  }
};

export const getEstimatedCompressionInfo = (fileSize: number) => {
  const sizeMB = fileSize / 1024 / 1024;
  
  // Estimativas mais realistas baseadas na nova abordagem
  let estimatedReduction = 15; // porcentagem padrão
  
  if (sizeMB > 20) {
    estimatedReduction = 25;
  } else if (sizeMB > 10) {
    estimatedReduction = 20;
  } else if (sizeMB > 5) {
    estimatedReduction = 18;
  }
  
  const estimatedSizeMB = sizeMB * (1 - estimatedReduction / 100);
  
  return {
    originalSizeMB: sizeMB.toFixed(2),
    estimatedSizeMB: estimatedSizeMB.toFixed(2),
    estimatedReduction: `${estimatedReduction}%`
  };
};
