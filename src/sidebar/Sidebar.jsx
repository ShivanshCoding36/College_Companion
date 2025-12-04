import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Clock,
  BookOpen,
  MessageCircle,
  User,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import Card from "../components/ui/Card";

const MENU = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Attendance Advisor", path: "/attendance-advisor", icon: Clock },
  { label: "Semester Survival", path: "/semester-survival", icon: BookOpen },
  { label: "Study Arena", path: "/study-arena", icon: MessageCircle },
  { label: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      initial={{ width: 70 }}
      animate={{ width: expanded ? 240 : 70 }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="flex flex-col h-screen py-4 px-2 backdrop-blur-xl bg-white/5 border-r border-white/10 neon-border"
      aria-label="Sidebar"
      style={{ minWidth: 70 }}
    >
      <div className="px-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.span
            className="w-3 h-3 rounded-full bg-[#FF1E8A] shadow-[0_0_18px_rgba(255,30,138,0.35)]"
            aria-hidden
            animate={{ scale: [1, 1.12, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            title="neon-dot"
          />
          {expanded && (
            <motion.h1
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-semibold tracking-wide"
            >
              College Companion
            </motion.h1>
          )}
        </div>
      </div>

      <nav className="mt-6 px-1 flex-1">
        <ul className="flex flex-col gap-1">
          {MENU.map((m) => (
            <li key={m.path}>
              <SidebarItem
                icon={m.icon}
                label={m.label}
                path={m.path}
                collapsed={!expanded}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-2 mb-4 mt-auto">
        <Card className={`w-full ${expanded ? "" : "mx-auto max-w-[48px]"}`}>
          <div className="px-3 py-2 text-xs text-white/80 border border-[#FF1E8A]/20 rounded-md neon-glow">
            <div className="font-medium">v1.0.0</div>
          </div>
        </Card>
      </div>
    </motion.aside>
  );
}
