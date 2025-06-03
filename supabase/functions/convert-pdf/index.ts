
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PDF conversion request received');
    
    const formData = await req.formData();
    const conversionType = formData.get('conversionType') as string;
    
    console.log(`PDF operation type: ${conversionType}`);

    if (conversionType === 'jpg-pdf') {
      // Convert JPG to PDF
      const file = formData.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      const tempImagePath = `/tmp/input_${Date.now()}.jpg`;
      const outputPath = `/tmp/output_${Date.now()}.pdf`;
      
      const arrayBuffer = await file.arrayBuffer();
      await Deno.writeFile(tempImagePath, new Uint8Array(arrayBuffer));

      // Use ImageMagick to convert JPG to PDF
      const command = new Deno.Command("convert", {
        args: [tempImagePath, outputPath],
        stdout: "piped",
        stderr: "piped",
      });

      const process = command.spawn();
      const output = await process.output();

      // Clean up input
      try {
        await Deno.remove(tempImagePath);
      } catch (e) {
        console.log('Could not remove temp image file:', e);
      }

      if (!process.success) {
        const error = new TextDecoder().decode(output.stderr);
        throw new Error(`Image to PDF conversion failed: ${error}`);
      }

      const pdfBuffer = await Deno.readFile(outputPath);
      
      try {
        await Deno.remove(outputPath);
      } catch (e) {
        console.log('Could not remove temp PDF file:', e);
      }

      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}.pdf`;

      return new Response(pdfBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
        },
      });

    } else if (conversionType === 'merge-pdf') {
      // Merge multiple PDFs
      const files = formData.getAll('files') as File[];
      if (files.length < 2) {
        throw new Error('At least 2 PDF files required for merging');
      }

      const tempPaths: string[] = [];
      const outputPath = `/tmp/merged_${Date.now()}.pdf`;

      // Save all input files
      for (let i = 0; i < files.length; i++) {
        const tempPath = `/tmp/input_${Date.now()}_${i}.pdf`;
        const arrayBuffer = await files[i].arrayBuffer();
        await Deno.writeFile(tempPath, new Uint8Array(arrayBuffer));
        tempPaths.push(tempPath);
      }

      // Use PDFtk to merge
      const command = new Deno.Command("pdftk", {
        args: [...tempPaths, "cat", "output", outputPath],
        stdout: "piped",
        stderr: "piped",
      });

      const process = command.spawn();
      const output = await process.output();

      // Clean up input files
      for (const path of tempPaths) {
        try {
          await Deno.remove(path);
        } catch (e) {
          console.log('Could not remove temp file:', e);
        }
      }

      if (!process.success) {
        const error = new TextDecoder().decode(output.stderr);
        throw new Error(`PDF merge failed: ${error}`);
      }

      const mergedBuffer = await Deno.readFile(outputPath);
      
      try {
        await Deno.remove(outputPath);
      } catch (e) {
        console.log('Could not remove temp merged file:', e);
      }

      return new Response(mergedBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="merged.pdf"',
        },
      });

    } else if (conversionType === 'reduce-pdf') {
      // Compress PDF
      const file = formData.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      const tempInputPath = `/tmp/input_${Date.now()}.pdf`;
      const outputPath = `/tmp/compressed_${Date.now()}.pdf`;
      
      const arrayBuffer = await file.arrayBuffer();
      await Deno.writeFile(tempInputPath, new Uint8Array(arrayBuffer));

      // Use Ghostscript to compress PDF
      const command = new Deno.Command("gs", {
        args: [
          "-sDEVICE=pdfwrite",
          "-dCompatibilityLevel=1.4",
          "-dPDFSETTINGS=/screen", // /screen, /ebook, /printer, /prepress
          "-dNOPAUSE",
          "-dQUIET",
          "-dBATCH",
          `-sOutputFile=${outputPath}`,
          tempInputPath
        ],
        stdout: "piped",
        stderr: "piped",
      });

      const process = command.spawn();
      const output = await process.output();

      try {
        await Deno.remove(tempInputPath);
      } catch (e) {
        console.log('Could not remove temp input file:', e);
      }

      if (!process.success) {
        const error = new TextDecoder().decode(output.stderr);
        throw new Error(`PDF compression failed: ${error}`);
      }

      const compressedBuffer = await Deno.readFile(outputPath);
      
      try {
        await Deno.remove(outputPath);
      } catch (e) {
        console.log('Could not remove temp output file:', e);
      }

      const originalName = file.name.split('.')[0];
      const newFileName = `${originalName}_compressed.pdf`;

      return new Response(compressedBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${newFileName}"`,
        },
      });

    } else {
      throw new Error(`Unsupported PDF operation: ${conversionType}`);
    }

  } catch (error) {
    console.error('Error in PDF conversion:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
