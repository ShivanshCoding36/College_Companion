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

/**
 * Generate AI response for general queries
 */
export const generateGroqResponse = async (userPrompt, contextType = 'general', options = {}) => {
  const systemPrompts = {
    'attendance-advisor': 'You are an intelligent AI assistant specializing in attendance management, academic planning, and student advisory. Provide clear, actionable, and accurate responses.',
    'question-generator': 'You are an expert question generator for educational purposes. Generate relevant, challenging questions.',
    'survival-plan': 'You are an academic survival plan assistant. Help students plan their semester effectively.',
    'essentials': 'You are an essentials extractor. Extract key points and important information from content.',
    'revision': 'You are a revision strategy expert. Help students create effective revision plans.',
    'doubt-solver': 'You are a doubt solver. Provide clear explanations to student questions.',
    'general': 'You are a helpful AI assistant. Provide accurate and useful responses.'
  };

  const systemPrompt = systemPrompts[contextType] || systemPrompts.general;
  return await generateCompletion(systemPrompt, userPrompt, options);
};

/**
 * Generate questions from syllabus
 */
export const generateQuestions = async (syllabus, questionType) => {
  const systemPrompt = 'You are an expert question generator. Create educational questions based on syllabus content. Return ONLY valid JSON.';
  const userPrompt = `Generate ${questionType} questions for this syllabus. Return JSON in this format:

{
  "questions": [
    {
      "question": "Question text",
      "type": "${questionType}",
      "difficulty": "easy|medium|hard",
      "topic": "Topic name"
    }
  ]
}

Syllabus: ${syllabus}`;

  const response = await generateCompletion(systemPrompt, userPrompt, { json: true });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Generate survival plan
 */
export const generateSurvivalPlan = async (params) => {
  const { skills, stressLevel, timeAvailable, examDates, goals } = params;
  
  const systemPrompt = 'You are an academic planning expert. Create comprehensive semester survival plans. Return ONLY valid JSON.';
  const userPrompt = `Create a semester survival plan with these parameters:

Skills: ${skills}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates}
Goals: ${goals}

Return JSON in this format:

{
  "weeklyPlan": [
    {
      "week": 1,
      "focus": "Main focus area",
      "tasks": ["task1", "task2"],
      "goals": "Weekly goals"
    }
  ],
  "studySchedule": {
    "morning": "Activities",
    "afternoon": "Activities",
    "evening": "Activities"
  },
  "stressManagement": ["tip1", "tip2"],
  "examPreparation": {
    "strategy": "Exam strategy",
    "timeline": "Preparation timeline"
  }
}`;

  const response = await generateCompletion(systemPrompt, userPrompt, { json: true });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Attendance advisor
 */
export const attendanceAdvisor = async (question, attendanceData = {}) => {
  const systemPrompt = 'You are an attendance management advisor. Provide structured attendance advice and calculations.';
  const userPrompt = `Analyze this attendance situation and provide advice.

${Object.keys(attendanceData).length > 0 ? `Current Attendance Data: ${JSON.stringify(attendanceData)}\n\n` : ''}Question: ${question}

Provide actionable advice including:
- Current attendance percentage (if data provided)
- Classes needed to reach target
- Risk assessment
- Recommendations`;

  return await generateCompletion(systemPrompt, userPrompt);
};

export default {
  initializeGroqClient,
  getGroqClient,
  generateCompletion,
  generateJSONCompletion,
  generateGroqResponse,
  generateQuestions,
  generateSurvivalPlan,
  attendanceAdvisor,
};
