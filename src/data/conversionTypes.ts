
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
    icon: '✂️' 
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
      pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF', es: 'Reducir PDF', 
      fr: 'Réduire PDF', de: 'PDF reduzieren', hi: 'PDF कम करें', ar: 'تقليل PDF', 
      ko: 'PDF 축소', ja: 'PDFを削減', ru: 'Уменьшить PDF'
    }, 
    from: 'PDF', to: 'PDF Comprimido', 
    icon: '📦' 
  },
  { 
    id: 'video-mp3', 
    label: { 
      pt: 'MP4 para MP3', en: 'MP4 to MP3', zh: 'MP4转MP3', es: 'MP4 a MP3', 
      fr: 'MP4 vers MP3', de: 'MP4 zu MP3', hi: 'MP4 से MP3', ar: 'MP4 إلى MP3', 
      ko: 'MP4를 MP3로', ja: 'MP4をMP3へ', ru: 'MP4 в MP3'
    }, 
    from: 'MP4', to: 'MP3', 
    icon: '🎵' 
  }
];

export const getOrderedConversions = () => {
  return [
    conversionTypes[0], // PNG para JPG
    conversionTypes[1], // JPG para PDF  
    conversionTypes[2], // Dividir PDF
    conversionTypes[3], // Juntar PDF
    conversionTypes[4], // Reduzir PDF
    conversionTypes[5]  // MP4 para MP3
  ];
};
