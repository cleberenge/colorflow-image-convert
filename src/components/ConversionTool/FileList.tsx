
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { organizeFilesInColumns } from '@/utils/fileOrganization';
import { ConvertedFile } from '@/types/fileConverter';

interface FileListProps {
  selectedFiles: File[];
  convertedFiles: ConvertedFile[];
  conversionColor: string;
  buttonTextColor: string;
  fileNumberColor: string;
  isConverting: boolean;
  showDownloadButton: boolean;
  onConvert: () => void;
  onClear: () => void;
  onDownload: () => void;
}

const FileList: React.FC<FileListProps> = ({
  selectedFiles,
  conversionColor,
  buttonTextColor,
  fileNumberColor,
  isConverting,
  showDownloadButton,
  onConvert,
  onClear,
  onDownload
}) => {
  return (
    <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-gray-800">Arquivos Selecionados</h2>
        <div className="flex gap-4 overflow-x-auto">
          {organizeFilesInColumns(selectedFiles).map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-2 min-w-0 flex-1">
              {column.map((file, fileIndex) => {
                const fileNumber = columnIndex * 5 + fileIndex + 1;
                return (
                  <div key={columnIndex * 5 + fileIndex} className="flex items-center gap-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: conversionColor }}
                    >
                      <span 
                        className="text-xs font-bold"
                        style={{ color: fileNumberColor }}
                      >
                        {fileNumber}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-xs truncate">{file.name}</p>
                      <p className="text-xs text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 flex-wrap">
          <Button
            onClick={onConvert}
            disabled={isConverting}
            className="font-medium transition-all duration-300"
            style={{ 
              backgroundColor: conversionColor,
              borderColor: conversionColor,
              color: buttonTextColor
            }}
          >
            {isConverting ? 'Convertendo...' : 'Converter'}
          </Button>
          <Button
            onClick={onClear}
            className="font-medium transition-all duration-300"
            style={{ 
              backgroundColor: conversionColor,
              borderColor: conversionColor,
              color: buttonTextColor
            }}
          >
            Limpar
          </Button>
          {showDownloadButton && (
            <Button
              onClick={onDownload}
              className="font-medium transition-all duration-300"
              style={{ 
                backgroundColor: conversionColor,
                borderColor: conversionColor,
                color: buttonTextColor
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FileList;
