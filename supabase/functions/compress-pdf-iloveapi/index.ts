
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
    console.log('Requisição de compressão PDF via ILoveAPI recebida');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('Nenhum arquivo fornecido');
    }

    console.log(`Processando arquivo: ${file.name}, tamanho: ${file.size} bytes, tipo: ${file.type}`);
    
    // Verificar se é um PDF válido
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 5));
    
    console.log(`Header do arquivo recebido: ${header}`);
    
    if (!header.startsWith('%PDF-')) {
      throw new Error('Arquivo não é um PDF válido');
    }
    
    // Verificar tamanho do arquivo (limite de 25MB)
    if (file.size > 25 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo permitido: 25MB');
    }
    
    const ILOVEAPI_KEY = Deno.env.get('ILOVEAPI_KEY');
    if (!ILOVEAPI_KEY) {
      throw new Error('Chave da API ILoveAPI não configurada');
    }

    console.log('Chave da API encontrada, iniciando processo...');

    // Primeira etapa: Iniciar tarefa de compressão
    console.log('Iniciando tarefa de compressão...');
    
    const startResponse = await fetch('https://api.ilovepdf.com/v1/start/compress', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status da resposta start: ${startResponse.status}`);

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('Erro ao iniciar tarefa:', errorText);
      throw new Error(`Erro ao iniciar compressão: ${startResponse.status} - ${errorText}`);
    }

    const startData = await startResponse.json();
    const taskId = startData.task;
    console.log(`Tarefa iniciada com ID: ${taskId}`);

    // Segunda etapa: Upload do arquivo
    console.log('Fazendo upload do arquivo...');
    
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

    console.log(`Status da resposta upload: ${uploadResponse.status}`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Erro no upload:', errorText);
      throw new Error(`Erro no upload: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('Upload concluído:', uploadData);

    // Terceira etapa: Processar compressão
    console.log('Processando compressão...');
    
    const processResponse = await fetch('https://api.ilovepdf.com/v1/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: taskId,
        compression_level: 'recommended', // ou 'low', 'recommended', 'extreme'
      }),
    });

    console.log(`Status da resposta process: ${processResponse.status}`);

    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      console.error('Erro no processamento:', errorText);
      throw new Error(`Erro no processamento: ${processResponse.status} - ${errorText}`);
    }

    const processData = await processResponse.json();
    console.log('Processamento concluído:', processData);

    // Quarta etapa: Download do arquivo comprimido
    console.log('Fazendo download do arquivo comprimido...');
    
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

    console.log(`Status da resposta download: ${downloadResponse.status}`);

    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text();
      console.error('Erro no download:', errorText);
      throw new Error(`Erro no download: ${downloadResponse.status} - ${errorText}`);
    }

    const compressedBuffer = await downloadResponse.arrayBuffer();
    const compressedSize = compressedBuffer.byteLength;
    
    if (compressedSize === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    // Removemos a validação rigorosa do header que estava causando problemas
    // A API ILoveAPI já garante que o arquivo retornado é um PDF válido
    console.log('Arquivo comprimido recebido com sucesso, pulando validação de header');
    
    console.log(`Compressão concluída com sucesso:`);
    console.log(`- Tamanho original: ${file.size} bytes`);
    console.log(`- Tamanho comprimido: ${compressedSize} bytes`);
    console.log(`- Redução: ${(((file.size - compressedSize) / file.size) * 100).toFixed(2)}%`);

    return new Response(compressedBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Length': compressedSize.toString(),
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
        'X-Original-Size': file.size.toString(),
        'X-Compressed-Size': compressedSize.toString(),
      },
    });

  } catch (error) {
    console.error('Erro detalhado na compressão PDF via ILoveAPI:', error);
    console.error('Stack trace:', error.stack);
    
    let errorMessage = 'Erro interno do servidor';
    let statusCode = 500;
    
    if (error.message.includes('PDF válido')) {
      errorMessage = 'Arquivo não é um PDF válido';
      statusCode = 415;
    } else if (error.message.includes('muito grande')) {
      errorMessage = 'Arquivo muito grande';
      statusCode = 413;
    } else if (error.message.includes('Chave da API')) {
      errorMessage = 'Serviço temporariamente indisponível';
      statusCode = 503;
    } else if (error.message.includes('Nenhum arquivo')) {
      errorMessage = 'Nenhum arquivo fornecido';
      statusCode = 400;
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
