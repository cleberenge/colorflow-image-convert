
import { PDFDocument } from 'pdf-lib';

export const protectPdfClientSide = async (
  file: File, 
  password: string,
  progressCallback?: (progress: number) => void
): Promise<File> => {
  try {
    console.log('[PDFProtector] Iniciando proteção de PDF:', file.name);
    
    if (progressCallback) progressCallback(10);
    
    const arrayBuffer = await file.arrayBuffer();
    
    if (progressCallback) progressCallback(25);
    
    // Carregar o PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    if (progressCallback) progressCallback(50);
    
    console.log('[PDFProtector] PDF carregado, aplicando proteção...');
    
    // Aplicar proteção com senha
    const protectedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password + '_owner',
      permissions: {
        printing: 'lowQuality',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false
      }
    });
    
    if (progressCallback) progressCallback(90);
    
    console.log('[PDFProtector] PDF protegido com sucesso');
    
    // Criar nome do arquivo protegido
    const originalName = file.name.replace(/\.pdf$/i, '');
    const protectedFileName = `${originalName}_protegido.pdf`;
    
    // Criar novo arquivo
    const protectedFile = new File([protectedPdfBytes], protectedFileName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
    
    if (progressCallback) progressCallback(100);
    
    console.log('[PDFProtector] Arquivo protegido criado:', protectedFileName);
    
    return protectedFile;
    
  } catch (error) {
    console.error('[PDFProtector] Erro ao proteger PDF:', error);
    throw new Error(`Erro ao proteger PDF: ${error.message}`);
  }
};
