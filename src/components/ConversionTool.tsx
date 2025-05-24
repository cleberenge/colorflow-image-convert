import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, FileAudio, FileVideo, FileX, FileText, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor, getConversionColorHover } from '@/utils/conversionColors';

interface ConversionToolProps {
  conversionType: string;
  conversionInfo: {
    id: string;
    label: { pt: string; en: string; zh: string; };
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
  const { language, t } = useLanguage();

  const conversionColor = getConversionColor(conversionType);
  const conversionColorHover = getConversionColorHover(conversionType);

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
      return language === 'pt' ? 'Clique para selecionar vários arquivos PDF' :
             language === 'en' ? 'Click to select multiple PDF files' :
             '点击选择多个PDF文件';
    }
    return `${t.uploadText} ${conversionInfo.from}`;
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (conversionType === 'merge-pdf') {
        setSelectedFile(files[0]);
        toast({
          title: language === 'pt' ? "Arquivos selecionados" : language === 'en' ? "Files selected" : "文件已选择",
          description: `${files.length} ${t.filesSelected}`,
        });
      } else {
        setSelectedFile(files[0]);
        toast({
          title: language === 'pt' ? "Arquivo selecionado" : language === 'en' ? "File selected" : "文件已选择",
          description: `${files[0].name} ${t.fileSelected}`,
        });
      }
      setConvertedFile(null);
    }
  }, [toast, conversionType, t, language]);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProgress(100);
      setConvertedFile(URL.createObjectURL(selectedFile));
      
      toast({
        title: t.conversionComplete,
        description: t.conversionCompleteToast,
      });

    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: language === 'pt' ? "Erro na conversão" : language === 'en' ? "Conversion error" : "转换错误",
        description: language === 'pt' ? "Ocorreu um erro ao converter o arquivo." : language === 'en' ? "An error occurred while converting the file." : "转换文件时出错。",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, toast, t, language]);

  const handleDownload = useCallback(() => {
    if (convertedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      
      let filename = selectedFile.name;
      const extension = conversionInfo.to.toLowerCase().replace(' comprimido', '').replace('s separados', '').replace(' único', '');
      
      const nameParts = filename.split('.');
      if (nameParts.length > 1) {
        nameParts.pop();
      }
      filename = `${nameParts.join('.')}.${extension}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'pt' ? "Download iniciado" : language === 'en' ? "Download started" : "下载开始",
        description: `${conversionInfo.to} ${t.downloadStarted}`,
      });
    }
  }, [convertedFile, selectedFile, conversionInfo.to, toast, t, language]);

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in mx-auto" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      {/* Upload Area */}
      <Card 
        className="w-full p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300"
        style={{
          backgroundColor: conversionColor + '10',
          borderColor: isConverting ? conversionColor : undefined
        }}
      >
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
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: conversionColor + '20' }}
            >
              <Upload className="w-8 h-8" style={{ color: conversionColor }} />
            </div>
            <div>
              <p className="text-lg font-medium mb-2" style={{ color: conversionColor }}>
                {getUploadText()}
              </p>
              <p className="text-sm text-gray-600">
                {t.dragText}
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
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 border-none shadow-none"
            >
              {isConverting ? t.converting : `${t.convertTo} ${conversionInfo.to}`}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full p-5 bg-white border border-gray-200 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">{t.converting}</span>
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
              <p className="font-medium text-gray-800">{t.conversionComplete}</p>
              <p className="text-sm text-gray-600">
                {conversionInfo.to} {t.readyForDownload}
              </p>
            </div>
            <Button
              onClick={handleDownload}
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-300 border-none shadow-none"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.download} {conversionInfo.to}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConversionTool;
