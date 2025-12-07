import React from "react";
import { motion } from "framer-motion";
import { Plus, UserCheck, AlertTriangle } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Add Subject",
      icon: Plus,
      description: "Register a new course",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-500",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500"
    },
    {
      label: "Add Attendance",
      icon: UserCheck,
      description: "Mark today's attendance",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-500",
      hoverBorder: "hover:border-green-300 dark:hover:border-green-500"
    },
    {
      label: "Predict Attendance Risk",
      icon: AlertTriangle,
      description: "Check shortage alerts",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-500",
      hoverBorder: "hover:border-amber-300 dark:hover:border-amber-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 ${action.hoverBorder} transition-all duration-300 text-left group`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-all duration-300 ${action.bgColor}`}>
                <action.icon className={`w-6 h-6 transition-all duration-300 ${action.iconColor}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
