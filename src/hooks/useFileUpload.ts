
import { useState, useCallback } from 'react';
import { ConversionType } from '@/types/fileConverter';

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 25) {
      return;
    }

    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('[FileUpload] Arquivos selecionados:', sortedFiles.map(f => f.name));
    console.log('[FileUpload] Tamanhos dos arquivos:', sortedFiles.map(f => `${f.name}: ${(f.size / 1024 / 1024).toFixed(2)} MB`));
    
    setSelectedFiles(sortedFiles);
  }, []);

  const clearFiles = useCallback(() => {
    console.log('[FileUpload] Limpando arquivos');
    setSelectedFiles([]);
  }, []);

  const getAcceptedFileTypes = (conversionType: ConversionType) => {
    switch (conversionType) {
      case 'png-jpg':
        return '.png';
      case 'reduce-png':
        return '.png';
      case 'jpg-pdf':
      case 'jpg-webp':
      case 'reduce-jpg':
        return '.jpg,.jpeg';
      case 'split-pdf':
      case 'reduce-pdf':
      case 'merge-pdf':
        return '.pdf';
      case 'svg-png':
      case 'svg-jpg':
        return '.svg';
      case 'html-pdf':
        return '.html,.htm';
      case 'csv-json':
      case 'csv-excel':
        return '.csv';
      default:
        return '*';
    }
  };

  const getUploadText = (conversionType: ConversionType) => {
    if (conversionType === 'merge-pdf') {
      return 'PDFs para mesclar';
    } else if (conversionType === 'reduce-pdf') {
      return 'PDF para reduzir';
    } else if (conversionType === 'reduce-jpg') {
      return 'imagens JPG para reduzir';
    } else if (conversionType === 'reduce-png') {
      return 'imagens PNG para reduzir';
    } else if (conversionType === 'split-pdf') {
      return 'PDF para dividir';
    } else if (conversionType === 'svg-png' || conversionType === 'svg-jpg') {
      return 'arquivos SVG';
    } else if (conversionType === 'html-pdf') {
      return 'arquivos HTML';
    } else if (conversionType === 'csv-json' || conversionType === 'csv-excel') {
      return 'arquivos CSV';
    } else if (conversionType === 'jpg-webp') {
      return 'imagens JPG';
    } else {
      return 'até 25 arquivos';
    }
  };

  return {
    selectedFiles,
    setSelectedFiles,
    handleFileSelect,
    clearFiles,
    getAcceptedFileTypes,
    getUploadText
  };
};
