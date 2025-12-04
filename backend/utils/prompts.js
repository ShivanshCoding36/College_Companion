export const CALENDAR_EXTRACTION_PROMPT = `Convert this academic calendar text into structured JSON:
{
  "holidays": [{ "date": "YYYY-MM-DD", "name": "string" }],
  "workingDays": ["Monday", "Tuesday", ...],
  "specialEvents": [{ "date": "YYYY-MM-DD", "name": "string" }],
  "examDates": [{ "date": "YYYY-MM-DD", "subject": "string" }],
  "semesterStart": "YYYY-MM-DD",
  "semesterEnd": "YYYY-MM-DD"
}

Rules:
- Extract ALL dates in YYYY-MM-DD format
- Categorize events correctly (holidays, exams, special events)
- Include semester start and end dates
- List working days of the week
- Extract ONLY JSON. No explanations.`;

export const TIMETABLE_EXTRACTION_PROMPT = `Convert this timetable text into structured JSON:
{
  "weeklySchedule": {
    "Monday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }],
    "Tuesday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }],
    "Wednesday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }],
    "Thursday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }],
    "Friday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }],
    "Saturday": [{ "subject": "string", "start": "HH:MM", "end": "HH:MM" }]
  }
}

Rules:
- Use 24-hour time format (HH:MM)
- Include all subjects with their time slots
- Group by day of the week
- If Sunday exists, include it
- Extract ONLY JSON. No explanations.`;
