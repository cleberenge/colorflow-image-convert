
export interface ConvertedFile {
  file: File;
  originalName: string;
}

export type ConversionType = 
  | 'png-jpg' 
  | 'jpg-pdf' 
  | 'pdf-word' 
  | 'word-pdf' 
  | 'video-mp3' 
  | 'compress-video' 
  | 'split-pdf' 
  | 'merge-pdf' 
  | 'reduce-pdf';
