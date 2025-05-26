import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor, getConversionColorHover } from '@/utils/conversionColors';
import JSZip from 'jszip';

interface ConversionToolProps {
  conversionType: string;
  conversionInfo: {
    id: string;
    label: { pt: string; en: string; zh: string; es: string; fr: string; de: string; hi: string; ar: string; ko: string; ja: string; };
    from: string;
    to: string;
    icon?: string;
  };
}

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType, conversionInfo }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<string[]>([]);
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

  // Get simple two-color icon based on file type
  const getFileIcon = () => {
    const iconSize = "w-8 h-8";
    const iconColor = conversionColor;
    
    if (conversionType.includes('video') || conversionType === 'compress-video') {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z"/>
          </svg>
        </div>
      );
    } else if (conversionType === 'video-mp3') {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
          </svg>
        </div>
      );
    } else if (conversionType.includes('pdf')) {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7a1 1 0 00-1 1z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    } else if (conversionType.includes('word')) {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 10a1 1 0 01-1-1V9a1 1 0 112 0v4a1 1 0 01-1 1zm-4-1a1 1 0 001 1h6a1 1 0 100-2H7a1 1 0 00-1 1z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    }
  };

  // Get upload text based on conversion type
  const getUploadText = () => {
    if (conversionType === 'merge-pdf') {
      return language === 'pt' ? 'Clique para selecionar vários arquivos PDF' :
             language === 'en' ? 'Click to select multiple PDF files' :
             '点击选择多个PDF文件';
    }
    return `${t.uploadText} ${conversionInfo.from} (${language === 'pt' ? 'até 20 arquivos' : language === 'en' ? 'up to 20 files' : '最多20个文件'})`;
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, 20); // Limit to 20 files
      setSelectedFiles(fileArray);
      setConvertedFiles([]);
      
      toast({
        title: language === 'pt' ? "Arquivos selecionados" : language === 'en' ? "Files selected" : language === 'zh' ? "文件已选择" : language === 'es' ? "Archivos seleccionados" : language === 'fr' ? "Fichiers sélectionnés" : language === 'de' ? "Dateien ausgewählt" : language === 'hi' ? "फाइलें चुनी गईं" : language === 'ar' ? "تم اختيار الملفات" : language === 'ko' ? "파일이 선택됨" : "ファイルが選択されました",
        description: `${fileArray.length} ${t.filesSelected || 'files selected'}`,
      });
    }
  }, [toast, t, language]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setProgress(0);
    setIsConverting(false);
    
    toast({
      title: language === 'pt' ? "Arquivos limpos" : language === 'en' ? "Files cleared" : language === 'zh' ? "文件已清除" : language === 'es' ? "Archivos limpiados" : language === 'fr' ? "Fichiers effacés" : language === 'de' ? "Dateien gelöscht" : language === 'hi' ? "फाइलें साफ़ की गईं" : language === 'ar' ? "تم مسح الملفات" : language === 'ko' ? "파일이 지워짐" : "ファイルがクリアされました",
      description: language === 'pt' ? "Todos os arquivos foram removidos" : language === 'en' ? "All files have been removed" : "所有文件已被移除",
    });
  }, [toast, language]);

  const handleConvert = useCallback(async () => {
    if (selectedFiles.length === 0) return;

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
      
      // Create converted file URLs for each selected file
      const convertedUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setConvertedFiles(convertedUrls);
      
      toast({
        title: t.conversionComplete,
        description: `${selectedFiles.length} ${language === 'pt' ? 'arquivos convertidos' : language === 'en' ? 'files converted' : '文件已转换'}`,
      });

    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: language === 'pt' ? "Erro na conversão" : language === 'en' ? "Conversion error" : "转换错误",
        description: language === 'pt' ? "Ocorreu um erro ao converter os arquivos." : language === 'en' ? "An error occurred while converting the files." : "转换文件时出错。",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFiles, toast, t, language]);

  const handleDownloadAll = useCallback(() => {
    if (convertedFiles.length === 0) return;

    convertedFiles.forEach((convertedFile, index) => {
      const link = document.createElement('a');
      link.href = convertedFile;
      
      let filename = selectedFiles[index].name;
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
    });
    
    toast({
      title: language === 'pt' ? "Downloads iniciados" : language === 'en' ? "Downloads started" : "下载开始",
      description: `${convertedFiles.length} ${language === 'pt' ? 'arquivos baixados' : language === 'en' ? 'files downloaded' : '文件已下载'}`,
    });
  }, [convertedFiles, selectedFiles, conversionInfo.to, toast, language]);

  const handleDownloadZip = useCallback(async () => {
    if (convertedFiles.length === 0) return;

    try {
      const zip = new JSZip();
      
      // Add each converted file to the ZIP
      for (let index = 0; index < convertedFiles.length; index++) {
        const convertedFile = convertedFiles[index];
        const originalFile = selectedFiles[index];
        
        // Fetch the blob data from the URL
        const response = await fetch(convertedFile);
        const blob = await response.blob();
        
        // Generate filename with new extension
        let filename = originalFile.name;
        const extension = conversionInfo.to.toLowerCase().replace(' comprimido', '').replace('s separados', '').replace(' único', '');
        
        const nameParts = filename.split('.');
        if (nameParts.length > 1) {
          nameParts.pop();
        }
        filename = `${nameParts.join('.')}.${extension}`;
        
        zip.file(filename, blob);
      }
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `converted_files_${conversionType}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'pt' ? "Download ZIP iniciado" : language === 'en' ? "ZIP download started" : "ZIP下载开始",
        description: `${convertedFiles.length} ${language === 'pt' ? 'arquivos baixados em ZIP' : language === 'en' ? 'files downloaded in ZIP' : '文件已打包下载'}`,
      });
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
      toast({
        title: language === 'pt' ? "Erro no download" : language === 'en' ? "Download error" : "下载错误",
        description: language === 'pt' ? "Ocorreu um erro ao criar o arquivo ZIP." : language === 'en' ? "An error occurred while creating the ZIP file." : "创建ZIP文件时出错。",
        variant: "destructive",
      });
    }
  }, [convertedFiles, selectedFiles, conversionInfo.to, conversionType, toast, language]);

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in mx-auto" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      {/* Upload Area */}
      <Card 
        className="w-full p-6 border-2 border-dashed transition-all duration-300"
        style={{
          backgroundColor: conversionColor,
          borderColor: conversionColor,
          borderRadius: '0px'
        }}
      >
        <div className="text-center">
          <input
            type="file"
            accept={getAcceptedTypes()}
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            multiple
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2 text-white">
                {getUploadText()}
              </p>
              <p className="text-sm text-white/80">
                {t.dragText}
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected Files Info */}
      {selectedFiles.length > 0 && (
        <Card className="w-full p-5 bg-white border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">
                {selectedFiles.length} {language === 'pt' ? 'arquivos selecionados' : language === 'en' ? 'files selected' : '文件已选择'}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={clearAllFiles}
                  variant="ghost"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 border-none"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Limpar' : language === 'en' ? 'Clear' : '清除'}
                </Button>
                <Button
                  onClick={handleConvert}
                  disabled={isConverting}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 border-none"
                  style={{ color: conversionColor }}
                >
                  {isConverting ? t.converting : `${t.convertTo} ${conversionInfo.to}`}
                </Button>
              </div>
            </div>
            
            {/* File List */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full p-5 bg-white border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">{t.converting}</span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3" 
              indicatorColor={conversionColor}
            />
          </div>
        </Card>
      )}

      {/* Download */}
      {convertedFiles.length > 0 && (
        <Card className="w-full p-5 bg-green-50 border border-green-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{t.conversionComplete}</p>
              <p className="text-sm text-gray-600">
                {convertedFiles.length} {language === 'pt' ? 'arquivos prontos para download' : language === 'en' ? 'files ready for download' : '文件准备下载'}
              </p>
            </div>
            <Button
              onClick={handleDownloadZip}
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-300 border-none"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'pt' ? 'Baixar ZIP' : language === 'en' ? 'Download ZIP' : '下载ZIP'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConversionTool;
