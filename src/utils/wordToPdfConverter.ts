
export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF using external service`);
    
    // Validate file type
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('Arquivo deve ser um documento Word (.doc ou .docx)');
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    console.log('Converting using ConvertAPI free service...');

    // Use ConvertAPI free service (no API key required for basic usage)
    const conversionFormData = new FormData();
    conversionFormData.append('File', new Blob([arrayBuffer], { type: file.type }), file.name);
    conversionFormData.append('StoreFile', 'true');

    let pdfBuffer: ArrayBuffer;

    try {
      const response = await fetch('https://v2.convertapi.com/convert/docx/to/pdf', {
        method: 'POST',
        body: conversionFormData,
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.Files && result.Files.length > 0) {
          const pdfUrl = result.Files[0].Url;
          const pdfResponse = await fetch(pdfUrl);
          pdfBuffer = await pdfResponse.arrayBuffer();
        } else {
          throw new Error('ConvertAPI response invalid');
        }
      } else {
        throw new Error('ConvertAPI failed');
      }
    } catch (error) {
      console.log('ConvertAPI failed, trying ILovePDF...');
      
      // Fallback to ILovePDF free API
      const ilovePdfData = new FormData();
      ilovePdfData.append('task', 'office_pdf');
      ilovePdfData.append('file', new Blob([arrayBuffer], { type: file.type }), file.name);

      try {
        const ilovePdfResponse = await fetch('https://api.ilovepdf.com/v1/process', {
          method: 'POST',
          body: ilovePdfData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (ilovePdfResponse.ok) {
          const ilovePdfResult = await ilovePdfResponse.json();
          
          if (ilovePdfResult.download_url) {
            const pdfResponse = await fetch(ilovePdfResult.download_url);
            pdfBuffer = await pdfResponse.arrayBuffer();
          } else {
            throw new Error('ILovePDF response invalid');
          }
        } else {
          throw new Error('ILovePDF failed');
        }
      } catch (ilovePdfError) {
        console.log('ILovePDF failed, trying PDF24...');
        
        // Final fallback - PDF24 free service
        const pdf24Data = new FormData();
        pdf24Data.append('file', new Blob([arrayBuffer], { type: file.type }), file.name);
        
        const pdf24Response = await fetch('https://tools.pdf24.org/api/convert/office-to-pdf', {
          method: 'POST',
          body: pdf24Data,
        });

        if (!pdf24Response.ok) {
          throw new Error('Todos os serviços de conversão estão temporariamente indisponíveis. Tente novamente em alguns minutos.');
        }

        pdfBuffer = await pdf24Response.arrayBuffer();
      }
    }
    
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
