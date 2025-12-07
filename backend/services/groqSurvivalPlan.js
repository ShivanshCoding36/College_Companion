const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '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';
const PERPLEXITY_MODEL = 'pplx-7b-chat';

export const generateSurvivalPlan = async ({ userSkills, stressLevel, timeAvailable, examDates, goals, deadline }) => {
  try {
    console.log('🤖 Calling Perplexity API to generate survival plan...');

    const prompt = `Generate a weekly survival plan for a student using the following details:
Skills: ${userSkills.join(', ')}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates.join(', ')}
Goals: ${goals}
Deadline: ${deadline}

Provide output in bullet points and weekly schedule format. Include:
1. Weekly breakdown with focus areas and tasks
2. Daily schedule with time slots
3. Skill development roadmap
4. Revision plan and strategies
5. Exam preparation tactics
6. Productivity tips`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a study planning expert. Generate clear, structured study survival plans with weekly breakdowns, skill milestones, and exam strategies. Return ONLY a valid JSON object with this structure: {"weeklyPlan": [{"week": 1, "focus": "...", "tasks": ["...", "..."], "milestones": ["..."]}], "dailySchedule": [{"day": "Monday", "timeSlots": [{"time": "9-11 AM", "activity": "..."}]}], "skillRoadmap": [{"skill": "...", "currentLevel": "...", "targetLevel": "...", "action": "..."}], "revisionPlan": [{"phase": "...", "duration": "...", "focus": "...", "method": "..."}], "examStrategy": [{"subject": "...", "priority": "...", "tactics": ["...", "..."]}], "productivityRules": ["Rule 1", "Rule 2"]}'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Empty response from Perplexity API');
    }

    console.log('✅ Perplexity API response received');

    // Parse the response
    let parsedPlan;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPlan = JSON.parse(jsonMatch[0]);
      } else {
        parsedPlan = JSON.parse(aiResponse);
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
        rawResponse: aiResponse,
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
    console.error('❌ Perplexity API Error:', error.message);
    throw new Error(`Perplexity API failed: ${error.message}`);
  }
};
