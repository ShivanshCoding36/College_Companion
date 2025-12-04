# Attendance Advisor - API Integration Guide

## Overview
This document outlines the API integration requirements for the Attendance Advisor module.

## Groq API Integration

### Endpoint Configuration
The chat functionality is designed to integrate with Groq AI API. Update the endpoint in `src/hooks/useGroqChat.js`:

```javascript
const response = await fetch("/api/groq/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${YOUR_GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    message: userMessage,
    context: { /* attendance data */ },
    messageHistory: messages.slice(-10),
  }),
});
```

### Context Data Sent to API

The following data is sent with each chat message:

1. **Attendance Statistics**
   - `attendancePercentage`: Current attendance percentage
   - `totalClasses`: Total classes conducted
   - `attendedClasses`: Number of classes attended

2. **User Configuration**
   - `homeDistance`: Distance from home in km
   - `isHosteller`: Boolean indicating hosteller/day-scholar status
   - `semesterDates`: Object with start and end dates

3. **Academic Data**
   - `weeklyTimetable`: Uploaded timetable file data
   - `academicCalendar`: Uploaded calendar file data

4. **History**
   - `leaveHistory`: Array of past leave records with AI scores
   - `messageHistory`: Last 10 chat messages for context

5. **Weather Data**
   - `weatherData`: Real-time weather information (to be integrated)

## Backend Implementation Requirements

### Recommended Prompt Structure

```
You are an AI Attendance Advisor for college students. Analyze the provided data and give personalized leave recommendations.

Student Data:
- Current Attendance: {attendancePercentage}%
- Classes Attended: {attendedClasses}/{totalClasses}
- Required Attendance: 75%
- Home Distance: {homeDistance} km
- Residence Type: {isHosteller ? "Hosteller" : "Day Scholar"}
- Semester Period: {semesterStart} to {semesterEnd}

Consider:
1. Maintaining minimum 75% attendance
2. Weather conditions
3. Distance from home
4. Academic calendar events
5. Past leave patterns
6. Upcoming important classes

Provide:
- Leave feasibility score (0-100)
- Risk assessment
- Alternative suggestions
- Specific recommendations
```

### Response Format

```json
{
  "response": "AI-generated response text",
  "metadata": {
    "recommendationScore": 85,
    "riskLevel": "low",
    "safeDaysOff": 3,
    "suggestions": [
      "You can safely take 3 more days off this semester",
      "Avoid taking leave on Monday (important class)"
    ]
  }
}
```

## Weather API Integration

### OpenWeather API (Recommended)

Update in `src/hooks/useAttendanceData.js`:

```javascript
const fetchWeatherData = async () => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}`
  );
  const data = await response.json();
  return data;
};
```

## File Upload Processing

### Academic Calendar & Timetable Parsing

The frontend accepts:
- **Calendar**: PDF, XLS, XLSX
- **Timetable**: CSV, PDF, XLS, XLSX

Backend should:
1. Parse uploaded files
2. Extract class schedules, holidays, exam dates
3. Store structured data
4. Return parsed JSON to frontend

### Expected Parsed Format

**Timetable:**
```json
{
  "Monday": [
    { "time": "09:00-10:00", "subject": "Mathematics", "type": "lecture" },
    { "time": "10:00-11:00", "subject": "Physics", "type": "lab" }
  ],
  "Tuesday": [...]
}
```

**Calendar:**
```json
{
  "holidays": ["2025-12-25", "2026-01-01"],
  "examDates": {
    "midterm": ["2025-10-15", "2025-10-20"],
    "finals": ["2025-12-10", "2025-12-20"]
  },
  "importantEvents": [
    { "date": "2025-09-15", "event": "Project Submission" }
  ]
}
```

## Environment Variables

Create `.env` file:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_WEATHER_API_KEY=your_openweather_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
```

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Use backend proxy for API calls**
3. **Implement rate limiting**
4. **Validate file uploads (size, type, content)**
5. **Sanitize user inputs before sending to AI**

## Testing the Integration

1. Start your backend server
2. Update API endpoints in `useGroqChat.js`
3. Test with sample messages
4. Verify context data is properly sent
5. Check AI responses are correctly formatted

## Next Steps

1. Set up backend API routes
2. Implement Groq API integration
3. Add file parsing logic
4. Integrate weather API
5. Test end-to-end flow
6. Add error handling and retries
7. Implement response caching

## Support

For questions or issues, refer to:
- Groq API Docs: https://console.groq.com/docs
- OpenWeather API: https://openweathermap.org/api
