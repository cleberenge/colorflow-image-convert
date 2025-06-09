
export const convertJpgToPdf = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Verificar se é JPG/JPEG
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      reject(new Error('Arquivo deve ser JPG/JPEG'));
      return;
    }

    const img = new Image();

    img.onload = async () => {
      try {
        // Importar jsPDF dinamicamente
        const { jsPDF } = await import('jspdf');
        
        // Criar novo documento PDF
        const pdf = new jsPDF();
        
        // Obter dimensões da página A4 em pontos
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calcular dimensões da imagem mantendo proporção
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        
        // Centralizar imagem na página
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        
        // Converter imagem para base64
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // Adicionar imagem ao PDF
          pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
          
          // Gerar o PDF como blob
          const pdfBlob = pdf.output('blob');
          
          // Criar arquivo PDF
          const originalName = file.name.replace(/\.(jpg|jpeg)$/i, '');
          const pdfFile = new File([pdfBlob], `${originalName}.pdf`, {
            type: 'application/pdf',
            lastModified: Date.now()
          });
          
          resolve(pdfFile);
        } else {
          reject(new Error('Erro ao processar imagem'));
        }
      } catch (error) {
        reject(new Error('Erro ao criar PDF: ' + error.message));
      }
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };

    // Criar URL da imagem para carregamento
    img.src = URL.createObjectURL(file);
  });
};
