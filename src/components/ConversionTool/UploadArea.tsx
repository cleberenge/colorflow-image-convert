
import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { ConversionType } from '@/types/fileConverter';

interface UploadAreaProps {
  conversionColor: string;
  uploadTextColor: string;
  uploadText: string;
  acceptedFileTypes: string;
  allowMultiple: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  conversionColor,
  uploadTextColor,
  uploadText,
  acceptedFileTypes,
  allowMultiple,
  onFileSelect
}) => {
  return (
    <Card 
      className="w-full max-w-3xl p-2 border-2 border-dashed hover:border-opacity-60 transition-all duration-300"
      style={{ 
        backgroundColor: conversionColor,
        borderColor: conversionColor,
      }}
    >
      <div className="text-center">
        <input
          type="file"
          multiple={allowMultiple}
          accept={acceptedFileTypes}
          onChange={onFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
            <Upload 
              className="w-6 h-6"
              style={{ color: uploadTextColor }}
            />
          </div>
          <div>
            <p 
              className="text-base font-medium mb-1"
              style={{ color: uploadTextColor }}
            >
              Clique para selecionar {uploadText}
            </p>
            <p 
              className="text-sm"
              style={{ color: uploadTextColor }}
            >
              ou arraste e solte aqui
            </p>
          </div>
        </label>
      </div>
    </Card>
  );
};

export default UploadArea;
