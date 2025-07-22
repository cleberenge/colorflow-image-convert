
import { ConversionType } from '@/types/fileConverter';

export const conversionTypes = [
  { 
    id: 'png-jpg', 
    label: { 
      pt: 'Converter PNG para JPG', en: 'Convert PNG to JPG', zh: '转换PNG到JPG', es: 'Convertir PNG a JPG', 
      fr: 'Convertir PNG vers JPG', de: 'PNG zu JPG konvertieren', hi: 'PNG को JPG में कन्वर्ट करें', ar: 'تحويل PNG إلى JPG', 
      ko: 'PNG를 JPG로 변환', ja: 'PNGをJPGに変換', ru: 'Конвертировать PNG в JPG'
    }, 
    from: 'PNG', to: 'JPG', 
    icon: '🖼️' 
  },
  { 
    id: 'jpg-pdf', 
    label: { 
      pt: 'Converter JPG para PDF', en: 'Convert JPG to PDF', zh: '转换JPG到PDF', es: 'Convertir JPG a PDF', 
      fr: 'Convertir JPG vers PDF', de: 'JPG zu PDF konvertieren', hi: 'JPG को PDF में कन्वर्ट करें', ar: 'تحويل JPG إلى PDF', 
      ko: 'JPG를 PDF로 변환', ja: 'JPGをPDFに変換', ru: 'Конвертировать JPG в PDF'
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
      pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF', es: 'Reducir PDF', 
      fr: 'Réduire PDF', de: 'PDF reduzieren', hi: 'PDF कम करें', ar: 'تقليل PDF', 
      ko: 'PDF 축소', ja: 'PDFを削減', ru: 'Уменьшить PDF'
    }, 
    from: 'PDF', to: 'PDF Comprimido', 
    icon: '📦' 
  },
  { 
    id: 'reduce-jpg', 
    label: { 
      pt: 'Reduzir JPG', en: 'Reduce JPG', zh: '压缩JPG', es: 'Reducir JPG', 
      fr: 'Réduire JPG', de: 'JPG reduzieren', hi: 'JPG कम करें', ar: 'تقليل JPG', 
      ko: 'JPG 축소', ja: 'JPGを削減', ru: 'Уменьшить JPG'
    }, 
    from: 'JPG', to: 'JPG Comprimido', 
    icon: '📦' 
  },
  { 
    id: 'reduce-png', 
    label: { 
      pt: 'Reduzir PNG', en: 'Reduce PNG', zh: '压缩PNG', es: 'Reducir PNG', 
      fr: 'Réduire PNG', de: 'PNG reduzieren', hi: 'PNG कम करें', ar: 'تقليل PNG', 
      ko: 'PNG 축소', ja: 'PNGを削減', ru: 'Уменьшить PNG'
    }, 
    from: 'PNG', to: 'PNG Comprimido', 
    icon: '📦' 
  },
  // Conversões com "Converter" no nome
  { 
    id: 'svg-png', 
    label: { 
      pt: 'Converter SVG para PNG', en: 'Convert SVG to PNG', zh: '转换SVG到PNG', es: 'Convertir SVG a PNG', 
      fr: 'Convertir SVG vers PNG', de: 'SVG zu PNG konvertieren', hi: 'SVG को PNG में कन्वर्ट करें', ar: 'تحويل SVG إلى PNG', 
      ko: 'SVG를 PNG로 변환', ja: 'SVGをPNGに変換', ru: 'Конвертировать SVG в PNG'
    }, 
    from: 'SVG', to: 'PNG', 
    icon: '🎨' 
  },
  { 
    id: 'jpg-webp', 
    label: { 
      pt: 'Converter JPG para WebP', en: 'Convert JPG to WebP', zh: '转换JPG到WebP', es: 'Convertir JPG a WebP', 
      fr: 'Convertir JPG vers WebP', de: 'JPG zu WebP konvertieren', hi: 'JPG को WebP में कन्वर्ट करें', ar: 'تحويل JPG إلى WebP', 
      ko: 'JPG를 WebP로 변환', ja: 'JPGをWebPに変換', ru: 'Конвертировать JPG в WebP'
    }, 
    from: 'JPG', to: 'WebP', 
    icon: '🌐' 
  },
  { 
    id: 'svg-jpg', 
    label: { 
      pt: 'Converter SVG para JPG', en: 'Convert SVG to JPG', zh: '转换SVG到JPG', es: 'Convertir SVG a JPG', 
      fr: 'Convertir SVG vers JPG', de: 'SVG zu JPG konvertieren', hi: 'SVG को JPG में कन्वर्ट करें', ar: 'تحويل SVG إلى JPG', 
      ko: 'SVG를 JPG로 변환', ja: 'SVGをJPGに変換', ru: 'Конвертировать SVG в JPG'
    }, 
    from: 'SVG', to: 'JPG', 
    icon: '🖌️' 
  },
  { 
    id: 'html-pdf', 
    label: { 
      pt: 'Converter HTML para PDF', en: 'Convert HTML to PDF', zh: '转换HTML到PDF', es: 'Convertir HTML a PDF', 
      fr: 'Convertir HTML vers PDF', de: 'HTML zu PDF konvertieren', hi: 'HTML को PDF में कन्वर्ट करें', ar: 'تحويل HTML إلى PDF', 
      ko: 'HTML을 PDF로 변환', ja: 'HTMLをPDFに変換', ru: 'Конвертировать HTML в PDF'
    }, 
    from: 'HTML', to: 'PDF', 
    icon: '🌍' 
  },
  { 
    id: 'csv-json', 
    label: { 
      pt: 'Converter CSV para JSON', en: 'Convert CSV to JSON', zh: '转换CSV到JSON', es: 'Convertir CSV a JSON', 
      fr: 'Convertir CSV vers JSON', de: 'CSV zu JSON konvertieren', hi: 'CSV को JSON में कन्वर्ट करें', ar: 'تحويل CSV إلى JSON', 
      ko: 'CSV를 JSON으로 변환', ja: 'CSVをJSONに変換', ru: 'Конвертировать CSV в JSON'
    }, 
    from: 'CSV', to: 'JSON', 
    icon: '📊' 
  },
  { 
    id: 'csv-excel', 
    label: { 
      pt: 'Converter CSV para Excel', en: 'Convert CSV to Excel', zh: '转换CSV到Excel', es: 'Convertir CSV a Excel', 
      fr: 'Convertir CSV vers Excel', de: 'CSV zu Excel konvertieren', hi: 'CSV को Excel में कन्वर्ट करें', ar: 'تحويل CSV إلى Excel', 
      ko: 'CSV를 Excel로 변환', ja: 'CSVをExcelに변환', ru: 'Конвертировать CSV в Excel'
    }, 
    from: 'CSV', to: 'Excel', 
    icon: '📈' 
  }
];

export const getOrderedConversions = () => {
  return [
    // Primeira linha (conversões principais)
    conversionTypes[0], // PNG para JPG
    conversionTypes[1], // JPG para PDF  
    conversionTypes[2], // Dividir PDF
    conversionTypes[3], // Juntar PDF
    conversionTypes[4], // Reduzir PDF
    conversionTypes[5], // Reduzir JPG
    // Segunda linha (conversões adicionais)
    conversionTypes[6], // Reduzir PNG
    conversionTypes[7], // SVG para PNG
    conversionTypes[8], // JPG para WebP
    conversionTypes[9], // SVG para JPG
    conversionTypes[10], // HTML para PDF
    conversionTypes[11]  // CSV para JSON
  ];
};
