
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export const convertHtmlToPdf = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const htmlContent = e.target?.result as string;
        
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '210mm'; // A4 width
        document.body.appendChild(tempDiv);
        
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Extract text content and add to PDF
        const textContent = tempDiv.innerText || tempDiv.textContent || '';
        const lines = pdf.splitTextToSize(textContent, pageWidth - 20);
        
        let y = 20;
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            pdf.addPage();
            y = 20;
          }
          pdf.text(line, 10, y);
          y += 7;
        });
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        // Convert to blob and create file
        const pdfBlob = pdf.output('blob');
        const fileName = file.name.replace(/\.[^/.]+$/, '.pdf');
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        resolve(pdfFile);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const convertCsvToJson = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const jsonData = JSON.stringify(results.data, null, 2);
          const fileName = file.name.replace(/\.[^/.]+$/, '.json');
          const jsonFile = new File([jsonData], fileName, { type: 'application/json' });
          resolve(jsonFile);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const convertCsvToExcel = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        
        // Parse CSV data
        const parsedData = Papa.parse(csvData, {
          header: false,
          skipEmptyLines: true
        });
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(parsedData.data as unknown[][]);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileName = file.name.replace(/\.[^/.]+$/, '.xlsx');
        const excelFile = new File([excelBuffer], fileName, { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        resolve(excelFile);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
