import fetch from 'node-fetch';
import FormData from 'form-data';
import { readFileSync } from 'fs';

const PPLX_API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Call Perplexity API with automatic fallback
 */
const callPerplexity = async (messages, options = {}, useFallback = false) => {
  const apiKey = useFallback ? process.env.PPLX_FALLBACK_KEY : process.env.PPLX_API_KEY;
  
  if (!apiKey) {
    throw new Error(`Perplexity API key not configured: ${useFallback ? 'fallback' : 'primary'}`);
  }

  const response = await fetch(PPLX_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || 'llama-3.1-sonar-small-128k-online',
      messages,
      temperature: options.temperature || 0.2,
      max_tokens: options.max_tokens || 4096,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

/**
 * Perplexity API with automatic fallback
 */
export const generatePerplexityResponse = async (messages, options = {}) => {
  try {
    console.log('🔮 Calling Perplexity (primary key)...');
    return await callPerplexity(messages, options, false);
  } catch (primaryError) {
    console.warn('⚠️  Primary Perplexity key failed:', primaryError.message);
    console.log('🔮 Retrying with fallback key...');
    
    try {
      return await callPerplexity(messages, options, true);
    } catch (fallbackError) {
      console.error('❌ Fallback Perplexity key also failed:', fallbackError.message);
      throw new Error(`Perplexity API failed: ${fallbackError.message}`);
    }
  }
};

/**
 * Extract text from image using Perplexity Vision
 */
export const extractTextFromImage = async (imagePath, prompt = 'Extract all text from this image, maintaining structure and formatting.') => {
  try {
    // Read image and convert to base64
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const messages = [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        {
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${base64Image}` }
        }
      ]
    }];

    return await generatePerplexityResponse(messages, {
      model: 'llama-3.2-90b-vision-instruct'
    });
  } catch (error) {
    console.error('❌ Perplexity vision error:', error.message);
    throw error;
  }
};

/**
 * Extract structured data using Perplexity
 */
export const extractStructuredData = async (text, extractionPrompt) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a data extraction assistant. Return only valid JSON.'
      },
      {
        role: 'user',
        content: `${extractionPrompt}\n\nText to process:\n${text}`
      }
    ];

    const response = await generatePerplexityResponse(messages);
    
    // Parse JSON from response
    let jsonText = response.trim();
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

/**
 * Extract essentials from file text
 */
export const extractEssentialsFromFile = async (fileText, fileName) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert at extracting educational content from documents. Return ONLY valid JSON with no markdown formatting.'
    },
    {
      role: 'user',
      content: `Analyze this document (${fileName}) and extract key information. Return JSON in this exact format:

{
  "creativeQuestions": ["question1", "question2"],
  "theoryTopics": ["topic1", "topic2"],
  "numericalTopics": ["topic1", "topic2"],
  "marks": {
    "2": ["short answer question 1"],
    "3": ["medium question 1"],
    "14": ["long question 1"],
    "16": ["very long question 1"]
  }
}

Document content:
${fileText.substring(0, 10000)}`
    }
  ];

  const response = await generatePerplexityResponse(messages, { temperature: 0.1 });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Generate revision plan
 */
export const generateRevisionPlan = async (syllabusText, preferences) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert study planner. Create comprehensive revision plans. Return ONLY valid JSON.'
    },
    {
      role: 'user',
      content: `Create a revision plan for this syllabus. Return JSON in this format:

{
  "weeks": [
    {
      "weekNumber": 1,
      "topics": ["topic1", "topic2"],
      "goals": "Weekly goals",
      "activities": ["activity1", "activity2"],
      "assessments": "Assessment plan"
    }
  ],
  "studyTips": ["tip1", "tip2"],
  "resources": ["resource1", "resource2"]
}

Syllabus: ${syllabusText}
Preferences: ${JSON.stringify(preferences)}`
    }
  ];

  const response = await generatePerplexityResponse(messages, { temperature: 0.3 });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Doubt solver
 */
export const doubtSolver = async (question, context = '') => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert tutor helping students understand concepts. Provide clear, detailed explanations.'
    },
    {
      role: 'user',
      content: `${context ? `Context: ${context}\n\n` : ''}Question: ${question}\n\nProvide a comprehensive explanation.`
    }
  ];

  return await generatePerplexityResponse(messages, { temperature: 0.4, max_tokens: 2048 });
};

export default {
  generatePerplexityResponse,
  extractTextFromImage,
  extractStructuredData,
  extractEssentialsFromFile,
  generateRevisionPlan,
  doubtSolver,
};
