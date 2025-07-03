
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
    'reduce-pdf': '#BA0012', // rosa escuro (cor correta)
    'reduce-jpg': '#BA0012', // mesma cor do reduce-pdf para consistência
    'reduce-png': '#581845', // roxo para reduzir PNG
    // Novas conversões
    'svg-png': '#DCEDC1', // verde esmeralda
    'jpg-webp': '#FD625E', // azul
    'svg-jpg': '#FF0054', // vermelho
    'html-pdf': '#998785', // roxo
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
    'reduce-pdf': '#A00010', // rosa escuro hover (cor correta)
    'reduce-jpg': '#A00010', // mesma cor hover do reduce-pdf
    'reduce-png': '#4A1A35', // roxo hover para reduzir PNG
    // Novas conversões hover
    'svg-png': '#059669', // verde esmeralda hover
    'jpg-webp': '#E53E3E', // azul hover
    'svg-jpg': '#D53F8C', // vermelho hover
    'html-pdf': '#7C3AED', // roxo hover
    'csv-json': '#D97706', // dourado hover
    'csv-excel': '#047857' // verde escuro hover
  };
  
  return colorMap[conversionType] || '#4B5563';
};
