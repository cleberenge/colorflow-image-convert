
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
  try {
    // Configurações de compressão
    const options = {
      maxSizeMB: 1, // Tamanho máximo em MB
      maxWidthOrHeight: 1920, // Resolução máxima
      useWebWorker: true,
      quality: quality, // Qualidade da imagem (0-1)
      initialQuality: quality
    };

    console.log(`[ImageCompressor] Comprimindo ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const compressedFile = await imageCompression(file, options);
    
    // Criar novo arquivo com nome modificado
    const originalName = file.name.split('.')[0];
    const extension = file.name.split('.').pop();
    const newFileName = `${originalName}_compressed.${extension}`;
    
    const finalFile = new File([compressedFile], newFileName, {
      type: compressedFile.type,
      lastModified: Date.now()
    });

    console.log(`[ImageCompressor] Compressão concluída: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(finalFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    return finalFile;
  } catch (error) {
    console.error('[ImageCompressor] Erro na compressão:', error);
    throw new Error('Falha na compressão da imagem');
  }
};

export const compressJpg = async (file: File, quality: number = 0.8): Promise<File> => {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    throw new Error('Arquivo deve ser JPG/JPEG');
  }
  return compressImage(file, quality);
};

export const compressPng = async (file: File, quality: number = 0.8): Promise<File> => {
  if (!file.type.includes('png')) {
    throw new Error('Arquivo deve ser PNG');
  }
  return compressImage(file, quality);
};
