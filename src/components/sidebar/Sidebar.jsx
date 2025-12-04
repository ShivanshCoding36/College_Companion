import React, { useState } from "react";
import { motion } from "framer-motion";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import {
  Home,
  Clock,
  BookOpen,
  MessageCircle,
  User,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Attendance Advisor", path: "/attendance-advisor", icon: Clock },
    { label: "Semester Survival", path: "/semester-survival", icon: BookOpen },
    { label: "Study Arena", path: "/study-arena", icon: MessageCircle },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={`flex flex-col h-screen py-4 bg-bgDark2/70 backdrop-blur-xl border-r border-neonPink/40 border-white/5 text-white`}
      style={{ minWidth: 80 }}
    >
      <div className="px-3">
        <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      <nav className="mt-6 px-2 flex-1">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.path}>
              <SidebarItem
                icon={it.icon}
                label={it.label}
                path={it.path}
                collapsed={collapsed}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 mb-4">
        <SidebarFooter collapsed={collapsed} />
      </div>
    </motion.aside>
  );
}
