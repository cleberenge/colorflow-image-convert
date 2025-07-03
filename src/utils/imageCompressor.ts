
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File, quality: number = 0.3): Promise<File> => {
  try {
    console.log(`[ImageCompressor] Comprimindo ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Configurações muito mais agressivas para garantir pelo menos 60% de redução
    const originalSizeMB = file.size / 1024 / 1024;
    let maxSizeMB = Math.max(originalSizeMB * 0.3, 0.2); // 30% do tamanho original ou 0.2MB mínimo
    let maxWidthOrHeight = 1024; // Resolução menor para maior compressão
    let finalQuality = 0.3; // Qualidade muito baixa para máxima compressão
    
    // Ajustar configurações baseadas no tamanho original para garantir 60%+ redução
    if (originalSizeMB > 10) {
      maxSizeMB = Math.max(originalSizeMB * 0.25, 0.3);
      maxWidthOrHeight = 800;
      finalQuality = 0.25;
    } else if (originalSizeMB > 5) {
      maxSizeMB = Math.max(originalSizeMB * 0.3, 0.25);
      maxWidthOrHeight = 900;
      finalQuality = 0.3;
    } else if (originalSizeMB > 2) {
      maxSizeMB = Math.max(originalSizeMB * 0.35, 0.2);
      maxWidthOrHeight = 1000;
      finalQuality = 0.35;
    }
    
    console.log(`[ImageCompressor] Configurações agressivas: maxSizeMB=${maxSizeMB}, maxWidthOrHeight=${maxWidthOrHeight}, quality=${finalQuality.toFixed(2)}`);
    
    // Primeira passada - compressão agressiva
    const firstPassOptions = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      quality: finalQuality,
      initialQuality: finalQuality,
      alwaysKeepResolution: false,
      fileType: file.type.includes('png') ? 'image/jpeg' : 'image/jpeg' // Forçar JPEG para máxima compressão
    };
    
    const firstPassFile = await imageCompression(file, firstPassOptions);
    console.log(`[ImageCompressor] Primeira passada: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(firstPassFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Segunda passada se ainda não atingiu 60% de redução
    let finalFile = firstPassFile;
    const currentReduction = ((file.size - firstPassFile.size) / file.size * 100);
    
    if (currentReduction < 60 && firstPassFile.size > maxSizeMB * 0.8 * 1024 * 1024) {
      const secondPassOptions = {
        maxSizeMB: maxSizeMB * 0.7,
        maxWidthOrHeight: Math.floor(maxWidthOrHeight * 0.8),
        useWebWorker: true,
        quality: Math.max(finalQuality * 0.8, 0.2),
        initialQuality: Math.max(finalQuality * 0.8, 0.2),
        alwaysKeepResolution: false,
        fileType: 'image/jpeg'
      };
      
      finalFile = await imageCompression(firstPassFile, secondPassOptions);
      console.log(`[ImageCompressor] Segunda passada: ${(firstPassFile.size / 1024 / 1024).toFixed(2)} MB → ${(finalFile.size / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Criar novo arquivo com nome modificado
    const originalName = file.name.split('.')[0];
    const extension = file.type.includes('png') ? 'jpg' : file.name.split('.').pop(); // PNG vira JPG
    const newFileName = `${originalName}_compressed.${extension}`;
    
    const result = new File([finalFile], newFileName, {
      type: 'image/jpeg', // Forçar JPEG para todos
      lastModified: Date.now()
    });

    const reductionRate = ((file.size - result.size) / file.size * 100).toFixed(1);
    console.log(`[ImageCompressor] Compressão concluída: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(result.size / 1024 / 1024).toFixed(2)} MB (${reductionRate}% redução)`);
    
    return result;
  } catch (error) {
    console.error('[ImageCompressor] Erro na compressão:', error);
    throw new Error('Falha na compressão da imagem');
  }
};

export const compressJpg = async (file: File, quality: number = 0.3): Promise<File> => {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    throw new Error('Arquivo deve ser JPG/JPEG');
  }
  return compressImage(file, quality);
};

export const compressPng = async (file: File, quality: number = 0.3): Promise<File> => {
  if (!file.type.includes('png')) {
    throw new Error('Arquivo deve ser PNG');
  }
  // PNG será convertido para JPEG para máxima compressão
  return compressImage(file, quality);
};
