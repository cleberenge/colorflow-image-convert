
import imageCompression from 'browser-image-compression';

export const convertSvgToPng = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.includes('svg')) {
      reject(new Error('Arquivo deve ser SVG'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgText = e.target?.result as string;
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name.replace('.svg', '');
            const pngFile = new File([blob], `${originalName}.png`, {
              type: 'image/png',
              lastModified: Date.now()
            });
            resolve(pngFile);
          } else {
            reject(new Error('Falha na conversão SVG para PNG'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Erro ao carregar SVG'));
      
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(svgBlob);
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo SVG'));
    reader.readAsText(file);
  });
};

export const convertSvgToJpg = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.includes('svg')) {
      reject(new Error('Arquivo deve ser SVG'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgText = e.target?.result as string;
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name.replace('.svg', '');
            const jpgFile = new File([blob], `${originalName}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(jpgFile);
          } else {
            reject(new Error('Falha na conversão SVG para JPG'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => reject(new Error('Erro ao carregar SVG'));
      
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(svgBlob);
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo SVG'));
    reader.readAsText(file);
  });
};

export const convertJpgToWebp = async (file: File): Promise<File> => {
  return new Promise(async (resolve, reject) => {
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      reject(new Error('Arquivo deve ser JPG/JPEG'));
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.(jpg|jpeg)$/i, '');
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          } else {
            reject(new Error('Falha na conversão JPG para WebP'));
          }
        }, 'image/webp', 0.8);
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem JPG'));
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(new Error('Erro na conversão: ' + error.message));
    }
  });
};
