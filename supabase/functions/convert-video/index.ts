
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para converter usando ConvertAPI
async function convertWithConvertAPI(fileBuffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const apiKey = Deno.env.get('CONVERTAPI_SECRET');
  if (!apiKey) {
    throw new Error('ConvertAPI secret not configured');
  }

  console.log('Starting ConvertAPI video to MP3 conversion...');

  const formData = new FormData();
  formData.append('Parameters[File]', new Blob([fileBuffer]), fileName);
  formData.append('Parameters[AudioBitrate]', '128');
  formData.append('Parameters[AudioSampleRate]', '44100');

  const response = await fetch(`https://v2.convertapi.com/convert/mp4/to/mp3?Secret=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ConvertAPI failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.Files || result.Files.length === 0) {
    throw new Error('ConvertAPI: No files returned');
  }

  const downloadResponse = await fetch(result.Files[0].Url);
  if (!downloadResponse.ok) {
    throw new Error(`ConvertAPI download failed: ${downloadResponse.statusText}`);
  }

  return await downloadResponse.arrayBuffer();
}

// Função para converter usando CloudConvert
async function convertWithCloudConvert(fileBuffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const apiKey = Deno.env.get('CLOUDCONVERT_API_KEY');
  if (!apiKey) {
    throw new Error('CloudConvert API key not configured');
  }

  console.log('Starting CloudConvert video to MP3 conversion...');
  
  // Criar job de conversão
  const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tasks: {
        'import-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          output_format: 'mp3',
          engine: 'ffmpeg',
          audio_bitrate: 128,
          audio_frequency: 44100
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    })
  });

  if (!jobResponse.ok) {
    throw new Error(`CloudConvert job creation failed: ${jobResponse.statusText}`);
  }

  const jobData = await jobResponse.json();
  const uploadTask = jobData.data.tasks.find((t: any) => t.name === 'import-file');
  
  // Upload do arquivo
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), fileName);
  
  const uploadResponse = await fetch(uploadTask.result.form.url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`CloudConvert upload failed: ${uploadResponse.statusText}`);
  }

  // Aguardar conclusão do job
  let jobStatus = 'waiting';
  let attempts = 0;
  const maxAttempts = 30;

  while (jobStatus !== 'finished' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobData.data.id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`CloudConvert status check failed: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    jobStatus = statusData.data.status;
    attempts++;

    if (jobStatus === 'error') {
      throw new Error('CloudConvert conversion failed');
    }
  }

  if (jobStatus !== 'finished') {
    throw new Error('CloudConvert conversion timeout');
  }

  // Baixar o arquivo convertido
  const finalJobResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobData.data.id}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const finalJobData = await finalJobResponse.json();
  const exportTask = finalJobData.data.tasks.find((t: any) => t.name === 'export-file');
  
  const downloadResponse = await fetch(exportTask.result.files[0].url);
  if (!downloadResponse.ok) {
    throw new Error(`CloudConvert download failed: ${downloadResponse.statusText}`);
  }

  return await downloadResponse.arrayBuffer();
}

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
      console.log('Converting video to MP3 using external services...');
      
      const fileBuffer = await file.arrayBuffer();
      let mp3Buffer: ArrayBuffer | null = null;
      let lastError: Error | null = null;

      // Tentar ConvertAPI primeiro
      try {
        console.log('Attempting conversion with ConvertAPI...');
        mp3Buffer = await convertWithConvertAPI(fileBuffer, file.name);
        console.log('ConvertAPI conversion successful');
      } catch (error) {
        console.error('ConvertAPI failed:', error);
        lastError = error as Error;
      }

      // Se ConvertAPI falhar, tentar CloudConvert
      if (!mp3Buffer) {
        try {
          console.log('Attempting conversion with CloudConvert...');
          mp3Buffer = await convertWithCloudConvert(fileBuffer, file.name);
          console.log('CloudConvert conversion successful');
        } catch (error) {
          console.error('CloudConvert failed:', error);
          lastError = error as Error;
        }
      }

      if (!mp3Buffer) {
        throw new Error(`Falha na conversão do vídeo. Último erro: ${lastError?.message || 'Serviços de conversão não disponíveis'}`);
      }

      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.mp3`;
      
      console.log(`Video to MP3 conversion completed successfully: ${newFileName}`);
      
      return new Response(mp3Buffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
          'Content-Length': mp3Buffer.byteLength.toString(),
        },
      });
      
    } else if (conversionType === 'compress-video') {
      throw new Error('Compressão de vídeo não está disponível no momento. Use HandBrake ou similar para esta funcionalidade.');
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
