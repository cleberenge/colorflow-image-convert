
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, File as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileConverter } from '@/hooks/useFileConverter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConversionIcon from '@/components/ConversionIcon';
import { getConversionColor } from '@/utils/conversionColors';

interface ConversionOption {
  value: string;
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
  conversionType?: string;
  conversionInfo?: ConversionInfo;
}

const conversionOptions: ConversionOption[] = [
  { value: 'png-jpg', label: 'PNG para JPG', description: 'Converter imagens PNG para o formato JPG.' },
  { value: 'jpg-pdf', label: 'JPG para PDF', description: 'Converter imagens JPG para o formato PDF.' },
  { value: 'pdf-word', label: 'PDF para Word', description: 'Converter arquivos PDF para o formato Word (DOCX).' },
  { value: 'word-pdf', label: 'Word para PDF', description: 'Converter arquivos Word (DOCX) para o formato PDF.' },
  { value: 'video-mp3', label: 'Vídeo para MP3', description: 'Extrair o áudio de arquivos de vídeo para o formato MP3.' },
  { value: 'compress-video', label: 'Comprimir Vídeo', description: 'Reduzir o tamanho de arquivos de vídeo para facilitar o compartilhamento.' },
  { value: 'split-pdf', label: 'Dividir PDF', description: 'Dividir um arquivo PDF em várias páginas ou intervalos de páginas.' },
  { value: 'merge-pdf', label: 'Juntar PDF', description: 'Combinar vários arquivos PDF em um único documento.' },
  { value: 'reduce-pdf', label: 'Reduzir PDF', description: 'Diminuir o tamanho de arquivos PDF, otimizando imagens e removendo dados desnecessários.' },
];

interface ConvertedFile {
  file: File;
  originalName: string;
}

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType: propConversionType, conversionInfo }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [selectedConversion, setSelectedConversion] = useState<string>(propConversionType || 'png-jpg');
  const { toast } = useToast();
  const { convertFiles, isConverting, progress } = useFileConverter();

  // Update selectedConversion when propConversionType changes
  useEffect(() => {
    if (propConversionType) {
      setSelectedConversion(propConversionType);
    }
  }, [propConversionType]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 25) {
      toast({
        title: "Limite excedido",
        description: "Selecione no máximo 25 arquivos.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(files);
    setConvertedFiles([]);
    toast({
      title: `${files.length} arquivo(s) selecionado(s)`,
      description: `Pronto(s) para conversão.`,
    });
  }, [toast]);

  const handleConversionChange = (value: string) => {
    setSelectedConversion(value);
    setConvertedFiles([]);
  };

  const convertSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione os arquivos para converter.",
        variant: "destructive",
      });
      return;
    }

    try {
      const results = await convertFiles(selectedFiles, selectedConversion);
      setConvertedFiles(results);
      toast({
        title: "Conversão concluída",
        description: `${results.length} arquivo(s) convertido(s) com sucesso.`,
      });
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter os arquivos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [selectedFiles, selectedConversion, convertFiles, toast]);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setConvertedFiles([]);
  }, []);

  const downloadZip = useCallback(async () => {
    if (convertedFiles.length === 0) return;

    try {
      console.log('Iniciando criação do ZIP...');
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (const { file } of convertedFiles) {
        console.log('Adicionando arquivo ao ZIP:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);
        
        // Verificar se o arquivo é válido
        if (file.size === 0) {
          console.warn('Arquivo vazio detectado:', file.name);
          continue;
        }
        
        try {
          // Ler o arquivo como blob primeiro para garantir integridade
          const blob = new Blob([file], { type: file.type });
          const arrayBuffer = await blob.arrayBuffer();
          
          console.log('Arquivo lido com sucesso:', file.name, 'Tamanho do buffer:', arrayBuffer.byteLength);
          
          // Adicionar ao ZIP sem compressão para evitar corrupção
          zip.file(file.name, arrayBuffer, { 
            binary: true,
            compression: 'STORE' // Sem compressão para manter integridade
          });
        } catch (fileError) {
          console.error('Erro ao processar arquivo:', file.name, fileError);
          // Adicionar arquivo de erro em vez de falhar completamente
          const errorContent = `Erro ao processar o arquivo: ${file.name}`;
          zip.file(`ERROR_${file.name}.txt`, errorContent);
        }
      }
      
      console.log('Gerando arquivo ZIP...');
      
      // Gerar ZIP com configurações otimizadas
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'STORE', // Sem compressão
        compressionOptions: {
          level: 0 // Nível 0 = sem compressão
        }
      });
      
      console.log('ZIP gerado com sucesso. Tamanho:', zipBlob.size);
      
      // Criar URL e fazer download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted-files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download concluído",
        description: `ZIP com ${convertedFiles.length} arquivo(s) baixado com sucesso.`,
      });
      
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao criar o arquivo ZIP.",
        variant: "destructive",
      });
    }
  }, [convertedFiles, toast]);

  // Get conversion color for styling
  const conversionColor = getConversionColor(selectedConversion);

  return (
    <div className="flex flex-col items-center space-y-8 animate-fade-in">
      {/* Upload Area */}
      <Card 
        className="w-full max-w-3xl p-8 border-2 border-dashed hover:border-opacity-60 transition-all duration-300"
        style={{ 
          backgroundColor: conversionColor,
          borderColor: conversionColor,
        }}
      >
        <div className="text-center">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-black" />
            </div>
            <div>
              <p className="text-xl font-medium text-black mb-2">
                Clique para selecionar até 25 arquivos
              </p>
              <p className="text-base text-black/80">
                ou arraste e solte aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Conversion Options */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-6 bg-white border border-gray-200">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Opções de Conversão</h2>
            <Select onValueChange={handleConversionChange} value={selectedConversion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de conversão" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="flex items-center space-x-2">
                    <ConversionIcon conversionType={option.value} className="w-5 h-5" />
                    <span>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {conversionOptions.find(option => option.value === selectedConversion)?.description}
            </p>
          </div>
        </Card>
      )}

      {/* Selected Files Info */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-6 bg-white border border-gray-200">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Arquivos Selecionados</h2>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-3">
              <Button
                onClick={convertSelectedFiles}
                disabled={isConverting}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-all duration-300"
              >
                {isConverting ? 'Convertendo...' : 'Converter Arquivos'}
              </Button>
              <Button
                onClick={clearFiles}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-all duration-300"
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-3xl p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Convertendo...</span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Download */}
      {convertedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Arquivos Convertidos</h2>
              <p className="text-sm text-gray-500">
                Baixe os arquivos convertidos individualmente ou todos juntos em um ZIP.
              </p>
            </div>
            <Button
              onClick={downloadZip}
              disabled={isConverting}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar ZIP
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConversionTool;
