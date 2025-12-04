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
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back! Here's your academic overview.</p>
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
        className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-8"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 31, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#FF1E8A"
              strokeWidth={3}
              dot={{ fill: '#FF1E8A', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#FF1E8A', stroke: '#fff', strokeWidth: 2 }}
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
