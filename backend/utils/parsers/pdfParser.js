import pdf from 'pdf-parse';

/**
 * Parse PDF file to text
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {string} Extracted text
 */
export const parsePdfToText = async (fileBuffer) => {
  try {
    const data = await pdf(fileBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error('PDF contains no extractable text');
    }

    console.log(`✅ Extracted ${text.length} characters from PDF`);
    return text;
  } catch (error) {
    console.error('❌ PDF parsing error:', error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Clean extracted text
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
export const cleanText = (text) => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
};
