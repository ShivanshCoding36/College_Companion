import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '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',
});

const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const generateSurvivalPlan = async ({ userSkills, stressLevel, timeAvailable, examDates, goals, deadline }) => {
  try {
    console.log('🤖 Calling Groq API to generate survival plan...');

    const userPrompt = `Skills: ${userSkills.join(', ')} | Stress: ${stressLevel} | Time: ${timeAvailable} | Exams: ${examDates.join(', ')} | Goals: ${goals} | Deadline: ${deadline}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Survival Plan AI. Generate a clear, structured study survival plan with weekly breakdowns, skill milestones, time management, revision cycles, exam strategies, daily timetables, and productivity hacks. Return ONLY a valid JSON object with this exact structure:
{
  "weeklyPlan": [{"week": 1, "focus": "...", "tasks": ["...", "..."], "milestones": ["..."]}],
  "dailySchedule": [{"day": "Monday", "timeSlots": [{"time": "9-11 AM", "activity": "..."}]}],
  "skillRoadmap": [{"skill": "...", "currentLevel": "...", "targetLevel": "...", "action": "..."}],
  "revisionPlan": [{"phase": "...", "duration": "...", "focus": "...", "method": "..."}],
  "examStrategy": [{"subject": "...", "priority": "...", "tactics": ["...", "..."]}],
  "productivityRules": ["Rule 1", "Rule 2", "Rule 3"]
}
Do not include any markdown formatting, code blocks, or explanatory text. Return only the JSON object.`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 3000,
    });

    const response = chatCompletion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('Empty response from Groq API');
    }

    console.log('✅ Groq API response received');

    // Parse the response
    let parsedPlan;
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPlan = JSON.parse(jsonMatch[0]);
      } else {
        parsedPlan = JSON.parse(response);
      }
    } catch (parseError) {
      console.warn('⚠️  Failed to parse as JSON, using fallback structure');
      // Fallback structure if parsing fails
      parsedPlan = {
        weeklyPlan: [{ week: 1, focus: 'Initial preparation', tasks: ['Analyze syllabus', 'Create study schedule'], milestones: ['Setup complete'] }],
        dailySchedule: [{ day: 'Monday', timeSlots: [{ time: '9-11 AM', activity: 'Study session' }] }],
        skillRoadmap: userSkills.map(skill => ({ skill, currentLevel: 'Beginner', targetLevel: 'Intermediate', action: 'Practice daily' })),
        revisionPlan: [{ phase: 'Initial', duration: '1 week', focus: 'Core concepts', method: 'Active recall' }],
        examStrategy: [{ subject: goals, priority: 'High', tactics: ['Practice questions', 'Time management'] }],
        productivityRules: ['Take regular breaks', 'Stay hydrated', 'Sleep 7-8 hours'],
        rawResponse: response,
      };
    }

    // Ensure all required fields exist
    const completePlan = {
      weeklyPlan: parsedPlan.weeklyPlan || [],
      dailySchedule: parsedPlan.dailySchedule || [],
      skillRoadmap: parsedPlan.skillRoadmap || [],
      revisionPlan: parsedPlan.revisionPlan || [],
      examStrategy: parsedPlan.examStrategy || [],
      productivityRules: parsedPlan.productivityRules || [],
    };

    return completePlan;
  } catch (error) {
    console.error('❌ Groq API Error:', error.message);
    throw new Error(`Groq API failed: ${error.message}`);
  }
};
