
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor, getConversionColorHover } from '@/utils/conversionColors';
import { useFileConverter } from '@/hooks/useFileConverter';
import JSZip from 'jszip';

interface ConversionToolProps {
  conversionType: string;
  conversionInfo: {
    id: string;
    label: { pt: string; en: string; zh: string; es: string; fr: string; de: string; hi: string; ar: string; ko: string; ja: string; ru: string; };
    from: string;
    to: string;
    icon?: string;
  };
}

const ConversionTool: React.FC<ConversionToolProps> = ({ conversionType, conversionInfo }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ file: File; originalName: string }[]>([]);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { convertFiles, isConverting, progress } = useFileConverter();

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

  const getMaxFiles = () => {
    if (['png-jpg', 'jpg-pdf', 'merge-pdf'].includes(conversionType)) {
      return 25;
    }
    return 10;
  };

  const getFileIcon = () => {
    const iconSize = "w-6 h-6";
    const iconColor = conversionColor;
    
    if (conversionType.includes('video') || conversionType === 'compress-video') {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z"/>
          </svg>
        </div>
      );
    } else if (conversionType === 'video-mp3') {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
          </svg>
        </div>
      );
    } else if (conversionType.includes('pdf')) {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 01-1-1V9a1 1 0 112 0v4a1 1 0 01-1 1zm-4-1a1 1 0 001 1h6a1 1 0 100-2H7a1 1 0 00-1 1z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    } else if (conversionType.includes('word')) {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 10a1 1 0 01-1-1V9a1 1 0 112 0v4a1 1 0 01-1 1zm-4-1a1 1 0 001 1h6a1 1 0 100-2H7a1 1 0 00-1 1z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className={`${iconSize} rounded-full flex items-center justify-center`} style={{ backgroundColor: iconColor }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        </div>
      );
    }
  };

  const getUploadText = () => {
    const maxFiles = getMaxFiles();
    if (conversionType === 'merge-pdf') {
      return language === 'pt' ? `Clique para selecionar até ${maxFiles} arquivos PDF` :
             language === 'en' ? `Click to select up to ${maxFiles} PDF files` :
             language === 'ru' ? `Нажмите, чтобы выбрать до ${maxFiles} PDF файлов` :
             `点击选择最多${maxFiles}个PDF文件`;
    }
    if (['png-jpg', 'jpg-pdf'].includes(conversionType)) {
      return language === 'pt' ? `Clique para selecionar até ${maxFiles} arquivos ${conversionInfo.from}` :
             language === 'en' ? `Click to select up to ${maxFiles} ${conversionInfo.from} files` :
             language === 'ru' ? `Нажмите, чтобы выбрать до ${maxFiles} ${conversionInfo.from} файлов` :
             `点击选择最多${maxFiles}个${conversionInfo.from}文件`;
    }
    return `${t.uploadText} ${conversionInfo.from}`;
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect called');
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Files found:', files.length);
      const fileArray = Array.from(files);
      const maxFiles = getMaxFiles();
      
      if (fileArray.length > maxFiles) {
        toast({
          title: language === 'pt' ? "Muitos arquivos" : 
                 language === 'en' ? "Too many files" : 
                 language === 'ru' ? "Слишком много файлов" :
                 "文件过多",
          description: language === 'pt' ? `Máximo de ${maxFiles} arquivos permitidos` : 
                      language === 'en' ? `Maximum ${maxFiles} files allowed` :
                      language === 'ru' ? `Максимально разрешено ${maxFiles} файлов` :
                      `最多允许${maxFiles}个文件`,
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFiles(fileArray);
      setConvertedFiles([]);
      console.log('Files set to state');
    }
    event.target.value = '';
  }, [language, toast]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    setConvertedFiles([]);
  }, []);

  const handleConvert = useCallback(async (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede propagação do evento
    if (selectedFiles.length === 0) return;

    console.log(`Starting real conversion for ${selectedFiles.length} files, type: ${conversionType}`);

    try {
      const converted = await convertFiles(selectedFiles, conversionType);
      setConvertedFiles(converted);
      
      console.log('Real conversion completed successfully');
    } catch (error) {
      console.error('Real conversion failed:', error);
    }
  }, [selectedFiles, conversionType, convertFiles]);

  const handleDownloadSingle = useCallback((convertedItem: { file: File; originalName: string }) => {
    try {
      console.log('Starting single file download:', convertedItem.file.name, 'Size:', convertedItem.file.size);
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(convertedItem.file);
      link.href = url;
      link.download = convertedItem.file.name;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('Single file download completed successfully');
      
      toast({
        title: language === 'pt' ? "Download iniciado" : language === 'en' ? "Download started" : language === 'ru' ? "Загрузка начата" : "下载开始",
        description: language === 'pt' ? "Arquivo baixado com sucesso" : language === 'en' ? "File downloaded successfully" : language === 'ru' ? "Файл успешно загружен" : "文件下载成功",
      });
    } catch (error) {
      console.error('Error in single file download:', error);
      toast({
        title: language === 'pt' ? "Erro no download" : language === 'en' ? "Download error" : language === 'ru' ? "Ошибка загрузки" : "下载错误",
        description: language === 'pt' ? "Ocorreu um erro ao baixar o arquivo." : language === 'en' ? "An error occurred while downloading the file." : language === 'ru' ? "Произошла ошибка при загрузке файла." : "下载文件时出错。",
        variant: "destructive",
      });
    }
  }, [toast, language]);

  const handleDownloadZip = useCallback(async () => {
    if (convertedFiles.length === 0) return;

    try {
      const zip = new JSZip();
      
      console.log('Iniciando criação do ZIP com', convertedFiles.length, 'arquivos');
      
      for (let index = 0; index < convertedFiles.length; index++) {
        const convertedItem = convertedFiles[index];
        const file = convertedItem.file;
        
        console.log('Adicionando arquivo ao ZIP:', file.name, 'Tamanho:', file.size);
        
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      }
      
      console.log('Gerando arquivo ZIP...');
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      console.log('ZIP gerado com sucesso. Tamanho:', zipBlob.size);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `converted_files_${conversionType}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      
      toast({
        title: language === 'pt' ? "Download ZIP iniciado" : language === 'en' ? "ZIP download started" : language === 'ru' ? "Загрузка ZIP начата" : "ZIP下载开始",
        description: `${convertedFiles.length} ${language === 'pt' ? 'arquivos baixados em ZIP' : language === 'en' ? 'files downloaded in ZIP' : language === 'ru' ? 'файлов загружено в ZIP' : '文件已打包下载'}`,
      });
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
      toast({
        title: language === 'pt' ? "Erro no download" : language === 'en' ? "Download error" : language === 'ru' ? "Ошибка загрузки" : "下载错误",
        description: language === 'pt' ? "Ocorreu um erro ao criar o arquivo ZIP." : language === 'en' ? "An error occurred while creating the ZIP file." : language === 'ru' ? "Произошла ошибка при создании ZIP файла." : "创建ZIP文件时出错。",
        variant: "destructive",
      });
    }
  }, [convertedFiles, conversionType, toast, language]);

  const handleLabelClick = useCallback((event: React.MouseEvent) => {
    console.log('Label clicked');
    event.preventDefault();
    const input = document.getElementById('file-input') as HTMLInputElement;
    if (input) {
      console.log('Input found, triggering click');
      input.click();
    } else {
      console.log('Input not found');
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in mx-auto" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      {/* Upload Area */}
      <div 
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
          <div
            onClick={handleLabelClick}
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
            
            {/* Nova área integrada para controles e arquivos selecionados */}
            {selectedFiles.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Exibir nomes dos arquivos selecionados */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">
                    {language === 'pt' ? 'Arquivos selecionados:' : 
                     language === 'en' ? 'Selected files:' : 
                     language === 'ru' ? 'Выбранные файлы:' : 
                     '已选择文件:'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/10 rounded text-sm">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {getFileIcon()}
                          <div className="min-w-0 flex-1">
                            <p className="text-white truncate font-medium">{file.name}</p>
                            <p className="text-white/70 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-white/70 hover:text-white p-1 h-auto ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Controles alinhados horizontalmente: Converter | Baixar | Limpar */}
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 border border-white/30 px-4 py-2"
                  >
                    {isConverting ? t.converting : `${t.convertTo} ${conversionInfo.to}`}
                  </Button>
                  
                  {convertedFiles.length > 0 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        convertedFiles.length === 1 ? handleDownloadSingle(convertedFiles[0]) : handleDownloadZip();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 border border-white/30 px-4 py-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {convertedFiles.length === 1 ? 
                        (language === 'pt' ? 'Baixar' : language === 'en' ? 'Download' : language === 'ru' ? 'Скачать' : '下载') :
                        (language === 'pt' ? 'Baixar ZIP' : language === 'en' ? 'Download ZIP' : language === 'ru' ? 'Скачать ZIP' : '下载ZIP')
                      }
                    </Button>
                  )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFiles();
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 border border-white/30 px-4 py-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Limpar' : language === 'en' ? 'Clear' : language === 'ru' ? 'Очистить' : '清除'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      {isConverting && (
        <div className="w-full p-5 bg-white border-0">
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
        </div>
      )}

      {/* Success message */}
      {convertedFiles.length > 0 && (
        <div className="w-full p-5 bg-green-50 border-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{t.conversionComplete}</p>
              <p className="text-sm text-gray-600">
                {convertedFiles.length} {language === 'pt' ? 'arquivos prontos para download' : language === 'en' ? 'files ready for download' : language === 'ru' ? 'файлов готово к скачиванию' : '文件准备下载'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionTool;
