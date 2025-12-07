import fetch from 'node-fetch';
import FormData from 'form-data';
import { readFileSync } from 'fs';

/**
 * Perplexity API service for vision and text extraction
 */

const PPLX_API_KEY = process.env.PPLX_API_KEY;
const PPLX_API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Extract text from image using Perplexity Vision
 * @param {string} imagePath - Path to image file
 * @param {string} prompt - Optional prompt for extraction
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imagePath, prompt = 'Extract all text from this image, maintaining structure and formatting.') => {
  try {
    if (!PPLX_API_KEY) {
      throw new Error('PPLX_API_KEY environment variable is required');
    }

    // Read image and convert to base64
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await fetch(PPLX_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PPLX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('❌ Perplexity vision error:', error.message);
    throw error;
  }
};

/**
 * Extract structured data using Perplexity text completion
 * @param {string} text - Input text
 * @param {string} extractionPrompt - Prompt for extraction
 * @returns {Promise<object>} - Extracted structured data
 */
export const extractStructuredData = async (text, extractionPrompt) => {
  try {
    if (!PPLX_API_KEY) {
      throw new Error('PPLX_API_KEY environment variable is required');
    }

    const response = await fetch(PPLX_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PPLX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a data extraction assistant. Return only valid JSON.',
          },
          {
            role: 'user',
            content: `${extractionPrompt}\n\nText to process:\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('❌ Perplexity structured extraction error:', error.message);
    throw error;
  }
};

export default {
  extractTextFromImage,
  extractStructuredData,
};
