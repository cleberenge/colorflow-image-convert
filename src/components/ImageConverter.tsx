
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileConverter } from '@/hooks/useFileConverter';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { convertFiles, isConverting, progress } = useFileConverter();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png') {
        setSelectedFile(file);
        setConvertedImage(null);
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
      const convertedFiles = await convertFiles([selectedFile], 'png-jpg');
      
      if (convertedFiles && convertedFiles.length > 0) {
        const convertedFile = convertedFiles[0].file;
        const url = URL.createObjectURL(convertedFile);
        setConvertedImage(url);
      }
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [selectedFile, convertFiles, toast]);

  const downloadJPG = useCallback(() => {
    if (convertedImage && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedImage;
      link.download = selectedFile.name.replace('.png', '.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Seu arquivo JPG está sendo baixado.",
      });
    }
  }, [convertedImage, selectedFile, toast]);

  const clearFiles = useCallback(() => {
    setSelectedFile(null);
    setConvertedImage(null);
    if (convertedImage) {
      URL.revokeObjectURL(convertedImage);
    }
  }, [convertedImage]);

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
              <p className="text-lg font-medium text-black mb-2">
                Clique para selecionar um arquivo PNG
              </p>
              <p className="text-sm text-black/80">
                Ou arraste e solte seu arquivo aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
        <Card className="w-full max-w-2xl p-6 bg-black border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{selectedFile.name}</p>
              <p className="text-sm text-white/80">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={convertToJPG}
                disabled={isConverting}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all duration-300"
              >
                {isConverting ? 'Convertendo...' : 'Converter'}
              </Button>
              <Button
                onClick={clearFiles}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Limpar
              </Button>
              {convertedImage && (
                <Button
                  onClick={downloadJPG}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-2xl p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Convertendo...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorColor="#FDEE00" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
