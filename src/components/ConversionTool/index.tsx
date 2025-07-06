import React, { useState, useCallback, useEffect } from 'react';
import { useFileConverter } from '@/hooks/useFileConverter';
import { useConversionColors } from '@/hooks/useConversionColors';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ConversionType, ConvertedFile } from '@/types/fileConverter';
import UploadArea from './UploadArea';
import ConversionOptions from './ConversionOptions';
import FileList from './FileList';
import ProgressSection from './ProgressSection';
import ErrorMessage from './ErrorMessage';

interface ConversionToolProps {
  conversionType?: ConversionType;
  conversionInfo?: any;
}

const ConversionTool: React.FC<ConversionToolProps> = ({ 
  conversionType: propConversionType, 
  conversionInfo 
}) => {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>(propConversionType || 'png-jpg');
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  const { convertFiles, isConverting, progress } = useFileConverter();
  const { 
    getUploadTextColor, 
    getButtonTextColor, 
    getFileNumberColor, 
    getConversionColor 
  } = useConversionColors();
  const {
    selectedFiles,
    setSelectedFiles,
    handleFileSelect,
    clearFiles,
    getAcceptedFileTypes,
    getUploadText
  } = useFileUpload();

  // Update selectedConversion when propConversionType changes
  useEffect(() => {
    if (propConversionType) {
      setSelectedConversion(propConversionType);
    }
  }, [propConversionType]);

  // Debug: log do estado atual
  useEffect(() => {
    console.log('[ConversionTool] Estado atual:');
    console.log('- Arquivos selecionados:', selectedFiles.length);
    console.log('- Arquivos convertidos:', convertedFiles.length);
    console.log('- Está convertendo?', isConverting);
    console.log('- Erro:', conversionError);
    console.log('- Progresso:', progress);
  }, [selectedFiles, convertedFiles, isConverting, conversionError, progress]);

  const handleConversionChange = useCallback((value: string) => {
    console.log('[ConversionTool] Tipo de conversão alterado para:', value);
    setSelectedConversion(value as ConversionType);
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
  }, [setSelectedFiles]);

  const updateProgressWithMessage = useCallback((progress: number, message: string = '') => {
    setLocalProgress(progress);
    setProgressMessage(message);
  }, []);

  const convertSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) {
      console.log('[ConversionTool] Nenhum arquivo selecionado para conversão');
      return;
    }

    console.log('[ConversionTool] === INICIANDO CONVERSÃO ===');
    console.log('- Arquivos:', selectedFiles.length);
    console.log('- Tipo:', selectedConversion);
    console.log('- Tamanhos originais:', selectedFiles.map(f => `${f.name}: ${(f.size / 1024 / 1024).toFixed(2)} MB`));
    
    setConversionError(null);
    setConvertedFiles([]);
    setLocalProgress(0);
    setProgressMessage('');

    try {
      const progressCallback = (progress: number) => {
        if (selectedConversion === 'reduce-pdf') {
          if (progress <= 5) {
            updateProgressWithMessage(progress, 'Enviando...');
          } else if (progress <= 15) {
            updateProgressWithMessage(progress, 'Processando...');
          } else if (progress <= 50) {
            updateProgressWithMessage(progress, 'Comprimindo...');
          } else if (progress <= 85) {
            updateProgressWithMessage(progress, 'Otimizando...');
          } else if (progress <= 95) {
            updateProgressWithMessage(progress, 'Finalizando...');
          } else {
            updateProgressWithMessage(progress, 'Pronto para download');
          }
        } else {
          setLocalProgress(progress);
          setProgressMessage('');
        }
      };

      const results = await convertFiles(selectedFiles, selectedConversion, progressCallback);
      
      console.log('[ConversionTool] === CONVERSÃO CONCLUÍDA ===');
      console.log('- Arquivos convertidos:', results.length);
      console.log('- Detalhes:', results.map(r => ({ 
        name: r.file.name, 
        size: `${(r.file.size / 1024 / 1024).toFixed(2)} MB`,
        originalName: r.originalName 
      })));
      
      if (selectedConversion === 'reduce-pdf') {
        results.forEach((result, index) => {
          const originalFile = selectedFiles[index];
          const reduction = ((originalFile.size - result.file.size) / originalFile.size * 100).toFixed(1);
          console.log(`[ConversionTool] Redução ${result.file.name}: ${reduction}% (${(originalFile.size / 1024 / 1024).toFixed(2)} MB → ${(result.file.size / 1024 / 1024).toFixed(2)} MB)`);
        });
        updateProgressWithMessage(100, 'Pronto para download');
      }
      
      setConvertedFiles(results);
      
      if (results.length === 0) {
        console.warn('[ConversionTool] AVISO: Nenhum arquivo foi convertido!');
        setConversionError('Nenhum arquivo foi convertido. Verifique se o arquivo não está corrompido.');
      }
      
    } catch (error) {
      console.error('[ConversionTool] === ERRO NA CONVERSÃO ===');
      console.error('Erro:', error);
      
      let errorMessage = 'Erro desconhecido na conversão';
      
      if (error.message?.includes('muito grande')) {
        errorMessage = 'Arquivo muito grande para a API (limite: ~10MB)';
      } else if (error.message?.includes('PDF inválido')) {
        errorMessage = 'O arquivo PDF está inválido ou corrompido';
      } else if (error.message?.includes('não foi possível conectar') || error.message?.includes('CORS')) {
        errorMessage = 'Não foi possível conectar com a API de compressão. A API pode estar bloqueada pelo navegador ou indisponível.';
      } else if (error.message?.includes('tempo limite') || error.message?.includes('cancelada')) {
        errorMessage = 'A compressão demorou muito (mais de 2 minutos). Tente com um arquivo menor ou aguarde e tente novamente.';
      } else if (error.message?.includes('temporariamente indisponível') || error.message?.includes('dormindo')) {
        errorMessage = 'A API está temporariamente indisponível (pode estar "dormindo"). Aguarde 1-2 minutos e tente novamente.';
      } else if (error.message?.includes('servidor')) {
        errorMessage = 'Erro interno do servidor de compressão - tente novamente em alguns minutos';
      } else if (error.message?.includes('rede') || error.message?.includes('conexão')) {
        errorMessage = 'Problema de conectividade. Verifique sua internet e tente novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setConversionError(errorMessage);
      setConvertedFiles([]);
      setProgressMessage('');
    }
  }, [selectedFiles, selectedConversion, convertFiles, updateProgressWithMessage]);

  const handleClearFiles = useCallback(() => {
    clearFiles();
    setConvertedFiles([]);
    setConversionError(null);
    setProgressMessage('');
  }, [clearFiles]);

  const downloadZip = useCallback(async () => {
    if (convertedFiles.length === 0) {
      console.log('[ConversionTool] Nenhum arquivo convertido para download');
      return;
    }

    try {
      console.log('[ConversionTool] Iniciando criação do ZIP...');
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (const { file } of convertedFiles) {
        console.log('[ConversionTool] Adicionando arquivo ao ZIP:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);
        
        if (file.size === 0) {
          console.warn('[ConversionTool] Arquivo vazio detectado:', file.name);
          continue;
        }
        
        try {
          const blob = new Blob([file], { type: file.type });
          const arrayBuffer = await blob.arrayBuffer();
          
          console.log('[ConversionTool] Arquivo lido com sucesso:', file.name, 'Tamanho do buffer:', arrayBuffer.byteLength);
          
          zip.file(file.name, arrayBuffer, { 
            binary: true,
            compression: 'STORE'
          });
        } catch (fileError) {
          console.error('[ConversionTool] Erro ao processar arquivo:', file.name, fileError);
          const errorContent = `Erro ao processar o arquivo: ${file.name}`;
          zip.file(`ERROR_${file.name}.txt`, errorContent);
        }
      }
      
      console.log('[ConversionTool] Gerando arquivo ZIP...');
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'STORE',
        compressionOptions: {
          level: 0
        }
      });
      
      console.log('[ConversionTool] ZIP gerado com sucesso. Tamanho:', zipBlob.size);
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted-files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('[ConversionTool] Erro ao criar ZIP:', error);
      setConversionError('Erro ao criar arquivo ZIP para download');
    }
  }, [convertedFiles]);

  // Derived values
  const conversionColor = getConversionColor(selectedConversion);
  const uploadTextColor = getUploadTextColor(selectedConversion);
  const buttonTextColor = getButtonTextColor(selectedConversion);
  const fileNumberColor = getFileNumberColor(selectedConversion);
  const isReducePdf = selectedConversion === 'reduce-pdf';
  const showDownloadButton = convertedFiles.length > 0 && !isConverting;
  const currentProgress = selectedConversion === 'reduce-pdf' ? localProgress : progress;
  const acceptedFileTypes = getAcceptedFileTypes(selectedConversion);
  const uploadText = getUploadText(selectedConversion);
  const allowMultiple = selectedConversion !== 'reduce-pdf' && selectedConversion !== 'split-pdf';

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <UploadArea
        conversionColor={conversionColor}
        uploadTextColor={uploadTextColor}
        uploadText={uploadText}
        acceptedFileTypes={acceptedFileTypes}
        allowMultiple={allowMultiple}
        onFileSelect={handleFileSelect}
      />

      {selectedFiles.length > 0 && (
        <ConversionOptions
          selectedConversion={selectedConversion}
          onConversionChange={handleConversionChange}
        />
      )}

      {selectedFiles.length > 0 && (
        <FileList
          selectedFiles={selectedFiles}
          convertedFiles={convertedFiles}
          conversionColor={conversionColor}
          buttonTextColor={buttonTextColor}
          fileNumberColor={fileNumberColor}
          isConverting={isConverting}
          showDownloadButton={showDownloadButton}
          onConvert={convertSelectedFiles}
          onClear={handleClearFiles}
          onDownload={downloadZip}
        />
      )}

      <ProgressSection
        isConverting={isConverting}
        currentProgress={currentProgress}
        conversionColor={conversionColor}
        isReducePdf={isReducePdf}
        progressMessage={progressMessage}
      />

      <ErrorMessage error={conversionError} />
    </div>
  );
};

export default ConversionTool;
