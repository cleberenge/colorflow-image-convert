
export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF using Supabase edge function`);
    
    // Validate file type
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('Arquivo deve ser um documento Word (.doc ou .docx)');
    }

    // Create FormData for the edge function
    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending file to convert-word-libreoffice edge function...');

    // Call our Supabase edge function
    const response = await fetch('/api/convert-word-libreoffice', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function failed:', response.status, errorText);
      throw new Error('Falha na conversão do documento Word para PDF. Tente novamente.');
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer();
    
    // Create file
    const originalName = file.name.split('.')[0];
    const pdfFileName = `${originalName}.pdf`;
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName}`);
    
    return new File([pdfBuffer], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Falha na conversão do documento Word para PDF. Tente novamente ou use um serviço online.');
  }
};
