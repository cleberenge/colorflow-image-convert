
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#47E5BC', // amarelo claro (cor solicitada)
    'jpg-pdf': '#FDEE00', // laranja
    'pdf-word': '#6366F1', // índigo (era do split-pdf)
    'word-pdf': '#DC2626', // crimson
     //'video-mp3': '#820263', // roxo escuro (trocado com png-jpg)
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#73D2DE', // cor atualizada
    'merge-pdf': '#FFAAA5', // âmbar
    'reduce-pdf': '#784F41', // rosa escuro (era do png-jpg)
     // Novas conversões
    'svg-png': '#10B981', // verde esmeralda
    'jpg-webp': '#3B82F6', // azul
    'svg-jpg': '#EF4444', // vermelho
    'html-pdf': '#8B5CF6', // roxo
    'csv-json': '#F59E0B', // dourado
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
    'video-mp3': '#6e0254', // roxo escuro hover (trocado com png-jpg)
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#3dd4aa', // hover para nova cor
    'merge-pdf': '#D97706',
    'reduce-pdf': '#c70e4f', // rosa escuro hover (era do png-jpg)
    // Novas conversões hover
    'svg-png': '#059669', // verde esmeralda hover
    'jpg-webp': '#2563EB', // azul hover
    'svg-jpg': '#DC2626', // vermelho hover
    'html-pdf': '#7C3AED', // roxo hover
    'csv-json': '#D97706', // dourado hover
    'csv-excel': '#047857' // verde escuro hover
  };
  
  return colorMap[conversionType] || '#4B5563';
};
