
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertPngToJpg } from '@/utils/imageConverter';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png') {
        setSelectedFile(file);
        setConvertedFile(null);
        setProgress(0);
        toast({
          title: "PNG arquivo selecionado",
          description: `${file.name} está pronto para conversão.`,
        });
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PNG.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const convertToJPG = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setIsConverting(true);
      setProgress(20);

      // Conversão client-side
      const jpgFile = await convertPngToJpg(selectedFile, 0.9);
      setProgress(80);

      setConvertedFile(jpgFile);
      setProgress(100);

      toast({
        title: "Conversão concluída!",
        description: `${selectedFile.name} foi convertido para JPG com sucesso.`,
      });
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [selectedFile, toast]);

  const downloadJPG = useCallback(() => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(convertedFile);
      link.download = convertedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Seu arquivo JPG está sendo baixado.",
      });
    }
  }, [convertedFile, toast]);

  const clearFiles = useCallback(() => {
    setSelectedFile(null);
    setConvertedFile(null);
    setProgress(0);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-8 animate-fade-in">
      {/* Upload Area */}
      <Card className="w-full max-w-2xl p-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300" style={{ backgroundColor: '#FDEE00' }}>
        <div className="text-center">
          <input
            type="file"
            accept=".png"
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
                Clique para selecionar arquivo PNG
              </p>
              <p className="text-base text-black/80">
                ou arraste e solte aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
        <Card className="w-full max-w-2xl p-6 bg-white border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="bg-orange-600 rounded-lg p-3 mb-4">
                <p className="font-medium text-white">{selectedFile.name}</p>
                <p className="text-sm text-white/80">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={convertToJPG}
                  disabled={isConverting}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-300"
                >
                  {isConverting ? 'Convertendo...' : 'Converter para JPG'}
                </Button>
                <Button
                  onClick={clearFiles}
                  variant="outline"
                  className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 transition-all duration-300"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Converted File */}
      {convertedFile && (
        <Card className="w-full max-w-2xl p-6 bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">{convertedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(convertedFile.size / 1024 / 1024).toFixed(2)} MB - JPG
                </p>
              </div>
            </div>
            <Button
              onClick={downloadJPG}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar JPG
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-2xl p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Convertendo...</span>
              <span className="text-sm text-orange-600 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
