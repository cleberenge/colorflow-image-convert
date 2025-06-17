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
  { value: 'protect-pdf', label: 'Proteger PDF', description: '' },
];

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType: propConversionType, conversionInfo }) => {
  // All hooks must be called in the same order every render
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>(propConversionType || 'png-jpg');
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [password, setPassword] = useState('');
  
  const { convertFiles, isConverting, progress } = useFileConverter();

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
    setPassword('');
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

    // Validar senha para proteção de PDF
    if (selectedConversion === 'protect-pdf' && !password.trim()) {
      setConversionError('É necessário definir uma senha para proteger o PDF');
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
      // Enhanced progress tracking for protect-pdf with messages
      const progressCallback = (progress: number) => {
        if (selectedConversion === 'protect-pdf') {
          // Detailed progress messages for PDF protection
          if (progress <= 5) {
            updateProgressWithMessage(progress, 'Enviando...');
          } else if (progress <= 15) {
            updateProgressWithMessage(progress, 'Processando...');
          } else if (progress <= 50) {
            updateProgressWithMessage(progress, 'Protegendo...');
          } else if (progress <= 85) {
            updateProgressWithMessage(progress, 'Aplicando senha...');
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

      const results = await convertFiles(selectedFiles, selectedConversion, progressCallback, { password });
      
      console.log('[ConversionTool] === CONVERSÃO CONCLUÍDA ===');
      console.log('- Arquivos convertidos:', results.length);
      console.log('- Detalhes:', results.map(r => ({ 
        name: r.file.name, 
        size: `${(r.file.size / 1024 / 1024).toFixed(2)} MB`,
        originalName: r.originalName 
      })));
      
      if (selectedConversion === 'protect-pdf') {
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
      
      // Mensagens de erro específicas e melhoradas
      let errorMessage = 'Erro desconhecido na conversão';
      
      if (error.message?.includes('muito grande')) {
        errorMessage = 'Arquivo muito grande para a API (limite: ~10MB)';
      } else if (error.message?.includes('PDF inválido')) {
        errorMessage = 'O arquivo PDF está inválido ou corrompido';
      } else if (error.message?.includes('não foi possível conectar') || error.message?.includes('CORS')) {
        errorMessage = 'Não foi possível conectar com a API de proteção. A API pode estar bloqueada pelo navegador ou indisponível.';
      } else if (error.message?.includes('tempo limite') || error.message?.includes('cancelada')) {
        errorMessage = 'A proteção demorou muito (mais de 2 minutos). Tente com um arquivo menor ou aguarde e tente novamente.';
      } else if (error.message?.includes('temporariamente indisponível') || error.message?.includes('dormindo')) {
        errorMessage = 'A API está temporariamente indisponível (pode estar "dormindo"). Aguarde 1-2 minutos e tente novamente.';
      } else if (error.message?.includes('servidor')) {
        errorMessage = 'Erro interno do servidor de proteção - tente novamente em alguns minutos';
      } else if (error.message?.includes('rede') || error.message?.includes('conexão')) {
        errorMessage = 'Problema de conectividade. Verifique sua internet e tente novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setConversionError(errorMessage);
      setConvertedFiles([]);
      setProgressMessage('');
    }
  }, [selectedFiles, selectedConversion, convertFiles, updateProgressWithMessage, password]);

  const clearFiles = useCallback(() => {
    console.log('[ConversionTool] Limpando arquivos');
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
    setProgressMessage('');
    setPassword('');
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
  const isProtectPdf = selectedConversion === 'protect-pdf';
  const isPngJpg = selectedConversion === 'png-jpg';
  const textColor = isProtectPdf ? 'text-white' : 'text-black';
  const showDownloadButton = convertedFiles.length > 0 && !isConverting;
  const currentProgress = selectedConversion === 'protect-pdf' ? localProgress : progress;

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
        return '.jpg,.jpeg';
      case 'split-pdf':
      case 'protect-pdf':
      case 'merge-pdf':
        return '.pdf';
      default:
        return '*';
    }
  };

  const getUploadText = () => {
    if (selectedConversion === 'merge-pdf') {
      return 'PDFs para mesclar';
    } else if (selectedConversion === 'protect-pdf') {
      return 'PDF para proteger';
    } else if (selectedConversion === 'split-pdf') {
      return 'PDF para dividir';
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
            multiple={selectedConversion !== 'protect-pdf' && selectedConversion !== 'split-pdf'}
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
              <Upload className={`w-6 h-6 ${textColor}`} />
            </div>
            <div>
              <p className={`text-base font-medium ${textColor} mb-1`}>
                Clique para selecionar {getUploadText()}
              </p>
              <p className={`text-sm ${textColor}`}>
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
            
            {/* Password input for PDF protection */}
            {selectedConversion === 'protect-pdf' && (
              <div className="mt-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha para proteger o PDF
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite uma senha segura"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta senha será necessária para abrir o PDF protegido
                </p>
              </div>
            )}
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
                          <span className={`text-xs font-bold ${isPngJpg ? 'text-black' : 'text-white'}`}>{fileNumber}</span>
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
                disabled={isConverting || (selectedConversion === 'protect-pdf' && !password.trim())}
                className={`font-medium transition-all duration-300 ${isPngJpg ? 'text-black' : 'text-white'}`}
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                {isConverting ? 'Convertendo...' : selectedConversion === 'protect-pdf' ? 'Proteger' : 'Converter'}
              </Button>
              <Button
                onClick={clearFiles}
                className={`font-medium transition-all duration-300 ${isPngJpg ? 'text-black' : 'text-white'}`}
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
                  className={`font-medium transition-all duration-300 ${isPngJpg ? 'text-black' : 'text-white'}`}
                  style={{ 
                    backgroundColor: conversionColor,
                    borderColor: conversionColor
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProtectPdf ? 'Baixar' : `Baixar (${convertedFiles.length} arquivo${convertedFiles.length > 1 ? 's' : ''})`}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Progress for PDF Protection */}
      {isConverting && (
        <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                {isProtectPdf ? 'Protegendo PDF' : 'Convertendo...'}
              </span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>
                {currentProgress}%
              </span>
            </div>
            
            {/* Enhanced progress bar with custom styling for PDF protection */}
            <div className="relative">
              <Progress 
                value={currentProgress} 
                className="h-2 bg-gray-200 rounded-full overflow-hidden" 
                indicatorColor={conversionColor} 
              />
              {isProtectPdf && (
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-transparent to-white/20 rounded-full transition-all duration-300 ease-in-out"
                  style={{ 
                    width: `${currentProgress}%`,
                    backgroundColor: conversionColor 
                  }}
                />
              )}
            </div>
            
            {/* Progress message for PDF protection */}
            {isProtectPdf && progressMessage && (
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
