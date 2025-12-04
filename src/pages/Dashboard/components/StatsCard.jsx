import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, title, value, progress, color = "#FF1E8A" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-neonPink/40 transition-all duration-300"
      style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: `${color}15`,
              boxShadow: `0 0 20px ${color}30`
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <p className="text-sm text-white/60">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                boxShadow: `0 0 10px ${color}80`
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
