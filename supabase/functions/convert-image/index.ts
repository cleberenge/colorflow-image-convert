
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

    console.log(`Converting ${file.name} from ${conversionType}`);

    if (conversionType === 'png-jpg') {
      // Read the PNG file
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Verify it's a PNG file
      const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
      const isPng = pngHeader.every((byte, index) => uint8Array[index] === byte);
      
      if (!isPng) {
        throw new Error('File is not a valid PNG');
      }

      // Convert PNG to JPEG using Canvas API
      // Create a canvas element
      const canvas = new OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Create an image from the PNG data
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      const imageBitmap = await createImageBitmap(blob);
      
      // Set canvas size to match image
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      
      // Draw the image on canvas with white background (JPEG doesn't support transparency)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageBitmap, 0, 0);
      
      // Convert to JPEG
      const jpegBlob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: 0.9
      });
      
      const jpegArrayBuffer = await jpegBlob.arrayBuffer();
      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.jpg`;

      console.log(`Image conversion completed: ${newFileName}`);

      return new Response(jpegArrayBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
          'Content-Length': jpegArrayBuffer.byteLength.toString(),
        },
      });
    }

    // For other conversion types, return the original file
    const arrayBuffer = await file.arrayBuffer();
    const originalName = file.name.split('.')[0];
    const outputFormat = conversionType === 'png-jpg' ? 'jpg' : 'png';
    const mimeType = conversionType === 'png-jpg' ? 'image/jpeg' : file.type;
    const newFileName = `${originalName}.${outputFormat}`;

    console.log(`Image processing completed: ${newFileName}`);

    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': mimeType,
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
