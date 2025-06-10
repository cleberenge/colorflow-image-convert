
export const validateVideoFile = (file: File, conversionType: string): void => {
  if (conversionType === 'video-mp3') {
    console.log(`Validating video file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Verificar tamanho do arquivo (máximo 50MB para evitar problemas de memória)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande: ${file.name}. Máximo permitido: 50MB.`);
    }
    
    // Verificar tipo de arquivo
    const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/quicktime'];
    const validExtensions = /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v|3gp)$/i;
    
    if (!validVideoTypes.includes(file.type) && !validExtensions.test(file.name)) {
      throw new Error(`Formato de vídeo não suportado: ${file.name}. Use MP4, AVI, MOV, WMV, FLV, WebM ou MKV.`);
    }
  }
};

export const validateFileCount = (files: File[]): void => {
  if (files.length > 25) {
    throw new Error('Selecione no máximo 25 arquivos.');
  }
};
