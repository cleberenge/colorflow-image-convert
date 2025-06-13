
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
    console.log('[EdgeFunction] === REQUISIÇÃO DETALHADA ===');
    console.log('[EdgeFunction] Método:', req.method);
    console.log('[EdgeFunction] URL:', req.url);
    console.log('[EdgeFunction] Headers:', Object.fromEntries(req.headers.entries()));
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('Nenhum arquivo fornecido');
    }

    console.log(`[EdgeFunction] === ARQUIVO RECEBIDO ===`);
    console.log(`[EdgeFunction] Nome: ${file.name}`);
    console.log(`[EdgeFunction] Tamanho: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`[EdgeFunction] Tipo: ${file.type}`);
    
    // Verificação detalhada do arquivo
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 20));
    
    console.log(`[EdgeFunction] === VALIDAÇÃO DO ARQUIVO ===`);
    console.log(`[EdgeFunction] Header: "${header}"`);
    console.log(`[EdgeFunction] Primeiros 30 bytes:`, Array.from(uint8Array.slice(0, 30)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log(`[EdgeFunction] Últimos 20 bytes:`, Array.from(uint8Array.slice(-20)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
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

    console.log('[EdgeFunction] === INICIANDO PROCESSO ILOVEAPI ===');

    // Primeira etapa: Iniciar tarefa de compressão
    console.log('[EdgeFunction] ETAPA 1: Iniciando tarefa');
    
    const startResponse = await fetch('https://api.ilovepdf.com/v1/start/compress', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ILOVEAPI_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[EdgeFunction] Start response:`);
    console.log(`- Status: ${startResponse.status}`);
    console.log(`- Headers:`, Object.fromEntries(startResponse.headers.entries()));

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('[EdgeFunction] Erro ao iniciar tarefa:', errorText);
      throw new Error(`Erro ao iniciar compressão: ${startResponse.status} - ${errorText}`);
    }

    const startData = await startResponse.json();
    console.log('[EdgeFunction] Start data:', startData);
    const taskId = startData.task;
    console.log(`[EdgeFunction] Task ID: ${taskId}`);

    // Segunda etapa: Upload do arquivo
    console.log('[EdgeFunction] ETAPA 2: Upload do arquivo');
    
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

    console.log(`[EdgeFunction] Upload response:`);
    console.log(`- Status: ${uploadResponse.status}`);
    console.log(`- Headers:`, Object.fromEntries(uploadResponse.headers.entries()));

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[EdgeFunction] Erro no upload:', errorText);
      throw new Error(`Erro no upload: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('[EdgeFunction] Upload data:', uploadData);

    // Terceira etapa: Processar compressão
    console.log('[EdgeFunction] ETAPA 3: Processando compressão');
    
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

    console.log(`[EdgeFunction] Process response:`);
    console.log(`- Status: ${processResponse.status}`);
    console.log(`- Headers:`, Object.fromEntries(processResponse.headers.entries()));

    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      console.error('[EdgeFunction] Erro no processamento:', errorText);
      throw new Error(`Erro no processamento: ${processResponse.status} - ${errorText}`);
    }

    const processData = await processResponse.json();
    console.log('[EdgeFunction] Process data:', processData);

    // Quarta etapa: Download do arquivo comprimido
    console.log('[EdgeFunction] ETAPA 4: Download do arquivo comprimido');
    
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

    console.log(`[EdgeFunction] Download response:`);
    console.log(`- Status: ${downloadResponse.status}`);
    console.log(`- Content-Type: ${downloadResponse.headers.get('content-type')}`);
    console.log(`- Content-Length: ${downloadResponse.headers.get('content-length')}`);
    console.log(`- Headers completos:`, Object.fromEntries(downloadResponse.headers.entries()));

    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text();
      console.error('[EdgeFunction] Erro no download:', errorText);
      throw new Error(`Erro no download: ${downloadResponse.status} - ${errorText}`);
    }

    const compressedBuffer = await downloadResponse.arrayBuffer();
    const compressedSize = compressedBuffer.byteLength;
    
    console.log(`[EdgeFunction] === ARQUIVO COMPRIMIDO ANALISADO ===`);
    console.log(`[EdgeFunction] Tamanho: ${compressedSize} bytes`);
    
    if (compressedSize === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }
    
    // Verificação detalhada do arquivo comprimido
    const compressedUint8Array = new Uint8Array(compressedBuffer);
    const compressedHeader = new TextDecoder().decode(compressedUint8Array.slice(0, 20));
    
    console.log(`[EdgeFunction] === VALIDAÇÃO DO ARQUIVO COMPRIMIDO ===`);
    console.log(`[EdgeFunction] Header: "${compressedHeader}"`);
    console.log(`[EdgeFunction] Primeiros 50 bytes:`, Array.from(compressedUint8Array.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log(`[EdgeFunction] Últimos 30 bytes:`, Array.from(compressedUint8Array.slice(-30)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    // Verificar se é realmente um PDF
    if (!compressedHeader.startsWith('%PDF-')) {
      console.error('[EdgeFunction] === ERRO: ARQUIVO COMPRIMIDO INVÁLIDO ===');
      console.error('[EdgeFunction] Header esperado: %PDF-');
      console.error('[EdgeFunction] Header recebido:', compressedHeader);
      
      // Verificar se é uma resposta de erro da API
      const textContent = new TextDecoder().decode(compressedUint8Array.slice(0, 1000));
      console.error('[EdgeFunction] Conteúdo como texto (primeiros 1000 chars):', textContent);
      
      // Se contém caracteres de erro JSON
      if (textContent.includes('error') || textContent.includes('Error')) {
        console.error('[EdgeFunction] Possível resposta de erro da ILoveAPI no lugar do PDF');
      }
      
      throw new Error('API retornou arquivo inválido - não é um PDF');
    }
    
    // Verificar se o PDF está completo
    const pdfEndCheck = new TextDecoder().decode(compressedUint8Array.slice(-50));
    console.log(`[EdgeFunction] Final do PDF: "${pdfEndCheck}"`);
    
    if (!pdfEndCheck.includes('%%EOF')) {
      console.warn('[EdgeFunction] AVISO: PDF pode estar incompleto - %%EOF não encontrado');
    }
    
    console.log(`[EdgeFunction] === SUCESSO NA COMPRESSÃO ===`);
    console.log(`[EdgeFunction] Tamanho original: ${file.size} bytes`);
    console.log(`[EdgeFunction] Tamanho comprimido: ${compressedSize} bytes`);
    console.log(`[EdgeFunction] Redução: ${(((file.size - compressedSize) / file.size) * 100).toFixed(2)}%`);

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
    console.error('[EdgeFunction] === ERRO DETALHADO ===');
    console.error('[EdgeFunction] Tipo:', typeof error);
    console.error('[EdgeFunction] Erro:', error);
    console.error('[EdgeFunction] Mensagem:', error.message);
    console.error('[EdgeFunction] Stack:', error.stack);
    
    let errorMessage = 'Erro interno do servidor';
    let statusCode = 500;
    
    if (error.message.includes('PDF válido') || error.message.includes('arquivo inválido')) {
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
