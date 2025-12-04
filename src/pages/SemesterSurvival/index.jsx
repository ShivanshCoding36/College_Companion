import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Calendar,
  FolderOpen,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import QuestionGenerator from "@/components/semester/QuestionGenerator";
import SurvivalPlan from "@/components/semester/SurvivalPlan";
import SemesterEssentials from "@/components/semester/SemesterEssentials";
import RevisionStrategy from "@/components/semester/RevisionStrategy";
import NotesRepository from "@/components/semester/NotesRepository";
import DoubtSolver from "@/components/semester/DoubtSolver";

export default function SemesterSurvival() {
  const [activeTab, setActiveTab] = useState("questions");

  const tabs = [
    {
      id: "questions",
      label: "Question Generator",
      icon: Sparkles,
      component: QuestionGenerator,
      color: "from-neonPink to-neonPurple",
    },
    {
      id: "survival",
      label: "Survival Plan",
      icon: Target,
      component: SurvivalPlan,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "essentials",
      label: "Semester Essentials",
      icon: Lightbulb,
      component: SemesterEssentials,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "revision",
      label: "Revision Strategy",
      icon: Calendar,
      component: RevisionStrategy,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "notes",
      label: "Notes Repository",
      icon: FolderOpen,
      component: NotesRepository,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "doubts",
      label: "Doubt Solver",
      icon: MessageCircle,
      component: DoubtSolver,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          📚 Semester Survival Kit
        </h1>
        <p className="text-white/60">
          AI-powered tools to ace your exams with minimal effort
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div 
          className="bg-bgDark3/50 backdrop-blur-xl rounded-[14px] p-2"
          style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 rounded-[14px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {/* Active Background Gradient */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-[14px] opacity-20`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Active Border */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBorder"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-[14px] opacity-40`}
                      style={{
                        padding: "1px",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Content */}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="text-[14px] relative z-10 hidden md:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Active Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {ActiveComponent && <ActiveComponent />}
      </motion.div>

      {/* Footer Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-white/40">
          💡 All features use AI mock data. Connect Groq API for real intelligent responses.
        </p>
      </motion.div>
    </div>
  );
}
