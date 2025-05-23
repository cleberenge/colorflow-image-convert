
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, FileAudio, FileVideo, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionToolProps {
  conversionType: string;
  conversionInfo: {
    id: string;
    label: string;
    from: string;
    to: string;
  };
}

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType, conversionInfo }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Define accepted file types based on conversion type
  const getAcceptedTypes = () => {
    switch (conversionType) {
      case 'png-jpg':
        return '.png';
      case 'jpg-pdf':
        return '.jpg,.jpeg';
      case 'pdf-doc':
        return '.pdf';
      case 'doc-pdf':
        return '.doc,.docx';
      case 'video-mp3':
        return '.mp4,.mov,.avi,.webm';
      case 'compress-video':
        return '.mp4,.mov,.avi,.webm';
      default:
        return '*';
    }
  };

  // Get icon based on file type
  const getFileIcon = () => {
    if (conversionType.includes('video') || conversionType === 'compress-video') {
      return <FileVideo className="w-6 h-6 text-brand-yellow" />;
    } else if (conversionType === 'video-mp3') {
      return <FileAudio className="w-6 h-6 text-brand-yellow" />;
    } else {
      return <FileX className="w-6 h-6 text-brand-yellow" />;
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedFile(null);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} está pronto para conversão.`,
      });
    }
  }, [toast]);

  const handleConvert = useCallback(async () => {
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

      // Simulate conversion based on type
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would do the actual conversion here
      // For now, we'll just simulate success
      
      setProgress(100);
      setConvertedFile(URL.createObjectURL(selectedFile));
      
      toast({
        title: "Conversão concluída!",
        description: `Seu arquivo foi convertido para ${conversionInfo.to} com sucesso.`,
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
  }, [selectedFile, toast, conversionInfo.to]);

  const handleDownload = useCallback(() => {
    if (convertedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      
      // Set appropriate file extension based on conversion type
      let filename = selectedFile.name;
      const extension = conversionInfo.to.toLowerCase();
      
      // Replace old extension with new one
      const nameParts = filename.split('.');
      if (nameParts.length > 1) {
        nameParts.pop(); // Remove old extension
      }
      filename = `${nameParts.join('.')}.${extension}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: `Seu arquivo ${conversionInfo.to} está sendo baixado.`,
      });
    }
  }, [convertedFile, selectedFile, conversionInfo.to, toast]);

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Upload Area */}
      <Card className="w-full p-6 border-2 border-dashed border-brand-blue/30 bg-brand-teal/30 hover:border-brand-blue/50 transition-all duration-300">
        <div className="text-center">
          <input
            type="file"
            accept={getAcceptedTypes()}
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-brand-blue" />
            </div>
            <div>
              <p className="text-lg font-medium text-brand-cream mb-2">
                Clique para selecionar um arquivo {conversionInfo.from}
              </p>
              <p className="text-sm text-brand-cream/70">
                Ou arraste e solte seu arquivo aqui
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
        <Card className="w-full p-5 bg-white/10 backdrop-blur-sm border border-brand-blue/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-yellow/20 rounded-lg flex items-center justify-center">
              {getFileIcon()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-cream">{selectedFile.name}</p>
              <p className="text-sm text-brand-cream/70">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              className="bg-brand-yellow hover:bg-brand-yellow/90 text-brand-teal font-medium transition-all duration-300"
            >
              {isConverting ? 'Convertendo...' : `Converter para ${conversionInfo.to}`}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full p-5 bg-white/10 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-cream">Convertendo...</span>
              <span className="text-sm text-brand-cream/70">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Download */}
      {convertedFile && (
        <Card className="w-full p-5 bg-white/10 backdrop-blur-sm border border-green-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-cream">Conversão concluída!</p>
              <p className="text-sm text-brand-cream/70">
                Seu arquivo {conversionInfo.to} está pronto para download
              </p>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar {conversionInfo.to}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConversionTool;
