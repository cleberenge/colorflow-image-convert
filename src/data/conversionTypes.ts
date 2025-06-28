
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
      pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF', es: 'Reducir PDF', 
      fr: 'Réduire PDF', de: 'PDF reduzieren', hi: 'PDF कम करें', ar: 'تقليل PDF', 
      ko: 'PDF 축소', ja: 'PDFを削減', ru: 'Уменьшить PDF'
    }, 
    from: 'PDF', to: 'PDF Comprimido', 
    icon: '📦' 
  },
  { 
    id: 'compress-png', 
    label: { 
      pt: 'Reduzir PNG', en: 'Reduce PNG', zh: '压缩PNG', es: 'Reducir PNG', 
      fr: 'Réduire PNG', de: 'PNG reduzieren', hi: 'PNG कम करें', ar: 'تقليل PNG', 
      ko: 'PNG 축소', ja: 'PNGを削減', ru: 'Уменьшить PNG'
    }, 
    from: 'PNG', to: 'PNG Comprimido', 
    icon: '🎵' 
  },
  // Novas conversões
  { 
    id: 'svg-png', 
    label: { 
      pt: 'SVG para PNG', en: 'SVG to PNG', zh: 'SVG转PNG', es: 'SVG a PNG', 
      fr: 'SVG vers PNG', de: 'SVG zu PNG', hi: 'SVG से PNG', ar: 'SVG إلى PNG', 
      ko: 'SVG를 PNG로', ja: 'SVGをPNGへ', ru: 'SVG в PNG'
    }, 
    from: 'SVG', to: 'PNG', 
    icon: '🎨' 
  },
  { 
    id: 'jpg-webp', 
    label: { 
      pt: 'JPG para WebP', en: 'JPG to WebP', zh: 'JPG转WebP', es: 'JPG a WebP', 
      fr: 'JPG vers WebP', de: 'JPG zu WebP', hi: 'JPG से WebP', ar: 'JPG إلى WebP', 
      ko: 'JPG를 WebP로', ja: 'JPGをWebPへ', ru: 'JPG в WebP'
    }, 
    from: 'JPG', to: 'WebP', 
    icon: '🌐' 
  },
  { 
    id: 'svg-jpg', 
    label: { 
      pt: 'SVG para JPG', en: 'SVG to JPG', zh: 'SVG转JPG', es: 'SVG a JPG', 
      fr: 'SVG vers JPG', de: 'SVG zu JPG', hi: 'SVG से JPG', ar: 'SVG إلى JPG', 
      ko: 'SVG를 JPG로', ja: 'SVGをJPGへ', ru: 'SVG в JPG'
    }, 
    from: 'SVG', to: 'JPG', 
    icon: '🖌️' 
  },
  { 
    id: 'html-pdf', 
    label: { 
      pt: 'HTML para PDF', en: 'HTML to PDF', zh: 'HTML转PDF', es: 'HTML a PDF', 
      fr: 'HTML vers PDF', de: 'HTML zu PDF', hi: 'HTML से PDF', ar: 'HTML إلى PDF', 
      ko: 'HTML을 PDF로', ja: 'HTMLをPDFへ', ru: 'HTML в PDF'
    }, 
    from: 'HTML', to: 'PDF', 
    icon: '🌍' 
  },
  { 
    id: 'csv-json', 
    label: { 
      pt: 'CSV para JSON', en: 'CSV to JSON', zh: 'CSV转JSON', es: 'CSV a JSON', 
      fr: 'CSV vers JSON', de: 'CSV zu JSON', hi: 'CSV से JSON', ar: 'CSV إلى JSON', 
      ko: 'CSV를 JSON으로', ja: 'CSVをJSONへ', ru: 'CSV в JSON'
    }, 
    from: 'CSV', to: 'JSON', 
    icon: '📊' 
  },
  { 
    id: 'csv-excel', 
    label: { 
      pt: 'CSV para Excel', en: 'CSV to Excel', zh: 'CSV转Excel', es: 'CSV a Excel', 
      fr: 'CSV vers Excel', de: 'CSV zu Excel', hi: 'CSV से Excel', ar: 'CSV إلى Excel', 
      ko: 'CSV를 Excel로', ja: 'CSVをExcelへ', ru: 'CSV в Excel'
    }, 
    from: 'CSV', to: 'Excel', 
    icon: '📈' 
  }
];

export const getOrderedConversions = () => {
  return [
    // Primeira linha (conversões existentes)
    conversionTypes[0], // PNG para JPG
    conversionTypes[1], // JPG para PDF  
    conversionTypes[2], // Dividir PDF
    conversionTypes[3], // Juntar PDF
    conversionTypes[4], // Reduzir PDF
    conversionTypes[5], // Reduzir PNG
    // Segunda linha (novas conversões)
    conversionTypes[6], // SVG para PNG
    conversionTypes[7], // JPG para WebP
    conversionTypes[8], // SVG para JPG
    conversionTypes[9], // HTML para PDF
    conversionTypes[10], // CSV para JSON
    conversionTypes[11]  // CSV para Excel
  ];
};
