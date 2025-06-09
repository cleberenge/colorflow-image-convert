
import mammoth from 'mammoth';
import jsPDF from 'jspdf';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting Word file: ${file.name} to PDF`);
    
    // Ler o arquivo Word usando mammoth
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }
    
    const text = result.value;
    console.log(`Extracted text length: ${text.length} characters`);
    
    // Criar PDF usando jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Configurações de texto
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    const fontSize = 12;
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    
    // Dividir o texto em linhas que cabem na página
    const lines = pdf.splitTextToSize(text, maxLineWidth);
    
    let currentY = margin;
    let pageNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Verificar se precisa de nova página
      if (currentY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        pageNumber++;
      }
      
      // Adicionar linha ao PDF
      pdf.text(line, margin, currentY);
      currentY += lineHeight;
    }
    
    // Gerar o blob do PDF
    const pdfBlob = pdf.output('blob');
    
    // Criar nome do arquivo
    const originalName = file.name.replace(/\.(docx?|doc)$/i, '');
    const pdfFileName = `${originalName}.pdf`;
    
    // Criar arquivo PDF
    const pdfFile = new File([pdfBlob], pdfFileName, {
      type: 'application/pdf'
    });
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName}`);
    console.log(`PDF size: ${(pdfFile.size / 1024).toFixed(2)} KB`);
    
    return pdfFile;
    
  } catch (error) {
    console.error(`Error converting Word file ${file.name}:`, error);
    throw new Error(`Falha na conversão do arquivo ${file.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
