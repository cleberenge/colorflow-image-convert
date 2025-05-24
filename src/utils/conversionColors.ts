
export const getConversionColor = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#8B5CF6', // roxo
    'jpg-pdf': '#F97316', // laranja
    'pdf-word': '#3B82F6', // azul
    'word-pdf': '#DC2626', // crimson
    'video-mp3': '#10B981', // verde
    'compress-video': '#EC4899', // rosa
    'split-pdf': '#6366F1', // índigo
    'merge-pdf': '#F59E0B', // âmbar
    'reduce-pdf': '#84CC16' // lima
  };
  
  return colorMap[conversionType] || '#6B7280';
};

export const getConversionColorHover = (conversionType: string) => {
  const colorMap: Record<string, string> = {
    'png-jpg': '#7C3AED',
    'jpg-pdf': '#EA580C',
    'pdf-word': '#2563EB',
    'word-pdf': '#B91C1C',
    'video-mp3': '#059669',
    'compress-video': '#DB2777',
    'split-pdf': '#4F46E5',
    'merge-pdf': '#D97706',
    'reduce-pdf': '#65A30D'
  };
  
  return colorMap[conversionType] || '#4B5563';
};
