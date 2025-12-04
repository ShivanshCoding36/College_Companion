import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq client
let groqClient = null;

const initializeGroqClient = () => {
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
    console.error('❌ Groq client initialization failed:', error.message);
    throw error;
  }
};

// Initialize on module load
initializeGroqClient();

/**
 * Generate AI response using Groq API
 * @param {string} prompt - The prompt to send to Groq
 * @param {object} options - Additional options like temperature, max_tokens
 * @returns {Promise<string>} - AI generated response
 */
export const generateGroqResponse = async (prompt, options = {}) => {
  try {
    if (!groqClient) {
      throw new Error('Groq client not initialized');
    }

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Valid prompt is required');
    }

    const {
      model = 'llama-3.3-70b-versatile',
      temperature = 0.3,
      maxTokens = 2048,
      systemPrompt = 'You are a helpful AI assistant for an attendance management system.'
    } = options;

    console.log('🤖 Generating Groq response...');

    const completion = await groqClient.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('Empty response from Groq API');
    }

    console.log('✅ Groq response generated successfully');
    return response.trim();

  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('API key')) {
      throw new Error('Invalid Groq API key. Please check your credentials.');
    }
    
    if (error.message.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    if (error.message.includes('model')) {
      throw new Error('Invalid model specified. Please check model name.');
    }

    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

/**
 * Test Groq connection
 * @returns {Promise<boolean>}
 */
export const testGroqConnection = async () => {
  try {
    const response = await generateGroqResponse('Hello, respond with "OK" if you can hear me.', {
      maxTokens: 50
    });
    return response.includes('OK') || response.length > 0;
  } catch (error) {
    console.error('Groq connection test failed:', error.message);
    return false;
  }
};

export default { generateGroqResponse, testGroqConnection };
