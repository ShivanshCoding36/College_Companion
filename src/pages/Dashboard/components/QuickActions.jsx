import React from "react";
import { motion } from "framer-motion";
import { Plus, UserCheck, AlertTriangle } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Add Subject",
      icon: Plus,
      color: "#FF1E8A",
      description: "Register a new course"
    },
    {
      label: "Add Attendance",
      icon: UserCheck,
      color: "#8A2BE2",
      description: "Mark today's attendance"
    },
    {
      label: "Predict Attendance Risk",
      icon: AlertTriangle,
      color: "#00D4FF",
      description: "Check shortage alerts"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 h-full"
      style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}
    >
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-300 text-left group"
            style={{
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${action.color}40, 0 0 20px ${action.color}20`;
              e.currentTarget.style.borderColor = `${action.color}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: `${action.color}15`,
                  boxShadow: `0 0 15px ${action.color}20`
                }}
              >
                <action.icon 
                  className="w-6 h-6 transition-all duration-300" 
                  style={{ color: action.color }}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base group-hover:text-white transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-white/60 mt-1">{action.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
