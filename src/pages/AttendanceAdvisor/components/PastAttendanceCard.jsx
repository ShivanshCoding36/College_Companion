import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function PastAttendanceCard({ attendanceData }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { totalClasses, attendedClasses, attendancePercentage, requiredPercentage, isAtRisk } =
    attendanceData;

  const absentClasses = totalClasses - attendedClasses;
  const percentageToTarget = attendancePercentage - requiredPercentage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          {isAtRisk ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span className="text-white font-semibold">Past Attendance Record</span>
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
        <div className="px-4 pb-4 space-y-4">
          {/* Percentage Display */}
          <div className="relative">
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-3xl font-bold text-white">
                  {attendancePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-white/60">Current Attendance</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isAtRisk
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-green-500/20 text-green-400 border border-green-500/40"
                }`}
              >
                {isAtRisk ? "⚠️ At Risk" : "✓ Safe"}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-bgDark2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isAtRisk
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
              />
              {/* Required Percentage Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/60"
                style={{ left: `${requiredPercentage}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap">
                  {requiredPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bgDark2/50 rounded-lg p-3 border border-white/5">
              <p className="text-2xl font-bold text-green-400">{attendedClasses}</p>
              <p className="text-xs text-white/60">Classes Attended</p>
            </div>
            <div className="bg-bgDark2/50 rounded-lg p-3 border border-white/5">
              <p className="text-2xl font-bold text-red-400">{absentClasses}</p>
              <p className="text-xs text-white/60">Classes Missed</p>
            </div>
            <div className="bg-bgDark2/50 rounded-lg p-3 border border-white/5">
              <p className="text-2xl font-bold text-white">{totalClasses}</p>
              <p className="text-xs text-white/60">Total Classes</p>
            </div>
            <div className="bg-bgDark2/50 rounded-lg p-3 border border-white/5">
              <p
                className={`text-2xl font-bold ${
                  percentageToTarget >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {percentageToTarget >= 0 ? "+" : ""}
                {percentageToTarget.toFixed(1)}%
              </p>
              <p className="text-xs text-white/60">From Target</p>
            </div>
          </div>

          {/* Alert Message */}
          {isAtRisk && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-semibold">
                  Attendance Below {requiredPercentage}%
                </p>
                <p className="text-xs text-red-400/80 mt-1">
                  You need to attend more classes to reach the required attendance percentage.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
