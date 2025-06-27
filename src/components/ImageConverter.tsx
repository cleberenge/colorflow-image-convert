
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertPngToJpg } from '@/utils/imageConverter';

const ImageConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Changed color to #7EBDC2 (light teal/cyan color)
  const conversionColor = '#7EBDC2';

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 25) {
      toast({
        title: "Limit exceeded",
        description: "Select up to 25 files maximum.",
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter(file => file.type === 'image/png');
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid format",
        description: "Please select only PNG files.",
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      // Sort files by name in ascending order
      const sortedFiles = validFiles.sort((a, b) => a.name.localeCompare(b.name));
      setSelectedFiles(sortedFiles);
      setConvertedFiles([]);
      setProgress(0);
      toast({
        title: `${sortedFiles.length} PNG file(s) selected`,
        description: `Ready for conversion.`,
      });
    }
  }, [toast]);

  const convertToJPG = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsConverting(true);
      setProgress(20);

      const convertedResults: File[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const jpgFile = await convertPngToJpg(file, 0.9);
        convertedResults.push(jpgFile);
        
        // Update progress
        const progressPercent = Math.round(((i + 1) / selectedFiles.length) * 80) + 20;
        setProgress(progressPercent);
      }

      setConvertedFiles(convertedResults);
      setProgress(100);

      toast({
        title: "Conversion completed!",
        description: `${selectedFiles.length} file(s) converted to JPG successfully.`,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion error",
        description: "An error occurred while converting the files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [selectedFiles, toast]);

  const downloadFiles = useCallback(async () => {
    if (convertedFiles.length === 0) return;

    if (convertedFiles.length === 1) {
      // Download single file
      const file = convertedFiles[0];
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your JPG file is being downloaded.",
      });
    } else {
      // Download multiple files as ZIP
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        for (const file of convertedFiles) {
          const arrayBuffer = await file.arrayBuffer();
          zip.file(file.name, arrayBuffer, { binary: true });
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted-images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download completed",
          description: `ZIP with ${convertedFiles.length} file(s) downloaded successfully.`,
        });
      } catch (error) {
        console.error('Error creating ZIP:', error);
        toast({
          title: "Download error",
          description: "An error occurred while creating the ZIP file.",
          variant: "destructive",
        });
      }
    }
  }, [convertedFiles, toast]);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setProgress(0);
  }, []);

  // Organize files in vertical columns
  const organizeFilesInColumns = (files: File[]) => {
    const filesPerColumn = 5;
    const numColumns = Math.ceil(files.length / filesPerColumn);
    const columns = [];
    
    for (let col = 0; col < numColumns; col++) {
      const columnFiles = [];
      for (let row = 0; row < filesPerColumn; row++) {
        const fileIndex = col * filesPerColumn + row;
        if (fileIndex < files.length) {
          columnFiles.push(files[fileIndex]);
        }
      }
      columns.push(columnFiles);
    }
    
    return columns;
  };

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      {/* Upload Area */}
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
            accept=".png"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Upload className="w-6 h-6" style={{ color: conversionColor }} />
            </div>
            <div>
              <p className="text-base font-medium mb-1" style={{ color: conversionColor }}>
                Click to select up to 25 PNG files
              </p>
              <p className="text-sm" style={{ color: conversionColor, opacity: 0.8 }}>
                or drag and drop here
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Selected Files Info */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Selected Files</h2>
            <div className="flex gap-4 overflow-x-auto">
              {organizeFilesInColumns(selectedFiles).map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-2 min-w-0 flex-1">
                  {column.map((file, fileIndex) => (
                    <div key={columnIndex * 5 + fileIndex} className="flex items-center gap-1 min-w-0">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-2.5 h-2.5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs truncate">{file.name}</p>
                        <p className="text-xs text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={convertToJPG}
                disabled={isConverting}
                className="text-white font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                {isConverting ? 'Converting...' : 'Convert to JPG'}
              </Button>
              <Button
                onClick={clearFiles}
                className="text-white font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: conversionColor,
                  borderColor: conversionColor
                }}
              >
                Clear
              </Button>
              {convertedFiles.length > 0 && (
                <Button
                  onClick={downloadFiles}
                  disabled={isConverting}
                  className="text-white font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: conversionColor,
                    borderColor: conversionColor
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {convertedFiles.length === 1 ? 'JPG' : 'ZIP'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      {isConverting && (
        <Card className="w-full max-w-3xl p-2 bg-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Converting...</span>
              <span className="text-sm font-medium" style={{ color: conversionColor }}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
