
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
    console.log('Video conversion request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const conversionType = formData.get('conversionType') as string;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing video: ${file.name}, type: ${conversionType}`);

    // Create temporary files
    const tempInputPath = `/tmp/input_${Date.now()}.${file.name.split('.').pop()}`;
    const arrayBuffer = await file.arrayBuffer();
    await Deno.writeFile(tempInputPath, new Uint8Array(arrayBuffer));

    let command: Deno.Command;
    let outputPath: string;
    let outputMimeType: string;

    if (conversionType === 'video-mp3') {
      // Extract audio to MP3
      outputPath = `/tmp/output_${Date.now()}.mp3`;
      outputMimeType = 'audio/mpeg';
      
      command = new Deno.Command("ffmpeg", {
        args: [
          "-i", tempInputPath,
          "-vn", // No video
          "-acodec", "libmp3lame",
          "-ab", "192k",
          "-ar", "44100",
          "-y", // Overwrite output
          outputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });
    } else if (conversionType === 'compress-video') {
      // Compress video
      const extension = file.name.split('.').pop();
      outputPath = `/tmp/compressed_${Date.now()}.${extension}`;
      outputMimeType = file.type;
      
      command = new Deno.Command("ffmpeg", {
        args: [
          "-i", tempInputPath,
          "-vcodec", "libx264",
          "-crf", "28", // Higher CRF = more compression
          "-preset", "fast",
          "-y",
          outputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });
    } else {
      throw new Error(`Unsupported conversion type: ${conversionType}`);
    }

    console.log('Starting FFmpeg processing...');
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
      console.error('FFmpeg error:', error);
      throw new Error(`FFmpeg processing failed: ${error}`);
    }

    // Read the output file
    const outputBuffer = await Deno.readFile(outputPath);
    
    // Clean up output file
    try {
      await Deno.remove(outputPath);
    } catch (e) {
      console.log('Could not remove temp output file:', e);
    }

    // Generate filename
    const originalName = file.name.split('.')[0];
    let newFileName: string;
    
    if (conversionType === 'video-mp3') {
      newFileName = `${originalName}.mp3`;
    } else {
      const extension = file.name.split('.').pop();
      newFileName = `${originalName}_compressed.${extension}`;
    }

    console.log(`Video processing completed: ${newFileName}`);

    return new Response(outputBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': outputMimeType,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
      },
    });

  } catch (error) {
    console.error('Error in video conversion:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
