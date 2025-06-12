
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#FDEE00', // amarelo claro (mantido)
    'jpg-pdf': '#FC913A', // laranja (alterado)
    'pdf-word': '#6366F1', // índigo
    'word-pdf': '#DC2626', // crimson
    'video-mp3': '#820263', // roxo escuro
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#EB8291', // rosa (alterado)
    'merge-pdf': '#7BC7DD', // azul claro (alterado)
    'reduce-pdf': '#FF0F80' // rosa forte (alterado)
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#E6D500', // amarelo claro hover
    'jpg-pdf': '#E8822B', // laranja hover (alterado)
    'pdf-word': '#4F46E5', // índigo hover
    'word-pdf': '#B91C1C', // crimson hover
    'video-mp3': '#6e0254', // roxo escuro hover
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#D97082', // rosa hover (alterado)
    'merge-pdf': '#6BB3CE', // azul claro hover (alterado)
    'reduce-pdf': '#E60E71' // rosa forte hover (alterado)
  };
  
  return colorMap[conversionType] || '#4B5563';
};
