
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CloudConvert API para conversão Word para PDF
async function convertWithCloudConvert(fileBuffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const apiKey = Deno.env.get('CLOUDCONVERT_API_KEY');
  if (!apiKey) {
    throw new Error('CloudConvert API key not configured');
  }

  console.log('Starting CloudConvert conversion...');
  
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
          output_format: 'pdf',
          some_other_option: 'value'
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
  const maxAttempts = 30; // 30 tentativas (5 minutos máximo)

  while (jobStatus !== 'finished' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Aguardar 10 segundos
    
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

// ConvertAPI como fallback
async function convertWithConvertAPI(fileBuffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const apiKey = Deno.env.get('CONVERTAPI_SECRET');
  if (!apiKey) {
    throw new Error('ConvertAPI secret not configured');
  }

  console.log('Starting ConvertAPI conversion...');

  const formData = new FormData();
  formData.append('Parameters[File]', new Blob([fileBuffer]), fileName);
  formData.append('Parameters[PdfVersion]', '1.7');
  formData.append('Parameters[PdfResolution]', '150');

  const response = await fetch(`https://v2.convertapi.com/convert/docx/to/pdf?Secret=${apiKey}`, {
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

  // Baixar o arquivo convertido
  const downloadResponse = await fetch(result.Files[0].Url);
  if (!downloadResponse.ok) {
    throw new Error(`ConvertAPI download failed: ${downloadResponse.statusText}`);
  }

  return await downloadResponse.arrayBuffer();
}

// Zamzar como segundo fallback
async function convertWithZamzar(fileBuffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const apiKey = Deno.env.get('ZAMZAR_API_KEY');
  if (!apiKey) {
    throw new Error('Zamzar API key not configured');
  }

  console.log('Starting Zamzar conversion...');

  // Upload do arquivo
  const formData = new FormData();
  formData.append('source_file', new Blob([fileBuffer]), fileName);
  formData.append('target_format', 'pdf');

  const uploadResponse = await fetch('https://sandbox-api.zamzar.com/v1/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Zamzar upload failed: ${uploadResponse.statusText}`);
  }

  const jobData = await uploadResponse.json();
  const jobId = jobData.id;

  // Aguardar conclusão
  let jobStatus = 'initialising';
  let attempts = 0;
  const maxAttempts = 30;

  while (!['successful', 'failed', 'cancelled'].includes(jobStatus) && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const statusResponse = await fetch(`https://sandbox-api.zamzar.com/v1/jobs/${jobId}`, {
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':')}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Zamzar status check failed: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    jobStatus = statusData.status;
    attempts++;
  }

  if (jobStatus !== 'successful') {
    throw new Error(`Zamzar conversion failed with status: ${jobStatus}`);
  }

  // Obter arquivo resultante
  const filesResponse = await fetch(`https://sandbox-api.zamzar.com/v1/jobs/${jobId}`, {
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
    },
  });

  const finalJobData = await filesResponse.json();
  const targetFileId = finalJobData.target_files[0].id;

  // Baixar arquivo
  const downloadResponse = await fetch(`https://sandbox-api.zamzar.com/v1/files/${targetFileId}/content`, {
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
    },
  });

  if (!downloadResponse.ok) {
    throw new Error(`Zamzar download failed: ${downloadResponse.statusText}`);
  }

  return await downloadResponse.arrayBuffer();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Word to PDF conversion request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Converting file: ${file.name}, size: ${file.size} bytes`);

    // Validar tipo de arquivo
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('File must be a Word document (.doc or .docx)');
    }

    const fileBuffer = await file.arrayBuffer();
    let pdfBuffer: ArrayBuffer | null = null;
    let lastError: Error | null = null;

    // Tentar CloudConvert primeiro
    try {
      console.log('Attempting conversion with CloudConvert...');
      pdfBuffer = await convertWithCloudConvert(fileBuffer, file.name);
      console.log('CloudConvert conversion successful');
    } catch (error) {
      console.error('CloudConvert failed:', error);
      lastError = error as Error;
    }

    // Se CloudConvert falhar, tentar ConvertAPI
    if (!pdfBuffer) {
      try {
        console.log('Attempting conversion with ConvertAPI...');
        pdfBuffer = await convertWithConvertAPI(fileBuffer, file.name);
        console.log('ConvertAPI conversion successful');
      } catch (error) {
        console.error('ConvertAPI failed:', error);
        lastError = error as Error;
      }
    }

    // Se ConvertAPI falhar, tentar Zamzar
    if (!pdfBuffer) {
      try {
        console.log('Attempting conversion with Zamzar...');
        pdfBuffer = await convertWithZamzar(fileBuffer, file.name);
        console.log('Zamzar conversion successful');
      } catch (error) {
        console.error('Zamzar failed:', error);
        lastError = error as Error;
      }
    }

    if (!pdfBuffer) {
      throw new Error(`All conversion services failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    console.log(`Conversion successful. PDF size: ${pdfBuffer.byteLength} bytes`);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx|doc)$/i, '.pdf')}"`,
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in Word to PDF conversion:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha na conversão do documento Word para PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
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
