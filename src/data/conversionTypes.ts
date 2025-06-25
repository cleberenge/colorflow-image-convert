
import { ConversionType } from '@/types/fileConverter';

export const conversionTypes = [
  { 
    id: 'png-jpg', 
    label: { 
      pt: 'PNG para JPG', en: 'PNG to JPG', zh: 'PNG转JPG', es: 'PNG a JPG', 
      fr: 'PNG vers JPG', de: 'PNG zu JPG', hi: 'PNG से JPG', ar: 'PNG إلى JPG', 
      ko: 'PNG를 JPG로', ja: 'PNGをJPGへ', ru: 'PNG в JPG'
    }, 
    from: 'PNG', to: 'JPG', 
    icon: '🖼️' 
  },
  { 
    id: 'jpg-pdf', 
    label: { 
      pt: 'JPG para PDF', en: 'JPG to PDF', zh: 'JPG转PDF', es: 'JPG a PDF', 
      fr: 'JPG vers PDF', de: 'JPG zu PDF', hi: 'JPG से PDF', ar: 'JPG إلى PDF', 
      ko: 'JPG를 PDF로', ja: 'JPGをPDFへ', ru: 'JPG в PDF'
    }, 
    from: 'JPG', to: 'PDF', 
    icon: '📸' 
  },
  { 
    id: 'split-pdf', 
    label: { 
      pt: 'Dividir PDF', en: 'Split PDF', zh: '分割PDF', es: 'Dividir PDF', 
      fr: 'Diviser PDF', de: 'PDF teilen', hi: 'PDF विभाजित करें', ar: 'تقسيم PDF', 
      ko: 'PDF 분할', ja: 'PDFを分割', ru: 'Разделить PDF'
    }, 
    from: 'PDF', to: 'PDFs Separados', 
    icon: '✂️',
    color: '#47E5BC'
  },
  { 
    id: 'merge-pdf', 
    label: { 
      pt: 'Juntar PDF', en: 'Merge PDF', zh: '合并PDF', es: 'Unir PDF', 
      fr: 'Fusionner PDF', de: 'PDF zusammenführen', hi: 'PDF मिलाएं', ar: 'دمج PDF', 
      ko: 'PDF 병합', ja: 'PDFを結合', ru: 'Объединить PDF'
    }, 
    from: 'PDFs', to: 'PDF Único', 
    icon: '🔗' 
  },
  { 
    id: 'reduce-pdf', 
    label: { 
      pt: 'Reduzir JPG', en: 'Reduce JPG', zh: '压缩JPG', es: 'Reducir JPG', 
      fr: 'Réduire JPG', de: 'JPG reduzieren', hi: 'JPG कम करें', ar: 'تقليل JPG', 
      ko: 'JPG 축소', ja: 'JPGを削減', ru: 'Уменьшить JPG'
    }, 
    from: 'JPG', to: 'JPG Comprimido', 
    icon: '📦' 
  },
  { 
    id: 'video-mp3', 
    label: { 
      pt: 'Reduzir PNG', en: 'Reduce PNG', zh: '压缩PNG', es: 'Reducir PNG', 
      fr: 'Réduire PNG', de: 'PNG reduzieren', hi: 'PNG कम करें', ar: 'تقليل PNG', 
      ko: 'PNG 축소', ja: 'PNGを削減', ru: 'Уменьшить PNG'
    }, 
    from: 'PNG', to: 'PNG Comprimido', 
    icon: '🎵' 
  }
];

export const getOrderedConversions = () => {
  return [
    conversionTypes[0], // PNG para JPG
    conversionTypes[1], // JPG para PDF  
    conversionTypes[2], // Dividir PDF
    conversionTypes[3], // Juntar PDF
    conversionTypes[4], // Reduzir JPG
    conversionTypes[5]  // Reduzir PNG
  ];
};
