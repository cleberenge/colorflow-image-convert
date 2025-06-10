
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
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const loadFFmpeg = async (): Promise<any> => {
    if (ffmpeg) return ffmpeg;

    try {
      console.log('Loading FFmpeg.wasm from CDN...');
      
      // Load FFmpeg.wasm script
      await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js');
      
      // Wait a bit for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!window.createFFmpeg) {
        throw new Error('FFmpeg.wasm failed to load from CDN');
      }

      console.log('Creating FFmpeg instance...');
      const newFFmpeg = window.createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js',
      });

      console.log('Loading FFmpeg...');
      await newFFmpeg.load();
      console.log('FFmpeg loaded successfully');

      setFFmpeg(newFFmpeg);
      return newFFmpeg;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Não foi possível carregar o FFmpeg. Verifique sua conexão com a internet.');
    }
  };

  const convertVideoToMp3 = async (
    files: File[],
    updateProgress: (progress: number) => void
  ): Promise<ConvertedFile[]> => {
    setIsConverting(true);
    const convertedFiles: ConvertedFile[] = [];
    const progressPerFile = 80 / files.length;

    try {
      updateProgress(10);
      console.log('Carregando FFmpeg...');
      const ffmpegInstance = await loadFFmpeg();
      updateProgress(20);

      // Load fetchFile if not available
      if (!window.fetchFile) {
        await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 20 + (i * progressPerFile);
        
        console.log(`Convertendo arquivo: ${file.name}`);
        updateProgress(fileStartProgress);

        const inputFileName = `input_${i}.${file.name.split('.').pop()}`;
        const outputFileName = `output_${i}.mp3`;
        
        try {
          // Write input file
          const fileData = window.fetchFile ? 
            await window.fetchFile(file) : 
            new Uint8Array(await file.arrayBuffer());
          
          ffmpegInstance.FS('writeFile', inputFileName, fileData);
          updateProgress(fileStartProgress + (progressPerFile * 0.3));

          // Run FFmpeg conversion
          await ffmpegInstance.run(
            '-i', inputFileName,
            '-vn', // No video
            '-acodec', 'libmp3lame',
            '-ab', '128k',
            '-ar', '44100',
            '-f', 'mp3',
            outputFileName
          );
          updateProgress(fileStartProgress + (progressPerFile * 0.7));

          // Read converted file
          const data = ffmpegInstance.FS('readFile', outputFileName);
          const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
          
          const originalName = file.name.split('.')[0];
          const newFileName = `${originalName}.mp3`;
          const convertedFile = new File([blob], newFileName, { type: 'audio/mpeg' });
          
          convertedFiles.push({ file: convertedFile, originalName: file.name });
          
          // Clean up temporary files
          try {
            ffmpegInstance.FS('unlink', inputFileName);
            ffmpegInstance.FS('unlink', outputFileName);
          } catch (cleanupError) {
            console.warn('Failed to cleanup temporary files:', cleanupError);
          }
          
          updateProgress(fileStartProgress + progressPerFile);
          console.log(`Arquivo convertido: ${newFileName}`);
        } catch (fileError) {
          console.error(`Erro ao converter ${file.name}:`, fileError);
          throw new Error(`Erro ao converter ${file.name}: ${fileError.message}`);
        }
      }

      return convertedFiles;
    } catch (error) {
      console.error('Erro na conversão FFmpeg:', error);
      throw new Error(`Erro ao converter vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
    const progressPerFile = 80 / files.length;

    try {
      updateProgress(10);
      console.log('Carregando FFmpeg...');
      const ffmpegInstance = await loadFFmpeg();
      updateProgress(20);

      // Load fetchFile if not available
      if (!window.fetchFile) {
        await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 20 + (i * progressPerFile);
        
        console.log(`Comprimindo arquivo: ${file.name}`);
        updateProgress(fileStartProgress);

        const extension = file.name.split('.').pop() || 'mp4';
        const inputFileName = `input_${i}.${extension}`;
        const outputFileName = `output_${i}.${extension}`;
        
        try {
          // Write input file
          const fileData = window.fetchFile ? 
            await window.fetchFile(file) : 
            new Uint8Array(await file.arrayBuffer());
          
          ffmpegInstance.FS('writeFile', inputFileName, fileData);
          updateProgress(fileStartProgress + (progressPerFile * 0.3));

          // Run FFmpeg compression
          await ffmpegInstance.run(
            '-i', inputFileName,
            '-vcodec', 'libx264',
            '-crf', '28',
            '-preset', 'fast',
            '-acodec', 'aac',
            '-b:a', '128k',
            outputFileName
          );
          updateProgress(fileStartProgress + (progressPerFile * 0.7));

          // Read compressed file
          const data = ffmpegInstance.FS('readFile', outputFileName);
          const blob = new Blob([data.buffer], { type: file.type });
          
          const originalName = file.name.split('.')[0];
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
          console.log(`Arquivo comprimido: ${newFileName}`);
        } catch (fileError) {
          console.error(`Erro ao comprimir ${file.name}:`, fileError);
          throw new Error(`Erro ao comprimir ${file.name}: ${fileError.message}`);
        }
      }

      return convertedFiles;
    } catch (error) {
      console.error('Erro na compressão FFmpeg:', error);
      throw new Error(`Erro ao comprimir vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
