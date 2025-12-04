import Groq from 'groq-sdk';
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';

let groqClient;

/**
 * Initialize Groq client
 */
export const initializeGroqClient = () => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    groqClient = new Groq({
      apiKey: apiKey
    });

    console.log('✅ Groq client initialized successfully');
    return groqClient;
  } catch (error) {
    console.error('❌ Groq initialization failed:', error.message);
    throw error;
  }
};

// Backward compatibility
export const initializeGroq = initializeGroqClient;

/**
 * Get Groq client instance
 */
export const getGroqClient = () => {
  if (!groqClient) {
    throw new Error('Groq client not initialized. Call initializeGroqClient() first.');
  }
  return groqClient;
};

/**
 * Extract text from uploaded file (PDF, CSV, XLSX, DOCX)
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimetype - File MIME type
 * @param {string} filename - Original filename
 * @returns {string} Extracted text
 */
export const extractTextFromFile = async (fileBuffer, mimetype, filename) => {
  try {
    // Handle PDF files
    if (mimetype === 'application/pdf' || filename.endsWith('.pdf')) {
      const data = await pdfParse(fileBuffer);
      return cleanText(data.text);
    }
    
    // Handle Excel files (.xlsx, .xls)
    if (mimetype.includes('spreadsheet') || filename.match(/\.(xlsx?|csv)$/i)) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      // Convert to readable text
      const text = jsonData
        .map(row => row.join(' | '))
        .join('\n');
      
      return cleanText(text);
    }
    
    // Handle CSV files
    if (mimetype === 'text/csv' || filename.endsWith('.csv')) {
      const text = fileBuffer.toString('utf-8');
      return cleanText(text);
    }

    // Handle plain text
    if (mimetype.includes('text/plain')) {
      return cleanText(fileBuffer.toString('utf-8'));
    }

    throw new Error(`Unsupported file type: ${mimetype}`);
  } catch (error) {
    console.error('❌ File extraction error:', error.message);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

/**
 * Clean and normalize extracted text
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

/**
 * Generate answer from Groq using uploaded file data
 * @param {string} extractedText - Text from uploaded file
 * @param {string} userQuery - User's question
 * @param {Object} contextData - Additional context (attendance stats, etc.)
 * @returns {string} AI-generated answer
 */
export const generateAnswerFromGroq = async (extractedText, userQuery, contextData = {}) => {
  try {
    const client = getGroqClient();

    const systemPrompt = `You are an AI Attendance Advisor.
Answer STRICTLY based on the uploaded file data and context provided. DO NOT make up information.

UPLOADED FILE DATA:
${extractedText}

${contextData.attendancePercentage ? `CURRENT ATTENDANCE: ${contextData.attendancePercentage}%` : ''}
${contextData.totalClasses ? `TOTAL CLASSES: ${contextData.totalClasses}` : ''}
${contextData.attendedClasses ? `ATTENDED CLASSES: ${contextData.attendedClasses}` : ''}

Your tasks:
* Answer questions using ONLY the data from the uploaded file
* If information is not in the file, say "I don't have this information in the uploaded file"
* Provide accurate attendance advice based on the file data
* Calculate attendance impact if dates are mentioned in the file
* Reference specific data points from the file in your answer

Be precise, factual, and never hallucinate information not present in the file.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userQuery
        }
      ],
      temperature: 0.2,
      max_tokens: 2048
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('Empty response from Groq API');
    }

    return response;
  } catch (error) {
    console.error('❌ Groq answer generation error:', error.message);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid Groq API key. Please check your credentials.');
    }
    
    if (error.message.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    throw new Error(`Failed to generate answer: ${error.message}`);
  }
};

/**
 * Handle user query with file context
 * @param {Object} params - Request parameters
 * @returns {Object} Response with answer
 */
export const handleUserQuery = async ({ fileBuffer, mimetype, filename, userQuery, contextData }) => {
  try {
    // Validate inputs
    if (!userQuery || userQuery.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    // Extract text from file if provided
    let extractedText = '';
    if (fileBuffer && mimetype && filename) {
      extractedText = await extractTextFromFile(fileBuffer, mimetype, filename);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Could not extract text from the uploaded file');
      }
    } else {
      throw new Error('No file uploaded. Please upload a file to analyze.');
    }

    // Generate answer using Groq
    const answer = await generateAnswerFromGroq(extractedText, userQuery, contextData);

    return {
      success: true,
      answer: answer,
      extractedTextLength: extractedText.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Query handling error:', error.message);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Extract structured data from text using Groq (for calendar/timetable parsing)
 * @param {string} text - Raw extracted text
 * @param {string} prompt - Extraction prompt
 * @returns {Object} Parsed JSON data
 */
export const extractStructuredData = async (text, prompt) => {
  try {
    const client = getGroqClient();
    
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a data extraction expert. Extract ONLY valid JSON. No explanations, no markdown, no code blocks. Just pure JSON.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nSource text:\n${text}`
        }
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('Empty response from Groq');
    }

    // Parse and validate JSON
    const parsed = JSON.parse(response);
    return parsed;
  } catch (error) {
    console.error('❌ Groq extraction error:', error.message);
    throw error;
  }
};

/**
 * Generate AI response for attendance query
 * @param {Object} userData - Complete user data from Firestore
 * @param {string} userQuery - User's question
 * @returns {string} AI-generated advice
 */
export const generateGroqResponse = async (userData, userQuery) => {
  try {
    const client = getGroqClient();

    const systemPrompt = `You are an AI Attendance Advisor. 
Answer strictly based on the provided data:

ACADEMIC CALENDAR:
${JSON.stringify(userData.calendarData, null, 2)}

WEEKLY TIMETABLE:
${JSON.stringify(userData.timetableData, null, 2)}

ATTENDANCE STATS:
${JSON.stringify(userData.attendanceStats, null, 2)}

LEAVE HISTORY:
${JSON.stringify(userData.leaveHistory, null, 2)}

ABSENCE TIMELINE:
${JSON.stringify(userData.absenceTimeline, null, 2)}

Your tasks:
* Check attendance impact of any date requested.
* Predict risk if user takes leave on a specific date.
* Analyze number of classes tomorrow.
* Identify holidays and exam clashes.
* Calculate future attendance percentage based on current state.
* Give decisions like:
    - Can the user take leave?
    - How many more classes needed?
    - Risk warnings.

Respond with clean, structured, and actionable advice. Be conversational but precise.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User Query: ${userQuery}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('Empty response from Groq');
    }

    return response;
  } catch (error) {
    console.error('❌ Groq response generation error:', error.message);
    throw error;
  }
};
