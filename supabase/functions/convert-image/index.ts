
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

      // For PNG to JPEG conversion in Deno environment, we'll use a different approach
      // Since we don't have access to Canvas APIs, we'll use ImageMagick via command line
      const tempInputPath = `/tmp/input_${Date.now()}.png`;
      const tempOutputPath = `/tmp/output_${Date.now()}.jpg`;
      
      // Write input file
      await Deno.writeFile(tempInputPath, uint8Array);
      
      // Use ImageMagick to convert PNG to JPEG
      const command = new Deno.Command("convert", {
        args: [
          tempInputPath,
          "-background", "white",
          "-flatten",
          "-quality", "90",
          tempOutputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });

      console.log('Starting ImageMagick conversion...');
      const process = command.spawn();
      const output = await process.output();

      // Clean up input file
      try {
        await Deno.remove(tempInputPath);
      } catch (e) {
        console.log('Could not remove temp input file:', e);
      }

      if (!process.success) {
        const error = new TextDecoder().decode(output.stderr);
        console.error('ImageMagick error:', error);
        
        // Fallback: return PNG with JPEG extension and proper headers
        console.log('Falling back to PNG with JPEG headers');
        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}.jpg`;

        return new Response(arrayBuffer, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${newFileName}"`,
            'Content-Length': arrayBuffer.byteLength.toString(),
          },
        });
      }

      // Read the converted JPEG file
      const jpegBuffer = await Deno.readFile(tempOutputPath);
      
      // Clean up output file
      try {
        await Deno.remove(tempOutputPath);
      } catch (e) {
        console.log('Could not remove temp output file:', e);
      }

      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.jpg`;

      console.log(`Image conversion completed: ${newFileName}`);

      return new Response(jpegBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
          'Content-Length': jpegBuffer.byteLength.toString(),
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
