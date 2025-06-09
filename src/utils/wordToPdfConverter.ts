import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF with better formatting preservation`);
    
    // Convert Word to HTML using mammoth with correct API
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    
    const html = result.value;
    console.log('Mammoth conversion completed, processing HTML...');
    
    // Create new PDF document using PDF-lib
    const pdfDoc = await PDFDocument.create();
    
    // Set up fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const margin = 50;
    const maxWidth = width - (margin * 2);
    let yPosition = height - margin;
    
    // Parse HTML and extract content with better formatting
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Function to add a new page when needed
    const checkAndAddNewPage = (requiredHeight: number) => {
      if (yPosition - requiredHeight < margin) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - margin;
      }
    };
    
    // Function to get appropriate font based on element
    const getFontForElement = (element: Element, isBold: boolean = false) => {
      const style = element.getAttribute('style') || '';
      const fontFamily = style.includes('font-family');
      
      if (fontFamily && style.includes('Times')) {
        return isBold ? timesBoldFont : timesFont;
      }
      return isBold ? helveticaBoldFont : helveticaFont;
    };
    
    // Function to get font size based on element
    const getFontSizeForElement = (element: Element): number => {
      const tagName = element.tagName;
      const style = element.getAttribute('style') || '';
      
      // Check for inline font-size
      const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
      if (fontSizeMatch) {
        return Math.min(parseInt(fontSizeMatch[1]), 24);
      }
      
      // Default sizes based on tag
      switch (tagName) {
        case 'H1': return 20;
        case 'H2': return 18;
        case 'H3': return 16;
        case 'H4': return 14;
        case 'H5': return 13;
        case 'H6': return 12;
        default: return 11;
      }
    };
    
    // Function to process text with better line breaking
    const addTextWithFormatting = (text: string, element: Element) => {
      if (!text.trim()) return;
      
      const isBold = element.tagName.match(/^H[1-6]$/) || 
                    element.querySelector('strong, b') || 
                    element.tagName === 'STRONG' || 
                    element.tagName === 'B';
      
      const font = getFontForElement(element, !!isBold);
      const fontSize = getFontSizeForElement(element);
      const lineHeight = fontSize * 1.4;
      
      // Better text wrapping
      const words = text.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            checkAndAddNewPage(lineHeight);
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0)
            });
            yPosition -= lineHeight;
          }
          currentLine = word;
        }
      }
      
      // Draw the last line
      if (currentLine) {
        checkAndAddNewPage(lineHeight);
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
        yPosition -= lineHeight;
      }
      
      // Add spacing after paragraphs
      if (element.tagName === 'P' || element.tagName.match(/^H[1-6]$/)) {
        yPosition -= fontSize * 0.5;
      }
    };
    
    // Process all elements recursively
    const processElement = (element: Element) => {
      // Handle different element types
      if (element.tagName === 'BR') {
        yPosition -= 14;
        return;
      }
      
      if (element.tagName === 'HR') {
        checkAndAddNewPage(10);
        page.drawLine({
          start: { x: margin, y: yPosition },
          end: { x: width - margin, y: yPosition },
          thickness: 1,
          color: rgb(0.5, 0.5, 0.5)
        });
        yPosition -= 20;
        return;
      }
      
      // Process text content
      const textContent = element.textContent?.trim();
      if (textContent && element.children.length === 0) {
        addTextWithFormatting(textContent, element);
        return;
      }
      
      // Process child elements
      for (const child of Array.from(element.children)) {
        processElement(child);
      }
    };
    
    // Process the document body
    console.log('Processing document elements...');
    for (const element of Array.from(doc.body.children)) {
      processElement(element);
    }
    
    // Generate PDF
    console.log('Generating PDF with PDF-lib...');
    const pdfBytes = await pdfDoc.save();
    
    // Create file
    const originalName = file.name.split('.')[0];
    const pdfFileName = `${originalName}.pdf`;
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName} with better formatting`);
    
    return new File([pdfBytes], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Falha na conversão do documento Word para PDF');
  }
};
