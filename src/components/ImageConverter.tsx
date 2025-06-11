
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertPngToJpg } from '@/utils/imageConverter';
import { getConversionColor } from '@/utils/conversionColors';

const ImageConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Get conversion color for PNG to JPG
  const conversionColor = getConversionColor('png-jpg');

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

    const validFiles = files.filter(file => file.type === 'image/png');
    if (validFiles.length !== files.length) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos PNG.",
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      // Ordenar arquivos por nome em ordem crescente
      const sortedFiles = validFiles.sort((a, b) => a.name.localeCompare(b.name));
      setSelectedFiles(sortedFiles);
      setConvertedFiles([]);
      setProgress(0);
      toast({
        title: `${sortedFiles.length} arquivo(s) PNG selecionado(s)`,
        description: `Pronto(s) para conversão.`,
      });
    }
  }, [toast]);

  const convertToJPG = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsConverting(true);
      setProgress(20);

      const convertedResults: File[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const jpgFile = await convertPngToJpg(file, 0.9);
        convertedResults.push(jpgFile);
        
        // Update progress
        const progressPercent = Math.round(((i + 1) / selectedFiles.length) * 80) + 20;
        setProgress(progressPercent);
      }

      setConvertedFiles(convertedResults);
      setProgress(100);

      toast({
        title: "Conversão concluída!",
        description: `${selectedFiles.length} arquivo(s) convertido(s) para JPG com sucesso.`,
      });
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter os arquivos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [selectedFiles, toast]);

  const downloadFiles = useCallback(async () => {
    if (convertedFiles.length === 0) return;

    if (convertedFiles.length === 1) {
      // Download single file
      const file = convertedFiles[0];
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Seu arquivo JPG está sendo baixado.",
      });
    } else {
      // Download multiple files as ZIP
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        for (const file of convertedFiles) {
          const arrayBuffer = await file.arrayBuffer();
          zip.file(file.name, arrayBuffer, { binary: true });
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted-images.zip';
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
    }
  }, [convertedFiles, toast]);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setProgress(0);
  }, []);

  // Organizar arquivos em colunas verticais
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
            accept=".png"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-base font-medium text-black mb-1">
                Clique para selecionar até 25 arquivos PNG
              </p>
              <p className="text-sm text-black/80">
                ou arraste e solte aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected Files Info */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Arquivos Selecionados</h2>
            <div className="flex gap-4 overflow-x-auto">
              {organizeFilesInColumns(selectedFiles).map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-2 min-w-0 flex-1">
                  {column.map((file, fileIndex) => (
                    <div key={columnIndex * 5 + fileIndex} className="flex items-center gap-1 min-w-0">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-2.5 h-2.5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs truncate">{file.name}</p>
                        <p className="text-xs text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={convertToJPG}
                disabled={isConverting}
                className="text-black font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                {isConverting ? 'Convertendo...' : 'Converter para JPG'}
              </Button>
              <Button
                onClick={clearFiles}
                className="text-black font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                Limpar
              </Button>
              {convertedFiles.length > 0 && (
                <Button
                  onClick={downloadFiles}
                  disabled={isConverting}
                  className="text-black font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: conversionColor,
                    borderColor: conversionColor
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar {convertedFiles.length === 1 ? 'JPG' : 'ZIP'}
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
    </div>
  );
};

export default ImageConverter;
