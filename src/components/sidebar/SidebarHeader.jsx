import React from "react";
import { motion } from "framer-motion";

export default function SidebarHeader({ collapsed, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          className="w-3 h-3 rounded-full bg-neonPink"
          aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          title="neon"
        />

        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold"
          >
            College Companion
          </motion.h1>
        )}
      </div>

      <button
        onClick={onToggle}
        className="text-white/60 hover:text-white p-1 rounded-md"
        aria-label="toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6zm1 2h6v2H7V6zm0 4h4v2H7v-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
