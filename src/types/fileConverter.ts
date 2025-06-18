
export interface ConvertedFile {
  file: File;
  originalName: string;
}

export type ConversionType = 
  | 'png-jpg' 
  | 'jpg-pdf' 
  | 'split-pdf' 
  | 'merge-pdf' 
  | 'protect-pdf';
