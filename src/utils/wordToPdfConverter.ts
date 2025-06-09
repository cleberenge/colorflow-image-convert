
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
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
      console.log(`Array buffer size: ${arrayBuffer.byteLength} bytes`);
    } catch (error) {
      console.error('Error reading file as array buffer:', error);
      throw new Error('Erro ao ler o arquivo. Verifique se o arquivo não está corrompido.');
    }
    
    console.log('Extracting HTML with mammoth...');
    let result;
    try {
      // Usar extractRawText para ter melhor controle sobre a formatação
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
    
    if (!text || text.trim().length === 0) {
      throw new Error('Não foi possível extrair texto do documento. O arquivo pode estar vazio ou corrompido.');
    }
    
    console.log('Creating PDF with jsPDF...');
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
    
    // Configurações de texto melhoradas
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    const lineHeight = 6;
    const paragraphSpacing = 12;
    const fontSize = 11;
    
    console.log(`PDF settings - Width: ${pageWidth}, Height: ${pageHeight}, Max line width: ${maxLineWidth}`);
    
    try {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      console.log('PDF font settings applied');
    } catch (error) {
      console.error('Error setting PDF font:', error);
      throw new Error('Erro ao configurar fonte do PDF');
    }
    
    console.log('Processing text for better formatting...');
    
    // Processar o texto para melhor formatação
    // Dividir por parágrafos (quebras de linha duplas ou simples)
    const paragraphs = text
      .split(/\n\s*\n|\r\n\s*\r\n/) // Quebras duplas
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    // Se não há quebras duplas, usar quebras simples
    const finalParagraphs = paragraphs.length > 1 ? paragraphs : 
      text.split(/\n|\r\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
    
    console.log(`Found ${finalParagraphs.length} paragraphs`);
    
    let currentY = margin;
    let pageNumber = 1;
    
    console.log('Adding formatted text to PDF...');
    try {
      for (let i = 0; i < finalParagraphs.length; i++) {
        const paragraph = finalParagraphs[i];
        
        // Pular parágrafos vazios
        if (!paragraph.trim()) continue;
        
        // Dividir o parágrafo em linhas que cabem na página
        const lines = pdf.splitTextToSize(paragraph, maxLineWidth);
        
        // Verificar se o parágrafo cabe na página atual
        const paragraphHeight = lines.length * lineHeight + (i > 0 ? paragraphSpacing : 0);
        
        if (currentY + paragraphHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
          pageNumber++;
          console.log(`Added page ${pageNumber}`);
        } else if (i > 0) {
          // Adicionar espaçamento entre parágrafos
          currentY += paragraphSpacing;
        }
        
        // Adicionar as linhas do parágrafo
        for (const line of lines) {
          if (currentY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
            pageNumber++;
            console.log(`Added page ${pageNumber}`);
          }
          
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        }
        
        // Log de progresso
        if (i % 10 === 0) {
          console.log(`Processed ${i + 1}/${finalParagraphs.length} paragraphs`);
        }
      }
      
      console.log(`All ${finalParagraphs.length} paragraphs added to PDF`);
    } catch (error) {
      console.error('Error adding text to PDF:', error);
      throw new Error('Erro ao adicionar texto ao PDF');
    }
    
    console.log('Generating PDF blob...');
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
