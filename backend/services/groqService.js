import Groq from 'groq-sdk';

let groqClient = null;

/**
 * Initialize Groq SDK client
 */
export const initializeGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }

  groqClient = new Groq({ apiKey });
  console.log('✅ Groq client initialized');
  return groqClient;
};

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
 * Generate completion using Groq
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {object} options - Additional options (model, temperature, max_tokens)
 * @returns {Promise<string>} - Generated text
 */
export const generateCompletion = async (systemPrompt, userPrompt, options = {}) => {
  try {
    const client = getGroqClient();
    
    const response = await client.chat.completions.create({
      model: options.model || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 4096,
      response_format: options.json ? { type: 'json_object' } : undefined,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    throw new Error(`Groq API failed: ${error.message}`);
  }
};

/**
 * Generate JSON completion using Groq
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Parsed JSON response
 */
export const generateJSONCompletion = async (systemPrompt, userPrompt, options = {}) => {
  try {
    const textResponse = await generateCompletion(
      systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no explanations.',
      userPrompt,
      { ...options, json: true }
    );

    // Try to parse JSON, handling markdown code blocks
    let jsonText = textResponse.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('❌ Groq JSON parsing error:', error.message);
    throw new Error(`Failed to parse Groq JSON response: ${error.message}`);
  }
};

export default {
  initializeGroqClient,
  getGroqClient,
  generateCompletion,
  generateJSONCompletion,
};
