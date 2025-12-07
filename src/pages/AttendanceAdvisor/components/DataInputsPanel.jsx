import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Home,
  CloudRain,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function DataInputsPanel({ userConfig, onConfigUpdate, onFileUpload }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localConfig, setLocalConfig] = useState(userConfig);

  const handleInputChange = (field, value) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    onConfigUpdate(updated);
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(type, file);
      handleInputChange(type, file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="neon-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-neonPink" />
          <span className="text-white font-semibold">Data & Configuration</span>
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
          {/* File Uploads Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 mb-2">Document Uploads</h4>

            {/* Academic Calendar Upload */}
            <div className="relative">
              <input
                id="academic-calendar"
                type="file"
                accept=".pdf,.xls,.xlsx"
                onChange={(e) => handleFileChange("academicCalendar", e)}
                className="hidden"
              />
              <label
                htmlFor="academic-calendar"
                className="flex items-center gap-3 p-3 bg-bgDark2/50 rounded-lg border border-white/10 hover:border-neonPurple/40 cursor-pointer transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-neonPurple/20 border border-neonPurple/40 flex items-center justify-center group-hover:bg-neonPurple/30 transition-colors">
                  <Calendar className="w-5 h-5 text-neonPurple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Academic Calendar</p>
                  <p className="text-xs text-white/60">
                    {localConfig.academicCalendar
                      ? localConfig.academicCalendar.name
                      : "Upload PDF or Excel file"}
                  </p>
                </div>
                {localConfig.academicCalendar ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Upload className="w-5 h-5 text-white/60 group-hover:text-neonPurple transition-colors" />
                )}
              </label>
            </div>

            {/* Weekly Timetable Upload */}
            <div className="relative">
              <input
                id="weekly-timetable"
                type="file"
                accept=".pdf,.xls,.xlsx,.csv"
                onChange={(e) => handleFileChange("weeklyTimetable", e)}
                className="hidden"
              />
              <label
                htmlFor="weekly-timetable"
                className="flex items-center gap-3 p-3 bg-bgDark2/50 rounded-lg border border-white/10 hover:border-neonPink/40 cursor-pointer transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-neonPink/20 border border-neonPink/40 flex items-center justify-center group-hover:bg-neonPink/30 transition-colors">
                  <FileText className="w-5 h-5 text-neonPink" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Weekly Timetable</p>
                  <p className="text-xs text-white/60">
                    {localConfig.weeklyTimetable
                      ? localConfig.weeklyTimetable.name
                      : "Upload CSV, PDF, or Excel file"}
                  </p>
                </div>
                {localConfig.weeklyTimetable ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Upload className="w-5 h-5 text-white/60 group-hover:text-neonPink transition-colors" />
                )}
              </label>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 mb-2">Personal Details</h4>

            {/* Home Distance */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white/80">
                <Home className="w-4 h-4 text-neonPurple" />
                Home Distance (km)
              </label>
              <input
                type="number"
                value={localConfig.homeDistance}
                onChange={(e) => handleInputChange("homeDistance", Number(e.target.value))}
                placeholder="Enter distance in km"
                className="w-full px-3 py-2 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Hosteller / Day Scholar Toggle */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">Residence Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInputChange("isHosteller", true)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    localConfig.isHosteller
                      ? "bg-neonPurple/20 border-neonPurple/40 text-white"
                      : "bg-bgDark2/50 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  🏠 Hosteller
                </button>
                <button
                  onClick={() => handleInputChange("isHosteller", false)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    !localConfig.isHosteller
                      ? "bg-neonPink/20 border-neonPink/40 text-white"
                      : "bg-bgDark2/50 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  🚶 Day Scholar
                </button>
              </div>
            </div>
          </div>

          {/* Semester Dates Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 mb-2">Semester Dates</h4>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">Semester Start Date</label>
              <input
                type="date"
                value={localConfig.semesterStart}
                onChange={(e) => handleInputChange("semesterStart", e.target.value)}
                className="w-full px-3 py-2 bg-bgDark2/50 border border-white/10 rounded-lg text-white focus:border-neonPurple/40 focus:outline-none transition-colors"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">Semester End Date</label>
              <input
                type="date"
                value={localConfig.semesterEnd}
                onChange={(e) => handleInputChange("semesterEnd", e.target.value)}
                className="w-full px-3 py-2 bg-bgDark2/50 border border-white/10 rounded-lg text-white focus:border-neonPurple/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Weather Integration */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">Weather Auto-Fetch</p>
              <p className="text-xs text-white/60">Real-time weather integration enabled</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
