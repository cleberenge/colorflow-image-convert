
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

    console.log(`Processing video: ${file.name}, type: ${conversionType}, size: ${file.size} bytes`);

    // Check file size limit (50MB for memory efficiency)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo permitido: 50MB');
    }

    // Create temporary files with unique names
    const timestamp = Date.now();
    const inputExtension = file.name.split('.').pop() || 'mp4';
    const tempInputPath = `/tmp/input_${timestamp}.${inputExtension}`;
    
    console.log(`Creating temporary input file: ${tempInputPath}`);
    const arrayBuffer = await file.arrayBuffer();
    await Deno.writeFile(tempInputPath, new Uint8Array(arrayBuffer));

    let command: Deno.Command;
    let outputPath: string;
    let outputMimeType: string;

    if (conversionType === 'video-mp3') {
      // Extract audio to MP3 with memory-optimized settings
      outputPath = `/tmp/output_${timestamp}.mp3`;
      outputMimeType = 'audio/mpeg';
      
      command = new Deno.Command("ffmpeg", {
        args: [
          "-i", tempInputPath,
          "-vn", // No video
          "-acodec", "libmp3lame",
          "-ab", "128k", // Reduced bitrate for memory efficiency
          "-ar", "44100",
          "-ac", "2", // Stereo
          "-map_metadata", "-1", // Remove metadata to save space
          "-y", // Overwrite output
          outputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });
    } else if (conversionType === 'compress-video') {
      // Compress video with memory-optimized settings
      const extension = file.name.split('.').pop();
      outputPath = `/tmp/compressed_${timestamp}.${extension}`;
      outputMimeType = file.type;
      
      command = new Deno.Command("ffmpeg", {
        args: [
          "-i", tempInputPath,
          "-vcodec", "libx264",
          "-crf", "28", // Higher CRF = more compression
          "-preset", "ultrafast", // Faster processing, less memory
          "-vf", "scale=iw*0.8:ih*0.8", // Reduce resolution by 20%
          "-acodec", "aac",
          "-ab", "96k", // Reduced audio bitrate
          "-map_metadata", "-1", // Remove metadata
          "-y",
          outputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });
    } else {
      throw new Error(`Unsupported conversion type: ${conversionType}`);
    }

    console.log('Starting FFmpeg processing with memory-optimized settings...');
    
    // Set resource limits for FFmpeg
    const process = command.spawn();
    
    // Set a timeout for the process (2 minutes max)
    const timeout = setTimeout(() => {
      try {
        process.kill("SIGTERM");
      } catch (e) {
        console.log('Could not kill process:', e);
      }
    }, 120000); // 2 minutes

    const output = await process.output();
    clearTimeout(timeout);

    // Clean up input file immediately
    try {
      await Deno.remove(tempInputPath);
      console.log('Input file cleaned up');
    } catch (e) {
      console.log('Could not remove temp input file:', e);
    }

    if (!process.success) {
      const error = new TextDecoder().decode(output.stderr);
      console.error('FFmpeg error:', error);
      
      // More specific error messages
      if (error.includes('No space left')) {
        throw new Error('Espaço insuficiente no servidor. Tente com um arquivo menor.');
      } else if (error.includes('memory')) {
        throw new Error('Arquivo muito complexo para processar. Tente com um arquivo menor ou de menor qualidade.');
      } else if (error.includes('Invalid data')) {
        throw new Error('Arquivo de vídeo corrompido ou formato inválido.');
      } else {
        throw new Error(`Erro no processamento do vídeo: ${error.substring(0, 200)}`);
      }
    }

    console.log('FFmpeg processing completed successfully');

    // Check if output file exists and has content
    let outputBuffer: Uint8Array;
    try {
      const stat = await Deno.stat(outputPath);
      if (stat.size === 0) {
        throw new Error('Arquivo de saída está vazio. Possível erro na conversão.');
      }
      outputBuffer = await Deno.readFile(outputPath);
      console.log(`Output file size: ${outputBuffer.length} bytes`);
    } catch (e) {
      console.error('Error reading output file:', e);
      throw new Error('Falha ao ler arquivo convertido.');
    }
    
    // Clean up output file
    try {
      await Deno.remove(outputPath);
      console.log('Output file cleaned up');
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

    console.log(`Video processing completed successfully: ${newFileName}`);

    return new Response(outputBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': outputMimeType,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
        'Content-Length': outputBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in video conversion:', error);
    
    // Clean up any remaining temp files
    try {
      const tempFiles = [];
      for await (const dirEntry of Deno.readDir('/tmp')) {
        if (dirEntry.name.startsWith('input_') || dirEntry.name.startsWith('output_') || dirEntry.name.startsWith('compressed_')) {
          tempFiles.push(`/tmp/${dirEntry.name}`);
        }
      }
      
      for (const tempFile of tempFiles) {
        try {
          await Deno.remove(tempFile);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
