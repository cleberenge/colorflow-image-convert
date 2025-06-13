
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to install pdfcpu if not available
async function ensurePdfcpuInstalled(): Promise<boolean> {
  try {
    console.log('[PDFCPU] Verificando se pdfcpu está instalado...');
    
    // First, try to run pdfcpu to see if it's available
    const testCommand = new Deno.Command("pdfcpu", {
      args: ["version"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code } = await testCommand.output();
    
    if (code === 0) {
      console.log('[PDFCPU] pdfcpu já está instalado');
      return true;
    }
    
    console.log('[PDFCPU] pdfcpu não encontrado, instalando...');
    
    // Install Go first
    const goInstallCmd = new Deno.Command("sh", {
      args: ["-c", "wget -q https://go.dev/dl/go1.21.0.linux-amd64.tar.gz && tar -C /tmp -xzf go1.21.0.linux-amd64.tar.gz"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const goResult = await goInstallCmd.output();
    if (goResult.code !== 0) {
      console.error('[PDFCPU] Falha ao baixar Go');
      return false;
    }
    
    // Set Go environment and install pdfcpu
    const installCmd = new Deno.Command("sh", {
      args: ["-c", "export PATH=/tmp/go/bin:$PATH && export GOPATH=/tmp/go-workspace && go install github.com/pdfcpu/pdfcpu/cmd/pdfcpu@latest"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const installResult = await installCmd.output();
    console.log(`[PDFCPU] Instalação resultado código: ${installResult.code}`);
    
    if (installResult.code === 0) {
      console.log('[PDFCPU] pdfcpu instalado com sucesso');
      return true;
    } else {
      const errorOutput = new TextDecoder().decode(installResult.stderr);
      console.error('[PDFCPU] Erro na instalação:', errorOutput);
      return false;
    }
    
  } catch (error) {
    console.error('[PDFCPU] Erro durante instalação:', error);
    return false;
  }
}

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

    console.log(`[PDFCPU] Processando: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Verificar tamanho do arquivo (limite de 50MB)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo permitido: 50MB');
    }
    
    // Verificar se é PDF
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Verificar header PDF
    const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4));
    if (pdfHeader !== '%PDF') {
      throw new Error('Arquivo não é um PDF válido');
    }

    console.log('[PDFCPU] Arquivo PDF válido, verificando instalação do pdfcpu');

    // Ensure pdfcpu is installed
    const isPdfcpuReady = await ensurePdfcpuInstalled();
    if (!isPdfcpuReady) {
      throw new Error('Não foi possível instalar ou encontrar pdfcpu no servidor');
    }

    // Escrever arquivo temporário
    const inputPath = `/tmp/input_${Date.now()}.pdf`;
    const outputPath = `/tmp/output_${Date.now()}.pdf`;
    
    await Deno.writeFile(inputPath, uint8Array);
    console.log(`[PDFCPU] Arquivo salvo em: ${inputPath}`);

    // Executar pdfcpu para compressão com path completo
    const pdfcpuPath = "/tmp/go-workspace/bin/pdfcpu";
    const command = new Deno.Command(pdfcpuPath, {
      args: [
        "optimize",
        "-verbose",
        "-stats",
        inputPath,
        outputPath
      ],
      stdout: "piped",
      stderr: "piped",
      env: {
        "PATH": "/tmp/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "GOPATH": "/tmp/go-workspace"
      }
    });

    console.log('[PDFCPU] Executando comando de compressão...');
    const { code, stdout, stderr } = await command.output();
    
    const stdoutText = new TextDecoder().decode(stdout);
    const stderrText = new TextDecoder().decode(stderr);
    
    console.log(`[PDFCPU] Código de saída: ${code}`);
    console.log(`[PDFCPU] Stdout: ${stdoutText}`);
    if (stderrText) {
      console.log(`[PDFCPU] Stderr: ${stderrText}`);
    }

    if (code !== 0) {
      throw new Error(`Erro na compressão pdfcpu (código ${code}): ${stderrText || stdoutText}`);
    }

    // Verificar se o arquivo de saída foi criado
    let compressedData: Uint8Array;
    try {
      compressedData = await Deno.readFile(outputPath);
      console.log(`[PDFCPU] Arquivo comprimido lido: ${compressedData.length} bytes`);
    } catch (error) {
      console.error('[PDFCPU] Erro ao ler arquivo comprimido:', error);
      throw new Error('Falha ao ler arquivo comprimido');
    }

    // Verificar se o arquivo comprimido é válido
    const compressedHeader = String.fromCharCode(...compressedData.slice(0, 4));
    if (compressedHeader !== '%PDF') {
      throw new Error('Arquivo comprimido não é um PDF válido');
    }

    if (compressedData.length === 0) {
      throw new Error('Arquivo comprimido está vazio');
    }

    // Limpeza dos arquivos temporários
    try {
      await Deno.remove(inputPath);
      await Deno.remove(outputPath);
      console.log('[PDFCPU] Arquivos temporários removidos');
    } catch (error) {
      console.warn('[PDFCPU] Aviso: Erro ao remover arquivos temporários:', error);
    }
    
    const originalSize = file.size;
    const compressedSize = compressedData.length;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log(`[PDFCPU] Sucesso - Redução: ${reduction}% (${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(compressedSize / 1024 / 1024).toFixed(2)}MB)`);

    return new Response(compressedData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Length': compressedSize.toString(),
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
      },
    });

  } catch (error) {
    console.error('[PDFCPU] Erro:', error);
    
    let errorMessage = 'Erro interno do servidor';
    let statusCode = 500;
    
    if (error.message.includes('muito grande')) {
      errorMessage = 'Arquivo muito grande';
      statusCode = 413;
    } else if (error.message.includes('Nenhum arquivo')) {
      errorMessage = 'Nenhum arquivo fornecido';
      statusCode = 400;
    } else if (error.message.includes('não é um PDF válido')) {
      errorMessage = 'Arquivo não é um PDF válido';
      statusCode = 422;
    } else if (error.message.includes('Erro na compressão pdfcpu')) {
      errorMessage = 'Erro na compressão do arquivo';
      statusCode = 422;
    } else if (error.message.includes('instalar ou encontrar pdfcpu')) {
      errorMessage = 'Erro de instalação do pdfcpu no servidor';
      statusCode = 500;
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
