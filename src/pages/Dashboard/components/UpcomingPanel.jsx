import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

export default function UpcomingPanel() {
  const upcomingClasses = [
    {
      subject: "Data Structures",
      time: "10:00 AM",
      room: "Lab 301",
      status: "next",
      color: "#FF1E8A"
    },
    {
      subject: "Database Management",
      time: "12:00 PM",
      room: "Room 205",
      status: "upcoming",
      color: "#8A2BE2"
    },
    {
      subject: "Web Development",
      time: "2:30 PM",
      room: "Lab 102",
      status: "upcoming",
      color: "#00D4FF"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 h-full"
      style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-neonPink" />
        Upcoming Classes
      </h2>

      <div className="space-y-4">
        {upcomingClasses.map((cls, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white/5 rounded-lg p-4 border border-white/10 hover:border-neonPink/40 transition-all duration-300"
            style={{
              boxShadow: cls.status === "next" ? `0 0 20px ${cls.color}30` : "none"
            }}
          >
            {cls.status === "next" && (
              <div 
                className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${cls.color}20`,
                  color: cls.color,
                  border: `1px solid ${cls.color}40`,
                  boxShadow: `0 0 15px ${cls.color}40`
                }}
              >
                Next
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{cls.subject}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {cls.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {cls.room}
                  </span>
                </div>
              </div>
              
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: cls.color,
                  boxShadow: `0 0 10px ${cls.color}`
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
