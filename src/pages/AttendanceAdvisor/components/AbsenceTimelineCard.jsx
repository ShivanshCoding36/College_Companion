import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";

export default function AbsenceTimelineCard({ absenceTimeline }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group by weeks
  const groupByWeek = (timeline) => {
    const weeks = [];
    let currentWeek = [];

    timeline.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === timeline.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeks;
  };

  const weeks = groupByWeek(absenceTimeline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-neonPink" />
          <span className="text-white font-semibold">Absence Timeline</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60" />
        )}
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 space-y-3">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/60" />
              <span className="text-white/60">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/60" />
              <span className="text-white/60">Absent</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => {
                  const isPresent = day.status === "present";
                  const date = new Date(day.date);

                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: weekIndex * 0.05 + dayIndex * 0.02,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="relative group flex-1"
                    >
                      <div
                        className={`aspect-square rounded-lg border transition-all duration-300 ${
                          isPresent
                            ? "bg-green-500/20 border-green-500/40 hover:bg-green-500/30"
                            : "bg-red-500/20 border-red-500/40 hover:bg-red-500/30"
                        }`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] text-white/80 font-semibold">
                            {date.getDate()}
                          </span>
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-bgDark2 border border-white/10 rounded-lg px-2 py-1 whitespace-nowrap">
                          <p className="text-xs text-white">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p
                            className={`text-[10px] ${
                              isPresent ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {isPresent ? "Present" : "Absent"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">
                {absenceTimeline.filter((d) => d.status === "present").length}
              </p>
              <p className="text-xs text-white/60">Present</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-400">
                {absenceTimeline.filter((d) => d.status === "absent").length}
              </p>
              <p className="text-xs text-white/60">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {absenceTimeline.length}
              </p>
              <p className="text-xs text-white/60">Total Days</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
