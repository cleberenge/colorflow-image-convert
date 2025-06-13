
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
];

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType: propConversionType, conversionInfo }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>(propConversionType || 'png-jpg');
  const [conversionError, setConversionError] = useState<string | null>(null);
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
    
    setSelectedFiles(sortedFiles);
    setConvertedFiles([]);
    setConversionError(null);
  }, []);

  const handleConversionChange = (value: string) => {
    console.log('[ConversionTool] Tipo de conversão alterado para:', value);
    setSelectedConversion(value as ConversionType);
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
  };

  const convertSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) {
      console.log('[ConversionTool] Nenhum arquivo selecionado para conversão');
      return;
    }

    console.log('[ConversionTool] === INICIANDO CONVERSÃO ===');
    console.log('- Arquivos:', selectedFiles.length);
    console.log('- Tipo:', selectedConversion);
    
    setConversionError(null);
    setConvertedFiles([]); // Limpar arquivos convertidos anteriores

    try {
      const results = await convertFiles(selectedFiles, selectedConversion);
      
      console.log('[ConversionTool] === CONVERSÃO CONCLUÍDA ===');
      console.log('- Arquivos convertidos:', results.length);
      console.log('- Detalhes:', results.map(r => ({ name: r.file.name, size: r.file.size })));
      
      setConvertedFiles(results);
      
      if (results.length === 0) {
        console.warn('[ConversionTool] AVISO: Nenhum arquivo foi convertido!');
        setConversionError('Nenhum arquivo foi convertido. Tente novamente.');
      }
      
    } catch (error) {
      console.error('[ConversionTool] === ERRO NA CONVERSÃO ===');
      console.error('Erro:', error);
      setConversionError(error.message || 'Erro desconhecido na conversão');
      setConvertedFiles([]);
    }
  }, [selectedFiles, selectedConversion, convertFiles]);

  const clearFiles = useCallback(() => {
    console.log('[ConversionTool] Limpando arquivos');
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionError(null);
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

  const conversionColor = getConversionColor(selectedConversion);

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
      case 'reduce-pdf':
      case 'merge-pdf':
        return '.pdf';
      default:
        return '*';
    }
  };

  const isReducePdf = selectedConversion === 'reduce-pdf';
  const isPngJpg = selectedConversion === 'png-jpg';
  const textColor = isReducePdf ? 'text-white' : 'text-black';

  const getUploadText = () => {
    if (selectedConversion === 'merge-pdf') {
      return 'PDFs para mesclar';
    } else if (selectedConversion === 'reduce-pdf') {
      return 'PDF para reduzir';
    } else if (selectedConversion === 'split-pdf') {
      return 'PDF para dividir';
    } else {
      return 'até 25 arquivos';
    }
  };

  const showDownloadButton = convertedFiles.length > 0 && !isConverting;

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
                disabled={isConverting}
                className={`font-medium transition-all duration-300 ${isPngJpg ? 'text-black' : 'text-white'}`}
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                {isConverting ? 'Convertendo...' : 'Converter'}
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
                  Baixar ({convertedFiles.length} arquivo{convertedFiles.length > 1 ? 's' : ''})
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-3xl p-2 bg-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Convertendo...</span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorColor={conversionColor} />
          </div>
        </Card>
      )}

      {/* Error Message */}
      {conversionError && (
        <Card className="w-full max-w-3xl p-3 bg-red-50 border border-red-200">
          <div className="text-red-700 text-sm">
            <strong>Erro:</strong> {conversionError}
          </div>
        </Card>
      )}

      {/* Status de debug */}
      <div className="w-full max-w-3xl p-2 text-xs text-gray-500 bg-gray-50 rounded">
        <strong>Debug:</strong> {selectedFiles.length} selecionado{selectedFiles.length !== 1 ? 's' : ''} | 
        {convertedFiles.length} convertido{convertedFiles.length !== 1 ? 's' : ''} | 
        Convertendo: {isConverting ? 'Sim' : 'Não'} | 
        Botão visível: {showDownloadButton ? 'Sim' : 'Não'}
      </div>
    </div>
  );
};

export default ConversionTool;
