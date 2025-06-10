
import { PDFDocument } from 'pdf-lib';
import { ConvertedFile } from '@/types/fileConverter';

export const mergePdfs = async (files: File[]): Promise<ConvertedFile[]> => {
  try {
    console.log('Iniciando mesclagem de PDFs:', files.map(f => f.name));
    
    if (files.length < 2) {
      throw new Error('São necessários pelo menos 2 arquivos PDF para mesclagem');
    }
    
    // Criar novo documento PDF
    const mergedPdf = await PDFDocument.create();
    
    // Processar cada arquivo PDF
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processando arquivo ${i + 1}/${files.length}: ${file.name}`);
      
      try {
        // Verificar se é um PDF válido
        if (!file.type.includes('pdf')) {
          console.warn(`Arquivo ${file.name} não é um PDF válido, pulando...`);
          continue;
        }
        
        // Carregar o PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        console.log(`PDF ${file.name} carregado com ${pageCount} páginas`);
        
        // Copiar todas as páginas do PDF atual
        const pageIndices = Array.from({ length: pageCount }, (_, index) => index);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
        
        // Adicionar páginas ao documento mesclado
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        console.log(`Páginas do ${file.name} adicionadas com sucesso`);
        
      } catch (fileError) {
        console.error(`Erro ao processar ${file.name}:`, fileError);
        throw new Error(`Erro ao processar ${file.name}: ${fileError instanceof Error ? fileError.message : 'Erro desconhecido'}`);
      }
    }
    
    // Gerar o PDF mesclado
    console.log('Gerando PDF mesclado...');
    const pdfBytes = await mergedPdf.save();
    
    // Criar nome do arquivo mesclado
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const mergedFileName = `merged_pdf_${timestamp}.pdf`;
    
    // Criar arquivo mesclado
    const mergedFile = new File([pdfBytes], mergedFileName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
    
    console.log(`PDF mesclado criado: ${mergedFileName}, Tamanho: ${mergedFile.size} bytes`);
    
    return [{
      file: mergedFile,
      originalName: `${files.length}_files_merged`
    }];
    
  } catch (error) {
    console.error('Erro ao mesclar PDFs:', error);
    throw new Error(`Erro ao mesclar PDFs: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
