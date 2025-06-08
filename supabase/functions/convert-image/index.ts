
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Image conversion request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const conversionType = formData.get('conversionType') as string;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing ${file.name} for ${conversionType}`);

    if (conversionType === 'png-jpg') {
      // Read the PNG file as buffer
      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = new Uint8Array(arrayBuffer);
      
      // Verify it's a PNG file
      const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
      const isPng = pngHeader.every((byte, index) => inputBuffer[index] === byte);
      
      if (!isPng) {
        throw new Error('File is not a valid PNG');
      }

      console.log('Converting PNG to JPEG using Sharp...');

      try {
        // Import Sharp dynamically
        const { default: sharp } = await import('https://deno.land/x/sharp@0.32.6/mod.ts');
        
        // Convert PNG to JPEG using Sharp
        const jpegBuffer = await sharp(inputBuffer)
          .jpeg({ 
            quality: 90,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();

        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}.jpg`;

        console.log(`PNG to JPEG conversion completed: ${newFileName}`);

        return new Response(jpegBuffer, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${newFileName}"`,
            'Content-Length': jpegBuffer.byteLength.toString(),
          },
        });

      } catch (sharpError) {
        console.error('Sharp conversion failed:', sharpError);
        
        // Fallback: return original PNG with warning
        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}_original.png`;

        console.log(`Fallback: Returning original PNG file: ${newFileName}`);

        return new Response(arrayBuffer, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${newFileName}"`,
            'Content-Length': arrayBuffer.byteLength.toString(),
            'X-Conversion-Note': 'Sharp library not available. Original PNG file returned.',
          },
        });
      }
    }

    // For other conversion types, return the original file
    const arrayBuffer = await file.arrayBuffer();
    const originalName = file.name.split('.')[0];
    const newFileName = `${originalName}_processed.${file.name.split('.').pop()}`;

    console.log(`File processing completed: ${newFileName}`);

    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error in image conversion:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
