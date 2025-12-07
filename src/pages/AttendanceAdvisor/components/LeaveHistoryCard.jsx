import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Calendar, ThumbsUp, ThumbsDown } from "lucide-react";

export default function LeaveHistoryCard({ leaveHistory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="neon-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-neonPurple" />
          <span className="text-white font-semibold">Leave History</span>
          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">
            {leaveHistory.length} entries
          </span>
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
          {leaveHistory.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No leave history yet</p>
            </div>
          ) : (
            leaveHistory.map((leave, index) => (
              <motion.div
                key={leave.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bgDark2/50 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-white/90 font-medium">
                        {new Date(leave.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {leave.status === "approved" ? (
                        <ThumbsUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <ThumbsDown className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/60">{leave.reason}</p>
                  </div>

                  {/* AI Score Badge */}
                  <div
                    className={`px-2 py-1 rounded-lg border ${getScoreBg(
                      leave.aiScore
                    )}`}
                  >
                    <p className={`text-xs font-bold ${getScoreColor(leave.aiScore)}`}>
                      {leave.aiScore}
                    </p>
                    <p className="text-[10px] text-white/40">AI Score</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
