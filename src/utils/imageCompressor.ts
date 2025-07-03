
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File, quality: number = 0.2): Promise<File> => {
  try {
    console.log(`[ImageCompressor] Comprimindo ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const originalSizeMB = file.size / 1024 / 1024;
    
    // Definir configurações muito agressivas para garantir 60%+ de redução
    let maxSizeMB = Math.max(originalSizeMB * 0.25, 0.1); // 25% do tamanho original
    let maxWidthOrHeight = 800; // Resolução reduzida para maior compressão
    let finalQuality = 0.15; // Qualidade muito baixa para máxima redução
    
    // Ajustar configurações baseadas no tamanho original
    if (originalSizeMB > 10) {
      maxSizeMB = Math.max(originalSizeMB * 0.2, 0.2);
      maxWidthOrHeight = 600;
      finalQuality = 0.1;
    } else if (originalSizeMB > 5) {
      maxSizeMB = Math.max(originalSizeMB * 0.25, 0.15);
      maxWidthOrHeight = 700;
      finalQuality = 0.15;
    } else if (originalSizeMB > 1) {
      maxSizeMB = Math.max(originalSizeMB * 0.3, 0.1);
      maxWidthOrHeight = 800;
      finalQuality = 0.2;
    }
    
    console.log(`[ImageCompressor] Configurações: maxSizeMB=${maxSizeMB}, maxWidthOrHeight=${maxWidthOrHeight}, quality=${finalQuality}`);
    
    // Primeira passada - compressão muito agressiva
    const firstPassOptions = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      quality: finalQuality,
      initialQuality: finalQuality,
      alwaysKeepResolution: false,
      fileType: 'image/jpeg' // Sempre converter para JPEG para máxima compressão
    };
    
    let compressedFile = await imageCompression(file, firstPassOptions);
    console.log(`[ImageCompressor] Primeira passada: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Verificar se atingiu pelo menos 50% de redução
    let currentReduction = ((file.size - compressedFile.size) / file.size * 100);
    
    // Segunda passada se não atingiu 50% de redução
    if (currentReduction < 50) {
      const secondPassOptions = {
        maxSizeMB: maxSizeMB * 0.6,
        maxWidthOrHeight: Math.floor(maxWidthOrHeight * 0.7),
        useWebWorker: true,
        quality: Math.max(finalQuality * 0.7, 0.05),
        initialQuality: Math.max(finalQuality * 0.7, 0.05),
        alwaysKeepResolution: false,
        fileType: 'image/jpeg'
      };
      
      compressedFile = await imageCompression(compressedFile, secondPassOptions);
      console.log(`[ImageCompressor] Segunda passada: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      currentReduction = ((file.size - compressedFile.size) / file.size * 100);
    }
    
    // Terceira passada se ainda não atingiu 50%
    if (currentReduction < 50) {
      const thirdPassOptions = {
        maxSizeMB: maxSizeMB * 0.4,
        maxWidthOrHeight: Math.floor(maxWidthOrHeight * 0.6),
        useWebWorker: true,
        quality: 0.05,
        initialQuality: 0.05,
        alwaysKeepResolution: false,
        fileType: 'image/jpeg'
      };
      
      compressedFile = await imageCompression(compressedFile, thirdPassOptions);
      console.log(`[ImageCompressor] Terceira passada: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Criar arquivo final com nome modificado
    const originalName = file.name.split('.')[0];
    const extension = 'jpg'; // Sempre JPG para máxima compressão
    const newFileName = `${originalName}_compressed.${extension}`;
    
    const result = new File([compressedFile], newFileName, {
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    const reductionRate = ((file.size - result.size) / file.size * 100).toFixed(1);
    console.log(`[ImageCompressor] Compressão final: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(result.size / 1024 / 1024).toFixed(2)} MB (${reductionRate}% redução)`);
    
    return result;
  } catch (error) {
    console.error('[ImageCompressor] Erro na compressão:', error);
    throw new Error('Falha na compressão da imagem');
  }
};

export const compressJpg = async (file: File, quality: number = 0.2): Promise<File> => {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    throw new Error('Arquivo deve ser JPG/JPEG');
  }
  return compressImage(file, quality);
};

export const compressPng = async (file: File, quality: number = 0.2): Promise<File> => {
  if (!file.type.includes('png')) {
    throw new Error('Arquivo deve ser PNG');
  }
  // PNG será convertido para JPEG para máxima compressão
  return compressImage(file, quality);
};
