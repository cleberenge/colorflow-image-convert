
// DEFINE A COR DA ÁREA DE UPLOAD
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#47E5BC', // verde claro
    'jpg-pdf': '#FDEE00', // amarelo
    'pdf-word': '#6366F1', // índigo
    'word-pdf': '#DC2626', // vermelho
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#73D2DE', // ciano
    'merge-pdf': '#FFAAA5', // rosa claro
    'reduce-pdf': '#8B3D88', // vermelho escuro
    'reduce-jpg': '#FFFFFF', // vermelho escuro
    'reduce-png': '#FF7E6B', // roxo escuro
    // Novas conversões
    'svg-png': '#DCEDC1', // verde pastel
    'jpg-webp': '#706F6F', // vermelho coral
    'svg-jpg':  '#8A89C0', // magenta
    'html-pdf': '#998785', // cinza rosado
    'csv-json': '#F2C80F', // dourado
    'csv-excel': '#059669' // verde escuro
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#3DD4AA', // verde claro hover
    'jpg-pdf': '#E6D500', // amarelo hover
    'pdf-word': '#4F46E5', // índigo hover
    'word-pdf': '#B91C1C', // vermelho hover
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#5FC9D6', // ciano hover
    'merge-pdf': '#FF9691', // rosa claro hover
    'reduce-pdf': '#A00010', // vermelho escuro hover
    'reduce-jpg': '#A00010', // vermelho escuro hover
    'reduce-png': '#7A0A2E', // roxo escuro hover
    // Novas conversões hover
    'svg-png': '#C8E6AC', // verde pastel hover
    'jpg-webp': '#FC4A45', // vermelho coral hover
    'svg-jpg': '#E6004A', // magenta hover
    'html-pdf': '#7F6E6B', // cinza rosado hover
    'csv-json': '#DAB408', // dourado hover
    'csv-excel': '#047857' // verde escuro hover
  };
  
  return colorMap[conversionType] || '#4B5563';
};

// Função para obter cores de texto com suporte a hexadecimal
export const getUploadTextColor = (conversionType: string): string => {
  const textColorMap: Record<string, string> = {
    'png-jpg': '#000000',          // Preto para PNG para JPG
    'jpg-pdf': '#000000',          // Preto para JPG para PDF  
    'split-pdf': '#000000',        // Preto para Dividir PDF
    'merge-pdf': '#000000',        // Preto para Juntar PDF
    'reduce-pdf': '#FFFFFF',       // Branco para Reduzir PDF
    'reduce-jpg': '#FFFFFF',       // Branco para Reduzir JPG
    'reduce-png': '#FFFFFF',       // Branco para Reduzir PNG
    'svg-png': '#000000',          // Preto para SVG para PNG
    'jpg-webp': '#000000',         // Preto para JPG para WebP
    'svg-jpg': '#FFFFFF',          // Branco para SVG para JPG
    'html-pdf': '#000000',         // Preto para HTML para PDF
    'csv-json': '#000000',         // Preto para CSV para JSON
    'csv-excel': '#FFFFFF',        // Branco para CSV para Excel
  };
  
  return textColorMap[conversionType] || '#000000';
};
