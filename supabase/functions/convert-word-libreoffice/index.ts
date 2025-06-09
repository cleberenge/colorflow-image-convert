
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
    console.log('Starting LibreOffice Word to PDF conversion...');
    
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
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log('Converting using LibreOffice Online API...');

    // Use LibreOffice Online conversion service
    // This is a free service that converts documents while preserving formatting
    const conversionFormData = new FormData();
    conversionFormData.append('file', new Blob([uint8Array], { type: file.type }), file.name);
    conversionFormData.append('format', 'pdf');

    const response = await fetch('https://api.cloudconvert.com/v2/convert', {
      method: 'POST',
      body: conversionFormData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('LibreOffice conversion failed:', response.status, response.statusText);
      
      // Fallback to a simpler conversion service
      console.log('Trying alternative conversion service...');
      
      const alternativeResponse = await fetch('https://api.ilovepdf.com/v1/process', {
        method: 'POST',
        body: conversionFormData,
      });

      if (!alternativeResponse.ok) {
        throw new Error('Falha na conversão. Serviço temporariamente indisponível.');
      }

      const pdfBuffer = await alternativeResponse.arrayBuffer();
      
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
          ...corsHeaders,
        },
      });
    }

    const pdfBuffer = await response.arrayBuffer();
    
    console.log(`Conversion successful. PDF size: ${pdfBuffer.byteLength} bytes`);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in LibreOffice conversion:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido na conversão',
        details: 'Falha ao converter documento usando LibreOffice Online API'
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
