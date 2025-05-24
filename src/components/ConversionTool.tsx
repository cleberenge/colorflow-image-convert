
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, FileAudio, FileVideo, FileX, FileText, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionToolProps {
  conversionType: string;
  conversionInfo: {
    id: string;
    label: string;
    from: string;
    to: string;
    icon?: string;
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
      case 'pdf-word':
      case 'split-pdf':
      case 'reduce-pdf':
        return '.pdf';
      case 'word-pdf':
        return '.doc,.docx';
      case 'video-mp3':
      case 'compress-video':
        return '.mp4,.mov,.avi,.webm';
      case 'merge-pdf':
        return '.pdf';
      default:
        return '*';
    }
  };

  // Get icon based on file type
  const getFileIcon = () => {
    if (conversionType.includes('video') || conversionType === 'compress-video') {
      return <FileVideo className="w-6 h-6 text-brand-blue" />;
    } else if (conversionType === 'video-mp3') {
      return <FileAudio className="w-6 h-6 text-brand-blue" />;
    } else if (conversionType.includes('pdf')) {
      return <File className="w-6 h-6 text-brand-blue" />;
    } else if (conversionType.includes('word')) {
      return <FileText className="w-6 h-6 text-brand-blue" />;
    } else {
      return <FileX className="w-6 h-6 text-brand-blue" />;
    }
  };

  // Get upload text based on conversion type
  const getUploadText = () => {
    if (conversionType === 'merge-pdf') {
      return 'Clique para selecionar vários arquivos PDF';
    }
    return `Clique para selecionar um arquivo ${conversionInfo.from}`;
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (conversionType === 'merge-pdf') {
        // For merge, we'll just use the first file for demo purposes
        setSelectedFile(files[0]);
        toast({
          title: "Arquivos selecionados",
          description: `${files.length} arquivo(s) PDF selecionado(s) para juntar.`,
        });
      } else {
        setSelectedFile(files[0]);
        toast({
          title: "Arquivo selecionado",
          description: `${files[0].name} está pronto para conversão.`,
        });
      }
      setConvertedFile(null);
    }
  }, [toast, conversionType]);

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
      const extension = conversionInfo.to.toLowerCase().replace(' comprimido', '').replace('s separados', '').replace(' único', '');
      
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
    <div className="flex flex-col items-center space-y-6 animate-fade-in mx-auto" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      {/* Upload Area */}
      <Card className="w-full p-6 border-2 border-dashed border-gray-300 bg-gray-50 hover:border-brand-blue hover:bg-gray-100 transition-all duration-300">
        <div className="text-center">
          <input
            type="file"
            accept={getAcceptedTypes()}
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            multiple={conversionType === 'merge-pdf'}
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-brand-blue" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 mb-2">
                {getUploadText()}
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
        <Card className="w-full p-5 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {getFileIcon()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              {isConverting ? 'Convertendo...' : `Converter para ${conversionInfo.to}`}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full p-5 bg-white border border-gray-200 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Convertendo...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Download */}
      {convertedFile && (
        <Card className="w-full p-5 bg-green-50 border border-green-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Conversão concluída!</p>
              <p className="text-sm text-gray-600">
                Seu arquivo {conversionInfo.to} está pronto para download
              </p>
            </div>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50 transition-all duration-300"
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
