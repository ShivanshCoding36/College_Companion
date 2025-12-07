import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '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';

router.post('/', async (req, res) => {
  const { skills, stressLevel, timeAvailable, examDates, goals } = req.body;

  if (!skills || !stressLevel || !timeAvailable || !examDates || !goals) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `Generate a weekly survival plan for a student using the following details:
Skills: ${skills}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates}
Goals: ${goals}
Provide output in bullet points and weekly schedule format.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'pplx-7b-chat',
        messages: [
          { role: 'system', content: 'You are an academic survival plan generator.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      console.error('Perplexity API Error:', await response.text());
      return res.status(500).json({ error: 'AI request failed' });
    }

    const data = await response.json();
    const plan = data.choices[0].message.content;

    res.json({ plan });

  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    res.status(500).json({ error: 'AI request failed' });
  }
});

export default router;
