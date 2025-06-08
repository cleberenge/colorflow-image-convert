
export const convertPngToJpg = async (file: File, quality: number = 0.9): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Verificar se é PNG
    if (!file.type.includes('png')) {
      reject(new Error('Arquivo deve ser PNG'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Configurar canvas com as dimensões da imagem
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Preencher com fundo branco (JPG não suporta transparência)
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar a imagem PNG no canvas
        ctx.drawImage(img, 0, 0);
      }

      // Converter para JPG
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file.name.replace('.png', '');
          const jpgFile = new File([blob], `${originalName}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(jpgFile);
        } else {
          reject(new Error('Falha na conversão'));
        }
      }, 'image/jpeg', quality);
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };

    // Criar URL da imagem para carregamento
    img.src = URL.createObjectURL(file);
  });
};
