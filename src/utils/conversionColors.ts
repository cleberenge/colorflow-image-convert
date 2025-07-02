
// DEFINE A COR DA ÁREA DE UPLOAD
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#47E5BC', // amarelo claro (cor solicitada)
    'jpg-pdf': '#FDEE00', // laranja
    'pdf-word': '#6366F1', // índigo (era do split-pdf)
    'word-pdf': '#DC2626', // crimson
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#73D2DE', // cor atualizada
    'merge-pdf': '#FFAAA5', // âmber
    'reduce-pdf': '#BA0012', // rosa escuro (era do png-jpg) FF5400
    'reduce-jpg': '#5F6B6D', // rosa para reduzir JPG
    'reduce-png': '#9D0C3F', // roxo para reduzir PNG 7C3AED EC5656 B6B0FF
    // Novas conversões
    'svg-png': '#DCEDC1', // verde esmeralda F4F4F9
    'jpg-webp': '#FD625E', // azul C36F09
    'svg-jpg': '#FF0054', // vermelho
    'html-pdf': '#998785', // roxo F7C59F
    'csv-json': '#F2C80F', // dourado
    'csv-excel': '#059669' // verde escuro
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#E6D500', // amarelo claro hover
    'jpg-pdf': '#EA580C',
    'pdf-word': '#4F46E5', // índigo hover (era do split-pdf)
    'word-pdf': '#B91C1C',
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#3dd4aa', // hover para nova cor
    'merge-pdf': '#D97706',
    'reduce-pdf': '#c70e4f', // rosa escuro hover (era do png-jpg)
    'reduce-jpg': '#BE123C', // rosa hover para reduzir JPG
    'reduce-png': '#6D28D9', // roxo hover para reduzir PNG
    // Novas conversões hover
    'svg-png': '#059669', // verde esmeralda hover
    'jpg-webp': '#2563EB', // azul hover
    'svg-jpg': '#FFFFFF', // vermelho hover
    'html-pdf': '#7C3AED', // roxo hover
    'csv-json': '#D97706', // dourado hover
    'csv-excel': '#047857' // verde escuro hover
  };
  
  return colorMap[conversionType] || '#4B5563';
};
