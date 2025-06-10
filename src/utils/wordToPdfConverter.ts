
import mammoth from 'mammoth';
import jsPDF from 'jspdf';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF using mammoth + jsPDF`);
    
    // Validate file type
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('Arquivo deve ser um documento Word (.doc ou .docx)');
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    console.log('Extracting text from Word document...');
    
    // Extract text from Word document using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    
    if (!text || text.trim().length === 0) {
      throw new Error('Não foi possível extrair texto do documento Word');
    }
    
    console.log('Text extracted successfully, creating PDF...');
    
    // Create PDF using jsPDF
    const pdf = new jsPDF();
    
    // Set font
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    // Split text into lines that fit the page width
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margins = 20;
    const maxLineWidth = pageWidth - (margins * 2);
    
    const lines = pdf.splitTextToSize(text, maxLineWidth);
    
    // Add text to PDF with pagination
    const lineHeight = 7;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxLinesPerPage = Math.floor((pageHeight - margins * 2) / lineHeight);
    
    let currentPage = 1;
    let currentLine = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (currentLine >= maxLinesPerPage) {
        pdf.addPage();
        currentPage++;
        currentLine = 0;
      }
      
      const yPosition = margins + (currentLine * lineHeight);
      pdf.text(lines[i], margins, yPosition);
      currentLine++;
    }
    
    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    
    // Create file
    const originalName = file.name.split('.')[0];
    const pdfFileName = `${originalName}.pdf`;
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName}`);
    
    return new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Falha na conversão do documento Word para PDF. Verifique se o arquivo não está corrompido.');
  }
};
