import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarItem({ icon: Icon, label, path, collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <motion.button
      onClick={() => navigate(path)}
      whileHover={{ scale: 1.02 }}
      className={`w-full flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 text-sm focus:outline-none
        ${active ? "bg-neonPink/10 border-l-2 border-neonPink text-neonPink" : "text-white/90 hover:text-neonPink"}`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.div
        className="flex items-center justify-center"
        animate={active ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: active ? Infinity : 0, duration: 1.6 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}
