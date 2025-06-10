
import { supabase } from '@/integrations/supabase/client';

export const convertWordToPdf = async (file: File): Promise<File> => {
  try {
    console.log(`Converting ${file.name} to PDF using professional conversion service`);
    
    // Validar tipo de arquivo
    if (!file.name.match(/\.(docx|doc)$/i)) {
      throw new Error('Arquivo deve ser um documento Word (.doc ou .docx)');
    }

    // Criar FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending file to conversion service...');
    
    // Chamar o edge function
    const { data, error } = await supabase.functions.invoke('convert-word-libreoffice', {
      body: formData,
    });

    if (error) {
      console.error('Conversion service error:', error);
      throw new Error('Falha na conversão do documento. Verifique se o arquivo não está corrompido.');
    }

    if (!data) {
      throw new Error('Nenhum dado retornado do serviço de conversão');
    }

    console.log('Conversion successful, creating PDF file...');

    // Criar arquivo PDF a partir dos dados retornados
    const pdfBlob = new Blob([data], { type: 'application/pdf' });
    
    // Verificar se o blob tem conteúdo
    if (pdfBlob.size === 0) {
      throw new Error('Arquivo PDF gerado está vazio');
    }

    const originalName = file.name.split('.')[0];
    const pdfFileName = `${originalName}.pdf`;
    
    console.log(`Successfully converted ${file.name} to ${pdfFileName} (${pdfBlob.size} bytes)`);
    
    return new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    
    // Mensagens de erro mais específicas
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Serviço de conversão não configurado. Tente novamente mais tarde.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Conversão demorou muito para completar. Tente com um arquivo menor.');
      } else if (error.message.includes('format')) {
        throw new Error('Formato de arquivo não suportado. Use apenas arquivos .doc ou .docx.');
      }
    }
    
    throw new Error('Falha na conversão do documento Word para PDF. Verifique se o arquivo não está corrompido.');
  }
};
