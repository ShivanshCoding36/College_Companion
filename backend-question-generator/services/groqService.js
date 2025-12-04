import axios from 'axios';

/**
 * Groq AI Service for Question Generation
 * Uses llama-3.1-70b-versatile model
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Updated model

/**
 * Generate questions using Groq AI
 * @param {string} syllabus - The syllabus content
 * @param {string} questionType - Type of questions to generate
 * @returns {Promise<{questions: string[]}>} - Generated questions
 */
export const generateQuestionsWithGroq = async (syllabus, questionType) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    // Build the prompt based on question type
    const systemPrompt = buildSystemPrompt(questionType);
    const userPrompt = buildUserPrompt(syllabus, questionType);

    console.log(`🤖 Calling Groq API to generate ${questionType} questions...`);

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2048,
        top_p: 1,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Empty response from Groq API');
    }

    // Parse the questions from the response
    const questions = parseQuestionsFromResponse(aiResponse, questionType);

    console.log(`✅ Generated ${questions.length} questions successfully`);

    return { questions };

  } catch (error) {
    console.error('❌ Groq API Error:', error.message);

    // Handle specific error types
    if (error.response) {
      // Groq API returned an error response
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown API error';

      if (status === 401) {
        throw new Error('Invalid Groq API key. Please check your credentials.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status >= 500) {
        throw new Error('Groq API server error. Please try again later.');
      } else {
        throw new Error(`Groq API error: ${message}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Groq API took too long to respond.');
    } else if (error.request) {
      throw new Error('No response from Groq API. Please check your internet connection.');
    } else {
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }
};

/**
 * Build system prompt based on question type
 */
const buildSystemPrompt = (questionType) => {
  return `You are an expert educator creating ${questionType} exam questions. 
CRITICAL: Return ONLY a valid JSON object in this exact format:
{
  "questions": ["Question 1 text here", "Question 2 text here", ...]
}

Do NOT include any other text, explanations, or markdown. Just the JSON object.`;
};

/**
 * Build user prompt with syllabus content
 */
const buildUserPrompt = (syllabus, questionType) => {
  const typeInstructions = {
    'mcq': 'Format each MCQ as: "Q: [question]\\nA) [option 1]\\nB) [option 2]\\nC) [option 3]\\nD) [option 4]\\n[Answer: correct letter]"',
    'short-answer': 'Create questions requiring 2-3 sentence responses',
    'long-answer': 'Create detailed analytical questions',
    'true-false': 'Format as: "Statement [TRUE/FALSE]"',
    'fill-in-blank': 'Use underscores for blanks: "The _____ is responsible for _____"',
    'case-study': 'Provide scenario followed by analytical questions',
    'numerical': 'Include numerical problem-solving questions',
    'conceptual': 'Focus on deep understanding of principles',
    'mixed': 'Mix of different question types'
  };

  return `Generate exactly 10 exam-quality ${questionType} questions based on this syllabus:

SYLLABUS:
${syllabus}

REQUIREMENTS:
- Return ONLY valid JSON: {"questions": ["Q1...", "Q2...", ...]}
- Exactly 10 questions
- ${typeInstructions[questionType] || 'Clear, exam-worthy questions'}
- Cover different topics from the syllabus
- No introductory text, just the JSON object`;
};

/**
 * Parse questions from Groq response
 */
const parseQuestionsFromResponse = (response, questionType) => {
  try {
    // First, try to parse as JSON
    let parsed;
    try {
      // Remove markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      parsed = JSON.parse(cleanResponse);
      
      // Check if we have questions array
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions.map((q, index) => {
          // Ensure each question has a number
          if (!q.match(/^Q?\d+[.:\s]/)) {
            return `Q${index + 1}. ${q.trim()}`;
          }
          return q.trim();
        });
      }
    } catch (jsonError) {
      console.log('Response is not JSON, parsing as text');
    }

    // Fallback: Split by question numbers (Q1, Q2, Q3, etc.)
    const questionPattern = /Q\d+[.:\s]/gi;
    const parts = response.split(questionPattern).filter(part => part.trim().length > 0);

    if (parts.length > 0) {
      return parts.map((q, index) => `Q${index + 1}. ${q.trim()}`);
    }

    // Last resort: split by newlines
    const lines = response.split('\n').filter(line => line.trim().length > 10);
    
    if (lines.length > 0) {
      return lines.map((line, index) => {
        if (!line.match(/^Q?\d+[.:\s]/)) {
          return `Q${index + 1}. ${line.trim()}`;
        }
        return line.trim();
      });
    }

    // Absolute fallback
    return [response.trim()];

  } catch (error) {
    console.error('Error parsing questions:', error.message);
    throw new Error('Failed to parse generated questions');
  }
};

/**
 * Test Groq API connection
 */
export const testGroqConnection = async () => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { role: 'user', content: 'Say "OK" if you can respond.' }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Groq connection test failed:', error.message);
    return false;
  }
};

export default { generateQuestionsWithGroq, testGroqConnection };
