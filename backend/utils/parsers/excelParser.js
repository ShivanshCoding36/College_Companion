import XLSX from 'xlsx';

/**
 * Parse Excel file to JSON
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Object} Converted JSON data
 */
export const parseExcelToJson = (fileBuffer) => {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!jsonData || jsonData.length === 0) {
      throw new Error('Excel file contains no data');
    }

    console.log(`✅ Extracted ${jsonData.length} rows from Excel`);
    return jsonData;
  } catch (error) {
    console.error('❌ Excel parsing error:', error.message);
    throw new Error(`Failed to parse Excel: ${error.message}`);
  }
};

/**
 * Convert Excel JSON to text
 * @param {Object} jsonData - Excel JSON data
 * @returns {string} Formatted text
 */
export const excelJsonToText = (jsonData) => {
  try {
    let text = '';

    jsonData.forEach((row, index) => {
      text += `Row ${index + 1}:\n`;
      Object.entries(row).forEach(([key, value]) => {
        text += `  ${key}: ${value}\n`;
      });
      text += '\n';
    });

    return text.trim();
  } catch (error) {
    console.error('❌ Excel to text conversion error:', error.message);
    throw error;
  }
};

/**
 * Parse CSV buffer to text
 * @param {Buffer} fileBuffer - CSV file buffer
 * @returns {string} CSV content as text
 */
export const parseCsvToText = (fileBuffer) => {
  try {
    const text = fileBuffer.toString('utf-8');
    
    if (!text || text.trim().length === 0) {
      throw new Error('CSV file is empty');
    }

    console.log(`✅ Extracted ${text.length} characters from CSV`);
    return text;
  } catch (error) {
    console.error('❌ CSV parsing error:', error.message);
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
};
