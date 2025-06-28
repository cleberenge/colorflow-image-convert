
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#FDEE00', // amarelo claro
    'jpg-pdf': '#F97316', // laranja  
    'pdf-word': '#6366F1', // índigo
    'word-pdf': '#DC2626', // crimson
    'compress-png': '#820263', // roxo escuro (era do video-mp3)
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#47E5BC', // cor atualizada
    'merge-pdf': '#F59E0B', // âmbar
    'reduce-pdf': '#D81159', // rosa escuro
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
    'pdf-word': '#4F46E5', // índigo hover
    'word-pdf': '#B91C1C',
    'compress-png': '#6e0254', // roxo escuro hover (era do video-mp3)
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#3dd4aa', // hover para nova cor
    'merge-pdf': '#D97706',
    'reduce-pdf': '#c70e4f', // rosa escuro hover
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
