
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
    const arrayBuffer = await file.arrayBuffer();
    console.log(`Array buffer size: ${arrayBuffer.byteLength} bytes`);
    
    console.log('Extracting text with mammoth...');
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }
    
    const text = result.value;
    console.log(`Extracted text length: ${text.length} characters`);
    
    if (!text || text.trim().length === 0) {
      throw new Error('Não foi possível extrair texto do documento');
    }
    
    console.log('Creating PDF with jsPDF...');
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
    
    console.log('Splitting text into lines...');
    // Dividir o texto em linhas que cabem na página
    const lines = pdf.splitTextToSize(text, maxLineWidth);
    console.log(`Generated ${lines.length} lines`);
    
    let currentY = margin;
    let pageNumber = 1;
    
    console.log('Adding text to PDF pages...');
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
    }
    
    console.log('Generating PDF blob...');
    // Gerar o blob do PDF
    const pdfBlob = pdf.output('blob');
    console.log(`PDF blob size: ${pdfBlob.size} bytes`);
    
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
