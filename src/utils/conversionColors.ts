
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#820263', // roxo escuro (era do reduce-pdf)
    'jpg-pdf': '#F97316', // laranja
    'pdf-word': '#6366F1', // índigo (era do split-pdf)
    'word-pdf': '#DC2626', // crimson
    'video-mp3': '#10B981', // verde
    'compress-video': '#8B5CF6', // roxo
    'split-pdf': '#559cad', // azul claro (era do pdf-word)
    'merge-pdf': '#F59E0B', // âmbar
    'reduce-pdf': '#D81159' // rosa escuro (era do png-jpg)
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#6e0254', // roxo escuro hover (era do reduce-pdf)
    'jpg-pdf': '#EA580C',
    'pdf-word': '#4F46E5', // índigo hover (era do split-pdf)
    'word-pdf': '#B91C1C',
    'video-mp3': '#059669',
    'compress-video': '#7C3AED', // roxo hover
    'split-pdf': '#4a8a9b', // azul claro hover (era do pdf-word)
    'merge-pdf': '#D97706',
    'reduce-pdf': '#c70e4f' // rosa escuro hover (era do png-jpg)
  };
  
  return colorMap[conversionType] || '#4B5563';
};
