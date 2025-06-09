
import mammoth from 'mammoth';
import jsPDF from 'jspdf';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting Word file: ${file.name} to PDF`);
    console.log(`File type: ${file.type}, File size: ${file.size} bytes`);
    
    // Verificar se é um arquivo Word válido
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('Arquivo deve ser um documento Word (.doc ou .docx)');
    }
    
    // Verificar tamanho do arquivo
    if (file.size === 0) {
      throw new Error('Arquivo está vazio');
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB
      throw new Error('Arquivo muito grande (máximo 50MB)');
    }
    
    console.log('Reading file as array buffer...');
    // Ler o arquivo Word usando mammoth
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
      console.log(`Array buffer size: ${arrayBuffer.byteLength} bytes`);
    } catch (error) {
      console.error('Error reading file as array buffer:', error);
      throw new Error('Erro ao ler o arquivo. Verifique se o arquivo não está corrompido.');
    }
    
    console.log('Extracting text with mammoth...');
    let result;
    try {
      result = await mammoth.extractRawText({ arrayBuffer });
      console.log('Mammoth extraction completed successfully');
    } catch (error) {
      console.error('Mammoth extraction error:', error);
      if (error instanceof Error) {
        if (error.message.includes('not a valid zip file') || error.message.includes('Invalid file format')) {
          throw new Error('Arquivo Word inválido ou corrompido. Apenas arquivos .docx são suportados.');
        }
        throw new Error(`Erro ao processar arquivo Word: ${error.message}`);
      }
      throw new Error('Erro desconhecido ao processar arquivo Word');
    }
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }
    
    const text = result.value;
    console.log(`Extracted text length: ${text.length} characters`);
    console.log('First 100 characters of text:', text.substring(0, 100));
    
    if (!text || text.trim().length === 0) {
      throw new Error('Não foi possível extrair texto do documento. O arquivo pode estar vazio ou corrompido.');
    }
    
    console.log('Creating PDF with jsPDF...');
    // Criar PDF usando jsPDF
    let pdf;
    try {
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      console.log('jsPDF instance created successfully');
    } catch (error) {
      console.error('Error creating jsPDF instance:', error);
      throw new Error('Erro ao inicializar gerador de PDF');
    }
    
    // Configurações de texto
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    const fontSize = 12;
    
    console.log(`PDF settings - Width: ${pageWidth}, Height: ${pageHeight}, Max line width: ${maxLineWidth}`);
    
    try {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      console.log('PDF font settings applied');
    } catch (error) {
      console.error('Error setting PDF font:', error);
      throw new Error('Erro ao configurar fonte do PDF');
    }
    
    console.log('Splitting text into lines...');
    // Dividir o texto em linhas que cabem na página
    let lines;
    try {
      lines = pdf.splitTextToSize(text, maxLineWidth);
      console.log(`Generated ${lines.length} lines`);
    } catch (error) {
      console.error('Error splitting text to lines:', error);
      throw new Error('Erro ao processar texto para PDF');
    }
    
    let currentY = margin;
    let pageNumber = 1;
    
    console.log('Adding text to PDF pages...');
    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Verificar se precisa de nova página
        if (currentY + lineHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
          pageNumber++;
          console.log(`Added page ${pageNumber}`);
        }
        
        // Adicionar linha ao PDF
        pdf.text(line, margin, currentY);
        currentY += lineHeight;
        
        // Log de progresso a cada 100 linhas
        if (i % 100 === 0) {
          console.log(`Processed ${i + 1}/${lines.length} lines`);
        }
      }
      console.log(`All ${lines.length} lines added to PDF`);
    } catch (error) {
      console.error('Error adding text to PDF:', error);
      throw new Error('Erro ao adicionar texto ao PDF');
    }
    
    console.log('Generating PDF blob...');
    // Gerar o blob do PDF
    let pdfBlob;
    try {
      pdfBlob = pdf.output('blob');
      console.log(`PDF blob size: ${pdfBlob.size} bytes`);
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw new Error('Erro ao finalizar PDF');
    }
    
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Verificar tipos específicos de erro
    if (error instanceof Error) {
      if (error.message.includes('Invalid file format')) {
        throw new Error(`Formato de arquivo inválido. Apenas arquivos .docx são suportados no momento.`);
      }
      if (error.message.includes('not a valid zip file')) {
        throw new Error(`Arquivo corrompido ou formato inválido. Verifique se o arquivo não está danificado.`);
      }
      throw new Error(`Falha na conversão: ${error.message}`);
    }
    
    throw new Error(`Falha na conversão do arquivo ${file.name}: Erro desconhecido`);
  }
};
