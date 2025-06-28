
import imageCompression from 'browser-image-compression';

export const compressPngClientSide = async (
  file: File,
  options: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    quality?: number;
  } = {},
  progressCallback?: (progress: number) => void
): Promise<File> => {
  console.log(`[PNG Compressor] Iniciando compressão de: ${file.name}`);
  console.log(`[PNG Compressor] Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

  // Verificar se é PNG
  if (!file.type.includes('png')) {
    throw new Error('Arquivo deve ser PNG');
  }

  // Configurações padrão para compressão PNG
  const compressionOptions = {
    maxSizeMB: options.maxSizeMB || 1,
    maxWidthOrHeight: options.maxWidthOrHeight || 1920,
    useWebWorker: options.useWebWorker !== false,
    quality: options.quality || 0.8,
    fileType: 'image/png' as const,
    preserveExif: false,
    onProgress: (progress: number) => {
      const adjustedProgress = Math.round(progress * 100);
      console.log(`[PNG Compressor] Progresso: ${adjustedProgress}%`);
      if (progressCallback) {
        progressCallback(adjustedProgress);
      }
    }
  };

  try {
    console.log(`[PNG Compressor] Configurações de compressão:`, compressionOptions);
    
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log(`[PNG Compressor] Compressão concluída:`);
    console.log(`- Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Redução: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`);

    // Manter o nome original mas indicar que foi comprimido
    const originalName = file.name.replace('.png', '');
    const compressedFileName = `${originalName}_compressed.png`;
    
    const finalFile = new File([compressedFile], compressedFileName, {
      type: 'image/png',
      lastModified: Date.now()
    });

    return finalFile;
    
  } catch (error) {
    console.error('[PNG Compressor] Erro na compressão:', error);
    throw new Error(`Erro ao comprimir PNG: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
