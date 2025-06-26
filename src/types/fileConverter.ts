
export interface ConvertedFile {
  file: File;
  originalName: string;
}

export type ConversionType = 
  | 'png-jpg' 
  | 'jpg-pdf' 
  | 'split-pdf' 
  | 'merge-pdf' 
  | 'reduce-pdf'
  | 'video-mp3'
  | 'svg-png'
  | 'jpg-webp'
  | 'svg-jpg'
  | 'html-pdf'
  | 'csv-json'
  | 'csv-excel';
