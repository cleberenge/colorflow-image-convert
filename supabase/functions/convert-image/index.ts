
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

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let outputFormat: string;
    let mimeType: string;
    
    if (conversionType === 'png-jpg') {
      outputFormat = 'jpeg';
      mimeType = 'image/jpeg';
    } else {
      outputFormat = 'png';
      mimeType = 'image/png';
    }

    // Using Sharp for image processing
    const sharpCommand = new Deno.Command("deno", {
      args: [
        "eval",
        `
        import Sharp from 'npm:sharp@0.32.6';
        
        const inputBuffer = new Uint8Array([${uint8Array.join(',')}]);
        
        let pipeline = Sharp(inputBuffer);
        
        if ('${outputFormat}' === 'jpeg') {
          pipeline = pipeline.jpeg({ quality: 95 });
        } else {
          pipeline = pipeline.png();
        }
        
        const outputBuffer = await pipeline.toBuffer();
        await Deno.stdout.write(outputBuffer);
        `
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const process = command.spawn();
    const output = await process.output();

    if (!process.success) {
      const error = new TextDecoder().decode(output.stderr);
      throw new Error(`Sharp conversion failed: ${error}`);
    }

    const convertedBuffer = output.stdout;
    
    // Generate filename
    const originalName = file.name.split('.')[0];
    const newFileName = `${originalName}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;

    console.log(`Image conversion completed: ${newFileName}`);

    return new Response(convertedBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
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
