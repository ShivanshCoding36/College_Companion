import React from "react";
import Card from "../ui/Card";

export default function SidebarFooter({ collapsed }) {
  return (
    <div className={`${collapsed ? "flex justify-center" : ""}`}>
      <div className={`w-full ${collapsed ? "max-w-[64px]" : ""}`}>
        <div className="px-3 py-2 text-xs text-white/80 border border-neonPurple/20 rounded-lg bg-white/5">
          <div className="font-medium">v1.0.0</div>
        </div>
      </div>
    </div>
  );
}
