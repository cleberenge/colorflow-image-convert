
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF using mammoth + jsPDF`);
    
    // Convert Word to HTML using mammoth
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    
    // Create new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Parse HTML and add content to PDF
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pdf.internal.pageSize.width - (margin * 2);
    
    // Process each element in the HTML
    const elements = doc.body.children;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const text = element.textContent?.trim() || '';
      
      if (!text) continue;
      
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Set font style based on element type
      if (element.tagName === 'H1') {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
      } else if (element.tagName === 'H2') {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
      } else if (element.tagName === 'H3') {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
      } else if (element.querySelector('strong') || element.querySelector('b')) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
      }
      
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      // Add each line to the PDF
      for (const line of lines) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(line, margin, yPosition);
        yPosition += 7; // Line spacing
      }
      
      yPosition += 5; // Paragraph spacing
    }
    
    // Convert PDF to blob and create file
    const pdfBlob = pdf.output('blob');
    const originalName = file.name.split('.')[0];
    const pdfFileName = `${originalName}.pdf`;
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName}`);
    
    return new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Falha na conversão do documento Word para PDF');
  }
};
