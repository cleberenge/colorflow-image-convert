
import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ConvertedFile } from '@/types/fileConverter';

export const useFFmpegConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);

  const loadFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg) return ffmpeg;

    const newFFmpeg = new FFmpeg();
    
    // Load FFmpeg with CDN URLs
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await newFFmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    setFFmpeg(newFFmpeg);
    return newFFmpeg;
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

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 20 + (i * progressPerFile);
        
        console.log(`Convertendo arquivo: ${file.name}`);
        updateProgress(fileStartProgress);

        // Escrever arquivo de entrada no sistema de arquivos virtual do FFmpeg
        const inputFileName = `input_${i}.${file.name.split('.').pop()}`;
        const outputFileName = `output_${i}.mp3`;
        
        await ffmpegInstance.writeFile(inputFileName, await fetchFile(file));
        updateProgress(fileStartProgress + (progressPerFile * 0.3));

        // Executar conversão FFmpeg
        await ffmpegInstance.exec([
          '-i', inputFileName,
          '-vn', // Sem vídeo
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-ar', '44100',
          '-f', 'mp3',
          outputFileName
        ]);
        updateProgress(fileStartProgress + (progressPerFile * 0.7));

        // Ler arquivo convertido
        const data = await ffmpegInstance.readFile(outputFileName);
        const blob = new Blob([data], { type: 'audio/mpeg' });
        
        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}.mp3`;
        const convertedFile = new File([blob], newFileName, { type: 'audio/mpeg' });
        
        convertedFiles.push({ file: convertedFile, originalName: file.name });
        
        // Limpar arquivos temporários
        await ffmpegInstance.deleteFile(inputFileName);
        await ffmpegInstance.deleteFile(outputFileName);
        
        updateProgress(fileStartProgress + progressPerFile);
        console.log(`Arquivo convertido: ${newFileName}`);
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

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStartProgress = 20 + (i * progressPerFile);
        
        console.log(`Comprimindo arquivo: ${file.name}`);
        updateProgress(fileStartProgress);

        const extension = file.name.split('.').pop() || 'mp4';
        const inputFileName = `input_${i}.${extension}`;
        const outputFileName = `output_${i}.${extension}`;
        
        await ffmpegInstance.writeFile(inputFileName, await fetchFile(file));
        updateProgress(fileStartProgress + (progressPerFile * 0.3));

        // Executar compressão FFmpeg
        await ffmpegInstance.exec([
          '-i', inputFileName,
          '-vcodec', 'libx264',
          '-crf', '28',
          '-preset', 'fast',
          '-acodec', 'aac',
          '-b:a', '128k',
          outputFileName
        ]);
        updateProgress(fileStartProgress + (progressPerFile * 0.7));

        // Ler arquivo comprimido
        const data = await ffmpegInstance.readFile(outputFileName);
        const blob = new Blob([data], { type: file.type });
        
        const originalName = file.name.split('.')[0];
        const newFileName = `${originalName}_compressed.${extension}`;
        const convertedFile = new File([blob], newFileName, { type: file.type });
        
        convertedFiles.push({ file: convertedFile, originalName: file.name });
        
        // Limpar arquivos temporários
        await ffmpegInstance.deleteFile(inputFileName);
        await ffmpegInstance.deleteFile(outputFileName);
        
        updateProgress(fileStartProgress + progressPerFile);
        console.log(`Arquivo comprimido: ${newFileName}`);
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
