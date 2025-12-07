import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, AlertCircle } from "lucide-react";
import StatsCard from "./components/StatsCard";
import UpcomingPanel from "./components/UpcomingPanel";
import QuickActions from "./components/QuickActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const attendanceData = [
    { month: "Jan", attendance: 75 },
    { month: "Feb", attendance: 82 },
    { month: "Mar", attendance: 78 },
    { month: "Apr", attendance: 85 },
    { month: "May", attendance: 88 },
    { month: "Jun", attendance: 90 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your academic overview.</p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={GraduationCap}
          title="Attendance"
          value="88%"
          progress={88}
          color="#FF1E8A"
        />
        <StatsCard
          icon={BookOpen}
          title="Total Classes"
          value="124"
          progress={75}
          color="#8A2BE2"
        />
        <StatsCard
          icon={Calendar}
          title="Subjects"
          value="6"
          progress={100}
          color="#00D4FF"
        />
        <StatsCard
          icon={AlertCircle}
          title="Alerts"
          value="2"
          progress={40}
          color="#FF6B6B"
        />
      </div>

      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 md:mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" className="dark:opacity-30" />
            <XAxis 
              dataKey="month" 
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: 'var(--tooltip-text)' }}
              itemStyle={{ color: 'var(--tooltip-text)' }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom Grid: Upcoming + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPanel />
        <QuickActions />
      </div>
    </div>
  );
}
