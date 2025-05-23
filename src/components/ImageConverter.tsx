
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create canvas for conversion
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Fill with white background
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedImage(url);
              setProgress(100);
              resolve(url);
            } else {
              reject(new Error('Falha na conversão'));
            }
          }, 'image/jpeg', 0.95);
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile);
      });

      toast({
        title: "Conversão concluída!",
        description: "Seu arquivo PNG foi convertido para JPG com sucesso.",
      });

    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, toast]);

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

  return (
    <div className="flex flex-col items-center space-y-8 animate-fade-in">
      {/* Upload Area */}
      <Card className="w-full max-w-2xl p-8 border-2 border-dashed border-brand-blue/30 bg-brand-cream/50 hover:border-brand-blue/50 transition-all duration-300">
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
            <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-brand-blue" />
            </div>
            <div>
              <p className="text-lg font-medium text-brand-teal mb-2">
                Clique para selecionar um arquivo PNG
              </p>
              <p className="text-sm text-gray-600">
                Ou arraste e solte seu arquivo aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
        <Card className="w-full max-w-2xl p-6 bg-white border border-brand-blue/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-yellow/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-brand-yellow" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-teal">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={convertToJPG}
              disabled={isConverting}
              className="bg-brand-yellow hover:bg-brand-yellow/90 text-brand-teal font-medium transition-all duration-300"
            >
              {isConverting ? 'Convertendo...' : 'Converter para JPG'}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-2xl p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-teal">Convertendo...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Download */}
      {convertedImage && (
        <Card className="w-full max-w-2xl p-6 bg-white border border-green-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-teal">Conversão concluída!</p>
              <p className="text-sm text-gray-600">
                Seu arquivo JPG está pronto para download
              </p>
            </div>
            <Button
              onClick={downloadJPG}
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar JPG
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
