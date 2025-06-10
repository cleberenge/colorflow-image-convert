
import { useState } from 'react';
import { ConvertedFile } from '@/types/fileConverter';

// Declare global FFmpeg types
declare global {
  interface Window {
    FFmpeg: any;
    createFFmpeg: any;
    fetchFile: any;
  }
}

export const useFFmpegConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<any>(null);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        console.log(`Script already loaded: ${src}`);
        resolve();
        return;
      }

      console.log(`Loading script: ${src}`);
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log(`Script loaded successfully: ${src}`);
        resolve();
      };
      script.onerror = (error) => {
        console.error(`Failed to load script: ${src}`, error);
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });
  };

  const loadFFmpeg = async (): Promise<any> => {
    if (ffmpeg) {
      console.log('FFmpeg already loaded, returning existing instance');
      return ffmpeg;
    }

    try {
      console.log('Starting FFmpeg.wasm loading process...');
      
      // Load FFmpeg.wasm script from CDN with specific version
      await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js');
      
      // Wait for script to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!window.createFFmpeg) {
        throw new Error('createFFmpeg not available after loading script');
      }

      console.log('Creating FFmpeg instance...');
      const newFFmpeg = window.createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
        wasmPath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.wasm',
        workerPath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.worker.js',
      });

      console.log('Loading FFmpeg core...');
      await newFFmpeg.load();
      console.log('FFmpeg loaded successfully');

      setFFmpeg(newFFmpeg);
      return newFFmpeg;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error(`Falha ao carregar FFmpeg: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const loadFetchFile = async () => {
    if (window.fetchFile) {
      console.log('fetchFile already available');
      return;
    }

    console.log('Loading fetchFile...');
    await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!window.fetchFile) {
      console.warn('fetchFile not available, will use manual file reading');
    }
  };

  const convertVideoToMp3 = async (
    files: File[],
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];
    const progressPerFile = 70 / files.length;

    try {
      console.log('=== Starting MP3 conversion process ===');
      updateProgress(5);
      
      console.log('Loading FFmpeg...');
      const ffmpegInstance = await loadFFmpeg();
      updateProgress(10);

      console.log('Loading fetchFile...');
      await loadFetchFile();
      updateProgress(15);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 15 + (i * progressPerFile);
        
        console.log(`=== Converting file ${i + 1}/${files.length}: ${file.name} ===`);
        console.log(`File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        updateProgress(fileStartProgress);

        const inputFileName = `input_${Date.now()}_${i}.${file.name.split('.').pop()}`;
        const outputFileName = `output_${Date.now()}_${i}.mp3`;
        
        try {
          console.log(`Reading file: ${file.name}`);
          // Read file as ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          const fileData = new Uint8Array(arrayBuffer);
          
          console.log(`File data size: ${fileData.length} bytes`);
          console.log(`Writing file to FFmpeg FS: ${inputFileName}`);
          
          // Write input file to FFmpeg filesystem
          ffmpegInstance.FS('writeFile', inputFileName, fileData);
          updateProgress(fileStartProgress + (progressPerFile * 0.2));

          console.log(`Starting FFmpeg conversion for: ${inputFileName}`);
          
          // Run FFmpeg conversion with better error handling
          await ffmpegInstance.run(
            '-i', inputFileName,
            '-vn', // No video stream
            '-acodec', 'libmp3lame', // MP3 codec
            '-ab', '192k', // Higher bitrate for better quality
            '-ar', '44100', // Sample rate
            '-f', 'mp3', // Output format
            '-y', // Overwrite output file
            outputFileName
          );
          
          console.log(`FFmpeg conversion completed for: ${outputFileName}`);
          updateProgress(fileStartProgress + (progressPerFile * 0.8));

          // Read converted file
          console.log(`Reading converted file: ${outputFileName}`);
          const data = ffmpegInstance.FS('readFile', outputFileName);
          console.log(`Converted file size: ${data.length} bytes`);
          
          if (data.length === 0) {
            throw new Error('Arquivo convertido está vazio');
          }
          
          const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
          
          const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
          const newFileName = `${originalName}.mp3`;
          const convertedFile = new File([blob], newFileName, { type: 'audio/mpeg' });
          
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          // Clean up temporary files
          try {
            ffmpegInstance.FS('unlink', inputFileName);
            ffmpegInstance.FS('unlink', outputFileName);
            console.log(`Cleaned up temporary files for: ${file.name}`);
          } catch (cleanupError) {
            console.warn('Failed to cleanup temporary files:', cleanupError);
          }
          
          updateProgress(fileStartProgress + progressPerFile);
          console.log(`=== Successfully converted: ${newFileName} ===`);
          
        } catch (fileError) {
          console.error(`=== Error converting ${file.name}: ===`, fileError);
          throw new Error(`Erro ao converter ${file.name}: ${fileError instanceof Error ? fileError.message : 'Erro desconhecido'}`);
        }
      }

      updateProgress(100);
      console.log(`=== Conversion process completed successfully. ${convertedFiles.length} files converted ===`);
      return convertedFiles;
      
    } catch (error) {
      console.error('=== FFmpeg conversion error: ===', error);
      throw new Error(`Erro na conversão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsConverting(false);
    }
  };

  const compressVideo = async (
    files: File[],
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];
    const progressPerFile = 70 / files.length;

    try {
      console.log('=== Starting video compression process ===');
      updateProgress(5);
      
      const ffmpegInstance = await loadFFmpeg();
      updateProgress(10);

      await loadFetchFile();
      updateProgress(15);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 15 + (i * progressPerFile);
        
        console.log(`=== Compressing file ${i + 1}/${files.length}: ${file.name} ===`);
        updateProgress(fileStartProgress);

        const extension = file.name.split('.').pop() || 'mp4';
        const inputFileName = `input_${Date.now()}_${i}.${extension}`;
        const outputFileName = `output_${Date.now()}_${i}.${extension}`;
        
        try {
          // Read file as ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          const fileData = new Uint8Array(arrayBuffer);
          
          ffmpegInstance.FS('writeFile', inputFileName, fileData);
          updateProgress(fileStartProgress + (progressPerFile * 0.2));

          // Run FFmpeg compression
          await ffmpegInstance.run(
            '-i', inputFileName,
            '-vcodec', 'libx264',
            '-crf', '28',
            '-preset', 'fast',
            '-acodec', 'aac',
            '-b:a', '128k',
            '-y',
            outputFileName
          );
          updateProgress(fileStartProgress + (progressPerFile * 0.8));

          // Read compressed file
          const data = ffmpegInstance.FS('readFile', outputFileName);
          const blob = new Blob([data.buffer], { type: file.type });
          
          const originalName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${originalName}_compressed.${extension}`;
          const convertedFile = new File([blob], newFileName, { type: file.type });
          
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          // Clean up temporary files
          try {
            ffmpegInstance.FS('unlink', inputFileName);
            ffmpegInstance.FS('unlink', outputFileName);
          } catch (cleanupError) {
            console.warn('Failed to cleanup temporary files:', cleanupError);
          }
          
          updateProgress(fileStartProgress + progressPerFile);
          console.log(`=== Successfully compressed: ${newFileName} ===`);
          
        } catch (fileError) {
          console.error(`=== Error compressing ${file.name}: ===`, fileError);
          throw new Error(`Erro ao comprimir ${file.name}: ${fileError instanceof Error ? fileError.message : 'Erro desconhecido'}`);
        }
      }

      updateProgress(100);
      return convertedFiles;
      
    } catch (error) {
      console.error('=== Video compression error: ===', error);
      throw new Error(`Erro na compressão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsConverting(false);
    }
  };

  return { 
    convertVideoToMp3, 
    compressVideo,
    isConverting,
    loadFFmpeg
  };
};
