import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up pdfjs worker using cdnjs for browser runtime compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Parses uploaded PDF, DOCX, or TXT file and extracts readable plain text.
 */
export async function extractTextFromFile(file) {
  if (!file) throw new Error('No file selected.');

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return await file.text();
  }

  if (fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  if (fileName.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  }

  throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
}
