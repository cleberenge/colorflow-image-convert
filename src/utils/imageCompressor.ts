
import imageCompression from 'browser-image-compression';

// Função para analisar o tipo de conteúdo da imagem
const analyzeImageContent = async (file: File): Promise<'photo' | 'graphic'> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = Math.min(img.width, 100);
      canvas.height = Math.min(img.height, 100);
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let colorVariations = 0;
        const colorSet = new Set();
        
        for (let i = 0; i < data.length; i += 4) {
          const color = `${data[i]}-${data[i+1]}-${data[i+2]}`;
          colorSet.add(color);
        }
        
        colorVariations = colorSet.size;
        
        // Se tem muitas variações de cor, provavelmente é uma foto
        // Se tem poucas variações, provavelmente é um gráfico/logo
        resolve(colorVariations > 500 ? 'photo' : 'graphic');
      } else {
        resolve('photo');
      }
    };
    
    img.onerror = () => resolve('photo');
    img.src = URL.createObjectURL(file);
  });
};

export const compressImage = async (file: File, quality: number = 0.5): Promise<File> => {
  try {
    console.log(`[ImageCompressor] Comprimindo ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Analisar o tipo de conteúdo
    const contentType = await analyzeImageContent(file);
    console.log(`[ImageCompressor] Tipo de conteúdo detectado: ${contentType}`);
    
    // Configurações mais agressivas baseadas no tamanho original
    const originalSizeMB = file.size / 1024 / 1024;
    let maxSizeMB = 0.3; // Muito mais agressivo
    let maxWidthOrHeight = 1280; // Menor resolução
    let finalQuality = quality;
    
    // Ajustar configurações baseadas no tamanho original
    if (originalSizeMB > 10) {
      maxSizeMB = 0.5;
      maxWidthOrHeight = 1024;
      finalQuality = Math.min(quality * 0.7, 0.4);
    } else if (originalSizeMB > 5) {
      maxSizeMB = 0.4;
      maxWidthOrHeight = 1280;
      finalQuality = Math.min(quality * 0.8, 0.5);
    } else if (originalSizeMB > 2) {
      maxSizeMB = 0.3;
      maxWidthOrHeight = 1280;
    }
    
    // Ajustar qualidade baseada no tipo de conteúdo
    if (contentType === 'photo') {
      finalQuality = Math.min(finalQuality * 0.8, 0.5); // Fotos podem ter qualidade menor
    } else {
      finalQuality = Math.min(finalQuality * 0.9, 0.6); // Gráficos precisam manter mais qualidade
    }
    
    console.log(`[ImageCompressor] Configurações: maxSizeMB=${maxSizeMB}, maxWidthOrHeight=${maxWidthOrHeight}, quality=${finalQuality.toFixed(2)}`);
    
    // Primeira passada - redimensionamento e compressão inicial
    const firstPassOptions = {
      maxSizeMB: maxSizeMB * 1.5, // Primeira passada menos agressiva
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      quality: finalQuality + 0.1,
      initialQuality: finalQuality + 0.1,
      alwaysKeepResolution: false,
      fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg'
    };
    
    const firstPassFile = await imageCompression(file, firstPassOptions);
    console.log(`[ImageCompressor] Primeira passada: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(firstPassFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Segunda passada - compressão mais agressiva se ainda muito grande
    let secondPassFile = firstPassFile;
    if (firstPassFile.size > maxSizeMB * 1024 * 1024) {
      const secondPassOptions = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: Math.floor(maxWidthOrHeight * 0.9),
        useWebWorker: true,
        quality: finalQuality,
        initialQuality: finalQuality,
        alwaysKeepResolution: false,
        fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg'
      };
      
      secondPassFile = await imageCompression(firstPassFile, secondPassOptions);
      console.log(`[ImageCompressor] Segunda passada: ${(firstPassFile.size / 1024 / 1024).toFixed(2)} MB → ${(secondPassFile.size / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Terceira passada - otimização final se ainda necessário
    let finalFile = secondPassFile;
    if (secondPassFile.size > maxSizeMB * 1024 * 1024 * 1.2) {
      const finalPassOptions = {
        maxSizeMB: maxSizeMB * 0.8,
        maxWidthOrHeight: Math.floor(maxWidthOrHeight * 0.8),
        useWebWorker: true,
        quality: Math.max(finalQuality * 0.8, 0.3),
        initialQuality: Math.max(finalQuality * 0.8, 0.3),
        alwaysKeepResolution: false,
        fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg'
      };
      
      finalFile = await imageCompression(secondPassFile, finalPassOptions);
      console.log(`[ImageCompressor] Terceira passada: ${(secondPassFile.size / 1024 / 1024).toFixed(2)} MB → ${(finalFile.size / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Criar novo arquivo com nome modificado
    const originalName = file.name.split('.')[0];
    const extension = file.name.split('.').pop();
    const newFileName = `${originalName}_compressed.${extension}`;
    
    const result = new File([finalFile], newFileName, {
      type: finalFile.type,
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

export const compressJpg = async (file: File, quality: number = 0.5): Promise<File> => {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    throw new Error('Arquivo deve ser JPG/JPEG');
  }
  return compressImage(file, quality);
};

export const compressPng = async (file: File, quality: number = 0.6): Promise<File> => {
  if (!file.type.includes('png')) {
    throw new Error('Arquivo deve ser PNG');
  }
  // PNG precisa de qualidade um pouco maior para manter transparência
  return compressImage(file, quality);
};
