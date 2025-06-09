
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Word to PDF conversion...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

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

    const response = await fetch('https://v2.convertapi.com/convert/docx/to/pdf', {
      method: 'POST',
      body: conversionFormData,
    });

    if (!response.ok) {
      console.error('ConvertAPI conversion failed:', response.status, response.statusText);
      
      // Fallback to ILovePDF free API
      console.log('Trying ILovePDF free conversion...');
      
      const ilovePdfData = new FormData();
      ilovePdfData.append('task', 'office_pdf');
      ilovePdfData.append('file', new Blob([arrayBuffer], { type: file.type }), file.name);

      const ilovePdfResponse = await fetch('https://api.ilovepdf.com/v1/process', {
        method: 'POST',
        body: ilovePdfData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!ilovePdfResponse.ok) {
        console.error('ILovePDF conversion failed:', ilovePdfResponse.status);
        
        // Final fallback - use a different free service
        console.log('Trying PDF24 free conversion...');
        
        const pdf24Data = new FormData();
        pdf24Data.append('file', new Blob([arrayBuffer], { type: file.type }), file.name);
        
        const pdf24Response = await fetch('https://tools.pdf24.org/api/convert/office-to-pdf', {
          method: 'POST',
          body: pdf24Data,
        });

        if (!pdf24Response.ok) {
          throw new Error('Todos os serviços de conversão estão temporariamente indisponíveis. Tente novamente em alguns minutos.');
        }

        const pdfBuffer = await pdf24Response.arrayBuffer();
        
        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
            ...corsHeaders,
          },
        });
      }

      const ilovePdfResult = await ilovePdfResponse.json();
      
      if (ilovePdfResult.download_url) {
        const pdfResponse = await fetch(ilovePdfResult.download_url);
        const pdfBuffer = await pdfResponse.arrayBuffer();
        
        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
            ...corsHeaders,
          },
        });
      }
      
      throw new Error('Falha na conversão usando ILovePDF');
    }

    // Handle ConvertAPI response
    const result = await response.json();
    
    if (result.Files && result.Files.length > 0) {
      const pdfUrl = result.Files[0].Url;
      const pdfResponse = await fetch(pdfUrl);
      const pdfBuffer = await pdfResponse.arrayBuffer();
      
      console.log(`Conversion successful. PDF size: ${pdfBuffer.byteLength} bytes`);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
          ...corsHeaders,
        },
      });
    }

    throw new Error('Resposta inválida do serviço de conversão');

  } catch (error) {
    console.error('Error in Word to PDF conversion:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido na conversão',
        details: 'Falha ao converter documento Word para PDF'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
