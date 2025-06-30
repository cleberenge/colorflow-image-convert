import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download } from 'lucide-react';
import { useFileConverter } from '@/hooks/useFileConverter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConversionIcon from '@/components/ConversionIcon';
import { getConversionColor } from '@/utils/conversionColors';
import { ConversionType, ConvertedFile } from '@/types/fileConverter';

interface ConversionOption {
  value: ConversionType;
  label: string;
  description: string;
}

interface ConversionInfo {
  id: string;
  label: { [key: string]: string };
  from: string;
  to: string;
  icon: string;
}

interface ConversionToolProps {
  conversionType?: ConversionType;
  conversionInfo?: ConversionInfo;
}

const conversionOptions: ConversionOption[] = [
  { value: 'png-jpg', label: 'PNG para JPG', description: '' },
  { value: 'jpg-pdf', label: 'JPG para PDF', description: '' },
  { value: 'split-pdf', label: 'Dividir PDF', description: '' },
  { value: 'merge-pdf', label: 'Juntar PDF', description: '' },
  { value: 'reduce-pdf', label: 'Reduzir PDF', description: '' },
  { value: 'video-mp3', label: 'MP4 para MP3', description: '' },
  { value: 'svg-png', label: 'SVG para PNG', description: '' },
  { value: 'jpg-webp', label: 'JPG para WebP', description: '' },
  { value: 'svg-jpg', label: 'SVG para JPG', description: '' },
  { value: 'html-pdf', label: 'HTML para PDF', description: '' },
  { value: 'csv-json', label: 'CSV para JSON', description: '' },
  { value: 'csv-excel', label: 'CSV para Excel', description: '' },
];

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType: propConversionType, conversionInfo }) => {
  // All hooks must be called in the same order every render
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>(propConversionType || 'png-jpg');
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  const { convertFiles, isConverting, progress } = useFileConverter();

  // Update selectedConversion when propConversionType changes
  useEffect(() => {
    if (propConversionType) {
      setSelectedConversion(propConversionType);
    }
  }, [propConversionType]);

  // Função para definir manualmente a cor do texto na área de upload para cada tipo de conversão
  const getUploadTextColor = (conversionType: ConversionType): string => {
    const textColorMap: Record<ConversionType, string> = {
      'png-jpg': 'text-black',           // Amarelo para PNG para JPG
      'jpg-pdf': '#text-black',        // Preto para JPG para PDF  
      'split-pdf': 'text-black',      // Preto para Dividir PDF
      'merge-pdf': 'text-black',      // Preto para Juntar PDF
      'reduce-pdf':'#FFFFFF',     // Branco para Reduzir PDF
      'video-mp3': 'text-white',      // Branco para vídeo para MP3
      'svg-png': '#D90368',        // Branco para SVG para PNG
      'jpg-webp': 'text-white',       // Branco para JPG para WebP
      'svg-jpg': '#FFFFFF',        // Branco para SVG para JPG
      'html-pdf': 'text-white',       // Branco para HTML para PDF
      'csv-json': 'text-black',       // Preto para CSV para JSON
      'csv-excel': 'text-white',      // Branco para CSV para Excel
    };
    
    return textColorMap[conversionType] || 'text-black';
  };

  // Debug: log do estado atual
  useEffect(() => {
    console.log('[ConversionTool] Estado atual:');
    console.log('- Arquivos selecionados:', selectedFiles.length);
    console.log('- Arquivos convertidos:', convertedFiles.length);
    console.log('- Está convertendo?', isConverting);
    console.log('- Erro:', conversionError);
    console.log('- Progresso:', progress);
  }, [selectedFiles, convertedFiles, isConverting, conversionError, progress]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 25) {
      return;
    }

    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('[ConversionTool] Arquivos selecionados:', sortedFiles.map(f => f.name));
    console.log('[ConversionTool] Tamanhos dos arquivos:', sortedFiles.map(f => `${f.name}: ${(f.size / 1024 / 1024).toFixed(2)} MB`));
    
    setSelectedFiles(sortedFiles);
    setConvertedFiles([]);
    setConversionError(null);
  }, []);

  const handleConversionChange = useCallback((value: string) => {
    console.log('[ConversionTool] Tipo de conversão alterado para:', value);
    setSelectedConversion(value as ConversionType);
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
  }, []);

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

  const clearFiles = useCallback(() => {
    console.log('[ConversionTool] Limpando arquivos');
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
    setProgressMessage('');
  }, []);

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

  // All calculations and derived state after hooks
  const conversionColor = getConversionColor(selectedConversion);
  const uploadTextColor = getUploadTextColor(selectedConversion);
  const isReducePdf = selectedConversion === 'reduce-pdf';
  const showDownloadButton = convertedFiles.length > 0 && !isConverting;
  const currentProgress = selectedConversion === 'reduce-pdf' ? localProgress : progress;

  const organizeFilesInColumns = (files: File[]) => {
    const filesPerColumn = 5;
    const numColumns = Math.ceil(files.length / filesPerColumn);
    const columns = [];
    
    for (let col = 0; col < numColumns; col++) {
      const columnFiles = [];
      for (let row = 0; row < filesPerColumn; row++) {
        const fileIndex = col * filesPerColumn + row;
        if (fileIndex < files.length) {
          columnFiles.push(files[fileIndex]);
        }
      }
      columns.push(columnFiles);
    }
    
    return columns;
  };

  const getAcceptedFileTypes = () => {
    switch (selectedConversion) {
      case 'png-jpg':
        return '.png';
      case 'jpg-pdf':
      case 'jpg-webp':
        return '.jpg,.jpeg';
      case 'split-pdf':
      case 'reduce-pdf':
      case 'merge-pdf':
        return '.pdf';
      case 'video-mp3':
        return '.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v,.3gp';
      case 'svg-png':
      case 'svg-jpg':
        return '.svg';
      case 'html-pdf':
        return '.html,.htm';
      case 'csv-json':
      case 'csv-excel':
        return '.csv';
      default:
        return '*';
    }
  };

  const getUploadText = () => {
    if (selectedConversion === 'merge-pdf') {
      return 'PDFs para mesclar';
    } else if (selectedConversion === 'reduce-pdf') {
      return 'PDF para reduzir';
    } else if (selectedConversion === 'split-pdf') {
      return 'PDF para dividir';
    } else if (selectedConversion === 'video-mp3') {
      return 'vídeos para converter';
    } else if (selectedConversion === 'svg-png' || selectedConversion === 'svg-jpg') {
      return 'arquivos SVG';
    } else if (selectedConversion === 'html-pdf') {
      return 'arquivos HTML';
    } else if (selectedConversion === 'csv-json' || selectedConversion === 'csv-excel') {
      return 'arquivos CSV';
    } else if (selectedConversion === 'jpg-webp') {
      return 'imagens JPG';
    } else {
      return 'até 25 arquivos';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      {/* Upload Area */}
      <Card 
        className="w-full max-w-3xl p-2 border-2 border-dashed hover:border-opacity-60 transition-all duration-300"
        style={{ 
          backgroundColor: conversionColor,
          borderColor: conversionColor,
        }}
      >
        <div className="text-center">
          <input
            type="file"
            multiple={selectedConversion !== 'reduce-pdf' && selectedConversion !== 'split-pdf'}
            accept={getAcceptedFileTypes()}
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
              <Upload 
                className="w-6 h-6"
                style={{ 
                  color: uploadTextColor.startsWith('#') ? uploadTextColor : undefined 
                }}
              />
            </div>
            <div>
              <p 
                className="text-base font-medium mb-1"
                style={{ 
                  color: uploadTextColor.startsWith('#') ? uploadTextColor : undefined 
                }}
              >
                Clique para selecionar {getUploadText()}
              </p>
              <p 
                className="text-sm"
                style={{ 
                  color: uploadTextColor.startsWith('#') ? uploadTextColor : undefined 
                }}
              >
                ou arraste e solte aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Conversion Options */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-2 bg-white border border-gray-200">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Opções de Conversão</h2>
            <Select onValueChange={handleConversionChange} value={selectedConversion}>
              <SelectTrigger className="w-full [&>svg]:hidden">
                <SelectValue placeholder="Selecione o tipo de conversão" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <ConversionIcon conversionType={option.value} className="w-5 h-5" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Selected Files Info */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Arquivos Selecionados</h2>
            <div className="flex gap-4 overflow-x-auto">
              {organizeFilesInColumns(selectedFiles).map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-2 min-w-0 flex-1">
                  {column.map((file, fileIndex) => {
                    const fileNumber = columnIndex * 5 + fileIndex + 1;
                    return (
                      <div key={columnIndex * 5 + fileIndex} className="flex items-center gap-1 min-w-0">
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: conversionColor }}
                        >
                          <span className="text-xs font-bold text-white">{fileNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-xs truncate">{file.name}</p>
                          <p className="text-xs text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <Button
                onClick={convertSelectedFiles}
                disabled={isConverting}
                className="font-medium transition-all duration-300 text-white"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                {isConverting ? 'Convertendo...' : 'Converter'}
              </Button>
              <Button
                onClick={clearFiles}
                className="font-medium transition-all duration-300 text-white"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                Limpar
              </Button>
              {showDownloadButton && (
                <Button
                  onClick={downloadZip}
                  className="font-medium transition-all duration-300 text-white"
                  style={{ 
                    backgroundColor: conversionColor,
                    borderColor: conversionColor
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isReducePdf ? 'Baixar' : `Baixar (${convertedFiles.length} arquivo${convertedFiles.length > 1 ? 's' : ''})`}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Progress for PDF Compression */}
      {isConverting && (
        <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                {isReducePdf ? 'Comprimindo PDF' : 'Convertendo...'}
              </span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>
                {currentProgress}%
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={currentProgress} 
                className="h-2 bg-gray-200 rounded-full overflow-hidden" 
                indicatorColor={conversionColor} 
              />
              {isReducePdf && (
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-transparent to-white/20 rounded-full transition-all duration-300 ease-in-out"
                  style={{ 
                    width: `${currentProgress}%`,
                    backgroundColor: conversionColor 
                  }}
                />
              )}
            </div>
            
            {isReducePdf && progressMessage && (
              <div className="text-center">
                <span className="text-xs text-gray-600 font-medium">
                  {progressMessage}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Error Message */}
      {conversionError && (
        <Card className="w-full max-w-3xl p-3 bg-red-50 border border-red-200">
          <div className="text-red-700 text-sm">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-red-800">⚠️ Erro:</span>
              <div className="flex-1">
                <p className="font-medium">{conversionError}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConversionTool;
