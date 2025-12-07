import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarItem({ icon: Icon, label, path, collapsed, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  if (isMobile) {
    return (
      <motion.button
        onClick={() => navigate(path)}
        whileTap={{ scale: 0.95 }}
        className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all ${
          active
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="text-xs mt-1 font-medium">{label}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => navigate(path)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
        active
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <div className="flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-medium truncate"
        >
          {label}
        </motion.span>
      )}
      
      {!collapsed && active && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
