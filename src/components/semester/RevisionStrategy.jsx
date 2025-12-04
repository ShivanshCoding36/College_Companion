import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookMarked, TrendingUp } from "lucide-react";

export default function RevisionStrategy() {
  const [syllabus, setSyllabus] = useState("");
  const [daysLeft, setDaysLeft] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock revision schedule data
  const generateMockSchedule = (days) => {
    const schedules = {
      3: [
        {
          day: 1,
          date: "Today",
          sessions: [
            { time: "09:00 - 12:00", topic: "Unit 1: OOP Basics", priority: "high" },
            { time: "14:00 - 17:00", topic: "Unit 2: Inheritance", priority: "high" },
            { time: "19:00 - 21:00", topic: "Quick Revision + Practice", priority: "medium" },
          ],
        },
        {
          day: 2,
          date: "Tomorrow",
          sessions: [
            { time: "09:00 - 12:00", topic: "Unit 3: Polymorphism", priority: "high" },
            { time: "14:00 - 17:00", topic: "Unit 4: Exception Handling", priority: "medium" },
            { time: "19:00 - 21:00", topic: "Mock Test + Analysis", priority: "critical" },
          ],
        },
        {
          day: 3,
          date: "Day 3 (Exam Day)",
          sessions: [
            { time: "08:00 - 10:00", topic: "Final Quick Revision", priority: "critical" },
            { time: "10:00 - 11:00", topic: "Relax & Mental Preparation", priority: "medium" },
          ],
        },
      ],
      7: [
        {
          day: 1,
          date: "Today",
          sessions: [
            { time: "09:00 - 11:00", topic: "Unit 1: Introduction to OOP", priority: "high" },
            { time: "14:00 - 16:00", topic: "Unit 2: Classes and Objects", priority: "high" },
          ],
        },
        {
          day: 2,
          date: "Day 2",
          sessions: [
            { time: "09:00 - 11:00", topic: "Unit 3: Inheritance Concepts", priority: "high" },
            { time: "14:00 - 16:00", topic: "Practice Problems on Inheritance", priority: "medium" },
          ],
        },
        {
          day: 3,
          date: "Day 3",
          sessions: [
            { time: "09:00 - 11:00", topic: "Unit 4: Polymorphism", priority: "high" },
            { time: "14:00 - 16:00", topic: "Unit 5: Abstraction", priority: "medium" },
          ],
        },
        {
          day: 4,
          date: "Day 4",
          sessions: [
            { time: "09:00 - 11:00", topic: "Unit 6: Exception Handling", priority: "medium" },
            { time: "14:00 - 16:00", topic: "Unit 7: File I/O", priority: "low" },
          ],
        },
        {
          day: 5,
          date: "Day 5",
          sessions: [
            { time: "09:00 - 12:00", topic: "Comprehensive Revision (All Units)", priority: "critical" },
            { time: "14:00 - 17:00", topic: "Practice Previous Year Papers", priority: "high" },
          ],
        },
        {
          day: 6,
          date: "Day 6",
          sessions: [
            { time: "09:00 - 12:00", topic: "Mock Test + Self Assessment", priority: "critical" },
            { time: "14:00 - 17:00", topic: "Focus on Weak Areas", priority: "high" },
          ],
        },
        {
          day: 7,
          date: "Day 7 (Exam Day)",
          sessions: [
            { time: "08:00 - 10:00", topic: "Quick Revision of Key Points", priority: "critical" },
            { time: "10:00 - 11:00", topic: "Mental Preparation & Confidence Building", priority: "medium" },
          ],
        },
      ],
    };

    const numDays = parseInt(days);
    if (numDays <= 3) return schedules[3];
    if (numDays <= 7) return schedules[7];
    return schedules[7]; // Default to 7-day plan
  };

  const handleGenerate = () => {
    if (!syllabus.trim() || !daysLeft) {
      alert("Please enter syllabus content and days left");
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const mockSchedule = generateMockSchedule(daysLeft);
      setSchedule(mockSchedule);
      setIsGenerating(false);
    }, 1500);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 border-red-500/40 text-red-400";
      case "high":
        return "bg-orange-500/20 border-orange-500/40 text-orange-400";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/40 text-yellow-400";
      case "low":
        return "bg-green-500/20 border-green-500/40 text-green-400";
      default:
        return "bg-white/5 border-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Revision Strategy Generator</h3>
            <p className="text-sm text-white/60">Smart revision schedule based on time available</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Syllabus Input */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Syllabus Content</label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Paste your syllabus here..."
              rows={6}
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Days Left Input and Generate Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Days Left Until Exam</label>
              <input
                type="number"
                value={daysLeft}
                onChange={(e) => setDaysLeft(e.target.value)}
                placeholder="e.g., 7"
                min="1"
                max="30"
                className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !syllabus.trim() || !daysLeft}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-white/10 disabled:to-white/10 rounded-lg text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generate Strategy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Section - Timeline */}
      {schedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-neonPurple" />
              <h3 className="text-lg font-bold text-white">Your Revision Schedule</h3>
            </div>
            <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
              {schedule.length} days plan
            </span>
          </div>

          {/* Timeline */}
          <div className="relative space-y-8">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neonPink via-neonPurple to-cyan-500" />

            {schedule.map((dayPlan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Day Marker */}
                <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-neonPink to-neonPurple border-4 border-bgDark3 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{dayPlan.day}</span>
                </div>

                {/* Day Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-white font-bold">Day {dayPlan.day}</h4>
                    <span className="text-sm text-white/60 bg-white/5 px-2 py-1 rounded">
                      {dayPlan.date}
                    </span>
                  </div>

                  {/* Sessions */}
                  <div className="space-y-2">
                    {dayPlan.sessions.map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="bg-bgDark2/50 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-neonPurple mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-white/80 font-medium">
                                {session.time}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                                  session.priority
                                )}`}
                              >
                                {session.priority}
                              </span>
                            </div>
                            <p className="text-white/90">{session.topic}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
            <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neonPurple/40 rounded-lg text-white text-sm font-medium transition-all duration-300">
              Export as PDF
            </button>
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 rounded-lg text-white text-sm font-medium transition-all duration-300">
              Add to Calendar
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!schedule && !isGenerating && (
        <div className="bg-bgDark3/30 backdrop-blur-xl rounded-xl border border-white/5 p-12 text-center">
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">
            Enter your syllabus and days left to generate a revision strategy
          </p>
        </div>
      )}
    </div>
  );
}
