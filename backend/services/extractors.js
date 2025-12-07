import pdf from 'pdf-parse';
import { readFileSync, unlinkSync } from 'fs';
import { extractTextFromImage } from './pplxService.js';

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('❌ PDF extraction error:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Extract text from image file using Perplexity Vision
 * @param {string} filePath - Path to image file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImageFile = async (filePath) => {
  try {
    return await extractTextFromImage(filePath);
  } catch (error) {
    console.error('❌ Image extraction error:', error.message);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

/**
 * Extract text from video (first frame) - simplified version
 * @param {string} filePath - Path to video file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromVideo = async (filePath) => {
  // For now, return a placeholder. Full implementation would require ffmpeg
  return 'Video processing not yet implemented. Please upload PDF or image files.';
};

/**
 * Extract text from file based on type
 * @param {string} filePath - Path to file
 * @param {string} mimetype - MIME type of file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromFile = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      return await extractTextFromPDF(filePath);
    } else if (mimetype.startsWith('image/')) {
      return await extractTextFromImageFile(filePath);
    } else if (mimetype.startsWith('video/')) {
      return await extractTextFromVideo(filePath);
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error('❌ File extraction error:', error.message);
    throw error;
  }
};

/**
 * Clean up temporary file
 * @param {string} filePath - Path to file
 */
export const cleanupFile = (filePath) => {
  try {
    unlinkSync(filePath);
    console.log(`🗑️  Cleaned up temporary file: ${filePath}`);
  } catch (error) {
    console.error('⚠️  Failed to cleanup file:', error.message);
  }
};

export default {
  extractTextFromPDF,
  extractTextFromImageFile,
  extractTextFromVideo,
  extractTextFromFile,
  cleanupFile,
};
