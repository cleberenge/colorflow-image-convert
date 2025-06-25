
export const getConversionColor = (conversionType: string): string => {
  const colors: Record<string, string> = {
    'png-jpg': '#3B82F6',
    'jpg-pdf': '#8B5CF6', 
    'split-pdf': '#47E5BC',
    'merge-pdf': '#F59E0B',
    'reduce-pdf': '#EF4444',
    'video-mp3': '#10B981'
  };
  
  return colors[conversionType] || '#6B7280';
};
