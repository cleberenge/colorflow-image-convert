
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#8B5CF6', // roxo
    'jpg-pdf': '#F97316', // laranja
    'pdf-word': '#559cad', // azul claro
    'word-pdf': '#DC2626', // crimson
    'video-mp3': '#10B981', // verde
    'compress-video': '#D81159', // rosa escuro
    'split-pdf': '#6366F1', // índigo
    'merge-pdf': '#F59E0B', // âmbar
    'reduce-pdf': '#820263' // roxo escuro
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#7C3AED',
    'jpg-pdf': '#EA580C',
    'pdf-word': '#4a8a9b', // azul claro hover
    'word-pdf': '#B91C1C',
    'video-mp3': '#059669',
    'compress-video': '#c70e4f', // rosa escuro hover
    'split-pdf': '#4F46E5',
    'merge-pdf': '#D97706',
    'reduce-pdf': '#6e0254' // roxo escuro hover
  };
  
  return colorMap[conversionType] || '#4B5563';
};
