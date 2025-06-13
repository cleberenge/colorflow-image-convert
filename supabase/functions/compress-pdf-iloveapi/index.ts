
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('Nenhum arquivo fornecido');
    }

    console.log(`[EdgeFunction] Processando: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Verificar tamanho do arquivo (limite de 25MB)
    if (file.size > 25 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo permitido: 25MB');
    }
    
    const ILOVEAPI_KEY = Deno.env.get('ILOVEAPI_KEY');
    if (!ILOVEAPI_KEY) {
      throw new Error('Chave da API ILoveAPI não configurada');
    }

    console.log('[EdgeFunction] Iniciando processo ILoveAPI');

    // Etapa 1: Iniciar tarefa de compressão
    const startResponse = await fetch('https://api.ilovepdf.com/v1/start/compress', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('[EdgeFunction] Erro ao iniciar tarefa:', errorText);
      throw new Error('Falha ao iniciar compressão na API externa');
    }

    const startData = await startResponse.json();
    const taskId = startData.task;
    console.log(`[EdgeFunction] Task ID: ${taskId}`);

    // Etapa 2: Upload do arquivo
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('task', taskId);

    const uploadResponse = await fetch('https://api.ilovepdf.com/v1/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[EdgeFunction] Erro no upload:', errorText);
      throw new Error('Falha no upload do arquivo');
    }

    // Etapa 3: Processar compressão
    const processResponse = await fetch('https://api.ilovepdf.com/v1/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: taskId,
        compression_level: 'recommended',
      }),
    });

    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      console.error('[EdgeFunction] Erro no processamento:', errorText);
      throw new Error('Falha no processamento da compressão');
    }

    // Etapa 4: Download do arquivo comprimido
    const downloadResponse = await fetch('https://api.ilovepdf.com/v1/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: taskId,
      }),
    });

    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text();
      console.error('[EdgeFunction] Erro no download:', errorText);
      throw new Error('Falha no download do arquivo comprimido');
    }

    const compressedBuffer = await downloadResponse.arrayBuffer();
    const compressedSize = compressedBuffer.byteLength;
    
    console.log(`[EdgeFunction] Arquivo comprimido: ${compressedSize} bytes`);
    
    if (compressedSize === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    console.log(`[EdgeFunction] Sucesso - Redução: ${((file.size - compressedSize) / file.size * 100).toFixed(2)}%`);

    return new Response(compressedBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Length': compressedSize.toString(),
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
      },
    });

  } catch (error) {
    console.error('[EdgeFunction] Erro:', error);
    
    let errorMessage = 'Erro interno do servidor';
    let statusCode = 500;
    
    if (error.message.includes('muito grande')) {
      errorMessage = 'Arquivo muito grande';
      statusCode = 413;
    } else if (error.message.includes('Nenhum arquivo')) {
      errorMessage = 'Nenhum arquivo fornecido';
      statusCode = 400;
    } else if (error.message.includes('Chave da API')) {
      errorMessage = 'Serviço temporariamente indisponível';
      statusCode = 503;
    } else if (error.message.includes('Falha')) {
      errorMessage = 'Erro na compressão do arquivo';
      statusCode = 422;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }), 
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
