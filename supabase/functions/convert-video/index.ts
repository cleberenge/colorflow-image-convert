
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

    // Check file size limit (25MB for Edge Runtime efficiency)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo permitido: 25MB para conversão de vídeo.');
    }

    if (conversionType === 'video-mp3') {
      // For video to MP3, we'll use a workaround by calling an external API
      // since Edge Runtime doesn't support FFmpeg
      
      console.log('Converting video to MP3 using external service...');
      
      // Create a FormData for the external API call
      const apiFormData = new FormData();
      apiFormData.append('file', file);
      apiFormData.append('format', 'mp3');
      
      // Use CloudConvert API (free tier available)
      const cloudConvertResponse = await fetch('https://api.cloudconvert.com/v2/convert', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + Deno.env.get('CLOUDCONVERT_API_KEY'),
        },
        body: apiFormData,
      });
      
      if (!cloudConvertResponse.ok) {
        // Fallback: Return error message explaining the limitation
        throw new Error('Conversão de vídeo para MP3 não está disponível no momento. O Supabase Edge Runtime não suporta processamento de vídeo com FFmpeg. Considere usar uma ferramenta de conversão local ou um serviço dedicado.');
      }
      
      const convertedBuffer = await cloudConvertResponse.arrayBuffer();
      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.mp3`;
      
      console.log(`Video conversion completed successfully: ${newFileName}`);
      
      return new Response(convertedBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
          'Content-Length': convertedBuffer.byteLength.toString(),
        },
      });
      
    } else if (conversionType === 'compress-video') {
      // For video compression, we also need external processing
      throw new Error('Compressão de vídeo não está disponível no Supabase Edge Runtime. Use uma ferramenta local ou serviço dedicado para esta funcionalidade.');
    } else {
      throw new Error(`Tipo de conversão não suportado: ${conversionType}`);
    }

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
