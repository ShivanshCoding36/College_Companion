import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, AlertCircle, CheckCircle2, Clock, Calendar, Brain, Zap, TrendingUp, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SurvivalPlan() {
  // Form inputs
  const [userSkills, setUserSkills] = useState("");
  const [stressLevel, setStressLevel] = useState("medium");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [examDates, setExamDates] = useState("");
  const [goals, setGoals] = useState("");
  const [deadline, setDeadline] = useState("");

  // UI states
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { currentUser } = useAuth();

  const handleGenerate = async () => {
    // Validation
    if (!userSkills.trim()) {
      setError("Please enter your current skills");
      return;
    }
    if (!timeAvailable.trim()) {
      setError("Please specify time available");
      return;
    }
    if (!examDates.trim()) {
      setError("Please enter exam dates");
      return;
    }
    if (!goals.trim()) {
      setError("Please enter your goals");
      return;
    }
    if (!deadline.trim()) {
      setError("Please enter deadline");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Convert comma-separated strings to arrays
      const skillsArray = userSkills.split(',').map(s => s.trim()).filter(s => s);
      const datesArray = examDates.split(',').map(d => d.trim()).filter(d => d);

      const requestBody = {
        userSkills: skillsArray,
        stressLevel,
        timeAvailable,
        examDates: datesArray,
        goals,
        deadline,
        userId: currentUser?.uid || 'anonymous',
      };

      console.log('Sending request:', requestBody);

      const response = await fetch('http://localhost:5000/api/survival-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate survival plan');
      }

      const data = await response.json();
      console.log('Received plan:', data);

      setPlan(data.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(error.message || 'Failed to generate survival plan. Make sure backend is running on port 5000.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsNotes = async () => {
    if (!plan || !currentUser) {
      setError('Please login and generate a plan first');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const noteContent = JSON.stringify(plan, null, 2);
      const noteTitle = `Survival Plan - ${goals.substring(0, 50)}`;

      const response = await fetch('http://localhost:5000/api/survival-plan/saveNotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          title: noteTitle,
          content: noteContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setError('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      default:
        return "text-white/60 bg-white/5 border-white/10";
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Survival Plan Generator</h3>
            <p className="text-sm text-white/60">Personalized study plan with weekly breakdowns</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Skills */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Current Skills (comma-separated)</label>
            <input
              type="text"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="e.g., Python, Data Structures, Basic Algorithms"
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Stress Level */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Stress Level</label>
            <select
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white focus:border-neonPurple/40 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="low">Low - Comfortable pace</option>
              <option value="medium">Medium - Balanced approach</option>
              <option value="high">High - Intense preparation</option>
            </select>
          </div>

          {/* Time Available */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Time Available</label>
            <input
              type="text"
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              placeholder="e.g., 4 hours per day, 20 hours per week"
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Exam Dates */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Exam Dates (comma-separated)</label>
            <input
              type="text"
              value={examDates}
              onChange={(e) => setExamDates(e.target.value)}
              placeholder="e.g., 2024-01-15, 2024-01-20, 2024-01-25"
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Goals</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., Master Data Structures, Score 85%+ in finals, Build strong foundation for placements"
              rows={3}
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm text-white/80 mb-2 block">Deadline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g., 2024-01-30, End of January, 4 weeks from now"
              className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-sm">Saved to notes successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-white/10 disabled:to-white/10 rounded-lg text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Generate Survival Plan
                </>
              )}
            </button>

            {plan && (
              <button
                onClick={handleSaveAsNotes}
                disabled={isSaving}
                className="px-6 py-3 bg-neonPurple/20 hover:bg-neonPurple/30 border border-neonPurple/40 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save as Notes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {plan && (
        <div className="space-y-6">
          {/* Weekly Plan */}
          {plan.weeklyPlan && plan.weeklyPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-neonPurple" />
                <h3 className="text-lg font-bold text-white">Weekly Plan</h3>
              </div>
              <div className="space-y-3">
                {plan.weeklyPlan.map((week, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-bgDark2/50 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neonPurple/20 to-neonPink/20 border border-neonPurple/40 flex items-center justify-center">
                        <span className="text-white font-bold">W{week.week}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">{week.focus}</h4>
                        {week.tasks && week.tasks.length > 0 && (
                          <ul className="space-y-1 mb-2">
                            {week.tasks.map((task, i) => (
                              <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                                <span className="text-neonPurple">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {week.milestones && week.milestones.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {week.milestones.map((milestone, i) => (
                              <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">
                                {milestone}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Daily Schedule */}
          {plan.dailySchedule && plan.dailySchedule.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Daily Timetable</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.dailySchedule.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-bgDark2/50 rounded-lg p-4 border border-white/5"
                  >
                    <h4 className="text-white font-semibold mb-3">{day.day}</h4>
                    <div className="space-y-2">
                      {day.timeSlots && day.timeSlots.map((slot, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-neonPurple text-xs font-mono flex-shrink-0 mt-0.5">{slot.time}</span>
                          <span className="text-white/70 text-sm">{slot.activity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skill Roadmap */}
          {plan.skillRoadmap && plan.skillRoadmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Skill Roadmap</h3>
              </div>
              <div className="space-y-3">
                {plan.skillRoadmap.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-bgDark2/50 rounded-lg p-4 border border-white/5"
                  >
                    <h4 className="text-white font-medium mb-2">{skill.skill}</h4>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-xs">Current:</span>
                        <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                          {skill.currentLevel}
                        </span>
                      </div>
                      <span className="text-white/30">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-xs">Target:</span>
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">
                          {skill.targetLevel}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">{skill.action}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Revision Plan */}
          {plan.revisionPlan && plan.revisionPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">Revision Strategy</h3>
              </div>
              <div className="space-y-3">
                {plan.revisionPlan.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-bgDark2/50 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{phase.phase}</h4>
                        <p className="text-white/70 text-sm mb-2">{phase.focus}</p>
                        <p className="text-white/60 text-xs">Method: {phase.method}</p>
                      </div>
                      <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-xs font-semibold">
                        {phase.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Exam Strategy */}
          {plan.examStrategy && plan.examStrategy.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-white">Exam Tactics</h3>
              </div>
              <div className="space-y-3">
                {plan.examStrategy.map((exam, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-bgDark2/50 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-white font-medium">{exam.subject}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(exam.priority?.toLowerCase())}`}>
                        {exam.priority}
                      </span>
                    </div>
                    {exam.tactics && exam.tactics.length > 0 && (
                      <ul className="space-y-1">
                        {exam.tactics.map((tactic, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                            <span className="text-red-400">✓</span>
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Productivity Rules */}
          {plan.productivityRules && plan.productivityRules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl border border-green-500/30 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Productivity Hacks</h3>
              </div>
              <ul className="space-y-2">
                {plan.productivityRules.map((rule, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-2 text-white/80"
                  >
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!plan && !isGenerating && (
        <div className="bg-bgDark3/30 backdrop-blur-xl rounded-xl border border-white/5 p-12 text-center">
          <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">
            Fill in your details above to generate a personalized AI survival plan
          </p>
        </div>
      )}
    </div>
  );
}
