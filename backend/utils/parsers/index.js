import { parsePdfToText, cleanText } from './pdfParser.js';
import { parseExcelToJson, excelJsonToText, parseCsvToText } from './excelParser.js';

/**
 * Detect file type and parse accordingly
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimetype - File MIME type
 * @param {string} filename - Original filename
 * @returns {string} Extracted text
 */
export const parseFile = async (fileBuffer, mimetype, filename) => {
  try {
    let extractedText = '';

    // Detect file type
    if (mimetype === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
      // Parse PDF
      const rawText = await parsePdfToText(fileBuffer);
      extractedText = cleanText(rawText);
    } 
    else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimetype === 'application/vnd.ms-excel' ||
      filename.toLowerCase().endsWith('.xlsx') ||
      filename.toLowerCase().endsWith('.xls')
    ) {
      // Parse Excel
      const jsonData = parseExcelToJson(fileBuffer);
      extractedText = excelJsonToText(jsonData);
    }
    else if (mimetype === 'text/csv' || filename.toLowerCase().endsWith('.csv')) {
      // Parse CSV
      extractedText = parseCsvToText(fileBuffer);
    }
    else {
      throw new Error(`Unsupported file type: ${mimetype || filename}`);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the file');
    }

    return extractedText;
  } catch (error) {
    console.error('❌ File parsing error:', error.message);
    throw error;
  }
};

export { parsePdfToText, parseExcelToJson, excelJsonToText, parseCsvToText };
