
import { PDFDocument } from 'pdf-lib';
import { ConvertedFile } from '@/types/fileConverter';

export interface SplitOptions {
  mode: 'single' | 'pages';
  pagesPerFile?: number;
}

export const splitPdf = async (
  file: File, 
  options: SplitOptions = { mode: 'single' }
): Promise<ConvertedFile[]> => {
  try {
    console.log('Iniciando divisão do PDF:', file.name);
    
    // Carregar o PDF original
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    console.log(`PDF carregado com ${pageCount} páginas`);
    
    if (pageCount <= 1) {
      throw new Error('O PDF deve ter mais de uma página para ser dividido');
    }
    
    const convertedFiles: ConvertedFile[] = [];
    const originalName = file.name.replace(/\.pdf$/i, '');
    
    if (options.mode === 'single') {
      // Dividir em páginas individuais
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        const newFile = new File([pdfBytes], `${originalName}_pagina_${i + 1}.pdf`, {
          type: 'application/pdf',
          lastModified: Date.now()
        });
        
        convertedFiles.push({ file: newFile, originalName: file.name });
        console.log(`Página ${i + 1} extraída`);
      }
    } else if (options.mode === 'pages' && options.pagesPerFile) {
      // Dividir por número de páginas
      const pagesPerFile = options.pagesPerFile;
      let fileIndex = 1;
      
      for (let startPage = 0; startPage < pageCount; startPage += pagesPerFile) {
        const endPage = Math.min(startPage + pagesPerFile - 1, pageCount - 1);
        const pagesToCopy = [];
        
        for (let page = startPage; page <= endPage; page++) {
          pagesToCopy.push(page);
        }
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
        
        copiedPages.forEach((page) => {
          newPdf.addPage(page);
        });
        
        const pdfBytes = await newPdf.save();
        const newFile = new File([pdfBytes], `${originalName}_parte_${fileIndex}.pdf`, {
          type: 'application/pdf',
          lastModified: Date.now()
        });
        
        convertedFiles.push({ file: newFile, originalName: file.name });
        console.log(`Parte ${fileIndex} criada (páginas ${startPage + 1}-${endPage + 1})`);
        fileIndex++;
      }
    }
    
    console.log(`Divisão concluída: ${convertedFiles.length} arquivos gerados`);
    return convertedFiles;
    
  } catch (error) {
    console.error('Erro ao dividir PDF:', error);
    throw new Error(`Erro ao dividir PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
