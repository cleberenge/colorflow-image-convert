
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
  | 'reduce-jpg'
  | 'reduce-png'
  | 'video-mp3'
  | 'svg-png'
  | 'jpg-webp'
  | 'svg-jpg'
  | 'html-pdf'
  | 'csv-json'
  | 'csv-excel';
