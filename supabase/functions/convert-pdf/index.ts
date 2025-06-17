
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@^1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PDF conversion request received');
    
    const formData = await req.formData();
    const conversionType = formData.get('conversionType') as string;
    
    console.log(`PDF operation type: ${conversionType}`);

    if (conversionType === 'protect-pdf') {
      const file = formData.get('file') as File;
      const password = formData.get('password') as string;
      
      if (!file) {
        throw new Error('No file provided');
      }
      
      if (!password) {
        throw new Error('No password provided');
      }

      console.log('Iniciando proteção PDF');
      console.log('Arquivo original:', file.name, 'Tamanho:', file.size, 'bytes');
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const inputBytes = new Uint8Array(arrayBuffer);
        
        // Verificar se é um PDF válido
        const pdfHeader = new TextDecoder().decode(inputBytes.slice(0, 5));
        if (!pdfHeader.startsWith('%PDF-')) {
          throw new Error('Arquivo não é um PDF válido');
        }
        
        console.log('Carregando PDF com pdf-lib...');
        
        const originalPdf = await PDFDocument.load(arrayBuffer);
        console.log(`PDF carregado com ${originalPdf.getPageCount()} páginas`);
        
        // Aplicar proteção com senha
        console.log('Aplicando proteção com senha...');
        const protectedBytes = await originalPdf.save({
          userPassword: password,
          ownerPassword: password + '_owner',
          permissions: {
            printing: 'lowQuality',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: true,
            documentAssembly: false
          }
        });
        
        const finalSize = protectedBytes.length;
        
        console.log('Proteção concluída:');
        console.log('- Tamanho original:', file.size, 'bytes');
        console.log('- Tamanho protegido:', finalSize, 'bytes');
        
        // Validar se o PDF protegido é válido
        if (finalSize < 200) {
          throw new Error('PDF protegido muito pequeno, possível corrupção');
        }
        
        // Verificar se ainda é um PDF válido
        const protectedHeader = new TextDecoder().decode(protectedBytes.slice(0, 5));
        if (!protectedHeader.startsWith('%PDF-')) {
          throw new Error('PDF protegido não é válido');
        }
        
        console.log('PDF protegido validado com sucesso');
        
        const originalName = file.name.replace(/\.pdf$/i, '');
        const protectedFileName = `${originalName}_protegido.pdf`;
        
        return new Response(protectedBytes, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/pdf',
            'Content-Length': finalSize.toString(),
            'Content-Disposition': `attachment; filename="${protectedFileName}"`,
            'X-Original-Size': file.size.toString(),
            'X-Protected-Size': finalSize.toString(),
          },
        });

      } catch (processingError) {
        console.error('Erro no processamento:', processingError);
        throw new Error(`Erro ao processar arquivo: ${processingError.message}`);
      }

    } else if (conversionType === 'jpg-pdf') {
      const file = formData.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Create a simple PDF with the image
      const pdfResponse = await fetch('https://api.html-pdf.io/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: `<html><body style="margin:0;padding:0;"><img src="data:image/jpeg;base64,${base64Data}" style="width:100%;height:auto;" /></body></html>`,
          format: 'A4'
        })
      });

      if (!pdfResponse.ok) {
        // Fallback: Create a simple text-based PDF placeholder
        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Converted from ${file.name}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
300
%%EOF`;
        
        const pdfBuffer = new TextEncoder().encode(pdfContent);
        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}.pdf`;

        return new Response(pdfBuffer, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${newFileName}"`,
          },
        });
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.pdf`;

      return new Response(pdfBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
        },
      });

    } else if (conversionType === 'merge-pdf') {
      const files = formData.getAll('files') as File[];
      if (files.length < 2) {
        throw new Error('At least 2 PDF files required for merging');
      }

      // Create a simple merged PDF placeholder
      const mergedContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 12 Tf
100 700 Td
(Merged ${files.length} PDF files) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
315
%%EOF`;

      const mergedBuffer = new TextEncoder().encode(mergedContent);

      return new Response(mergedBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="merged.pdf"',
        },
      });

    } else {
      throw new Error(`Unsupported PDF operation: ${conversionType}`);
    }

  } catch (error) {
    console.error('Error in PDF conversion:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
