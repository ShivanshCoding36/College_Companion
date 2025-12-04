import React from "react";
import Card from "../ui/Card";

export default function SidebarFooter({ collapsed }) {
  return (
    <div className={`${collapsed ? "flex justify-center" : ""}`}>
      <Card className={`w-full ${collapsed ? "max-w-[64px]" : ""}`}>
        <div className="px-3 py-2 text-xs text-white/80 border border-neonPink/20 rounded-md shadow-[0_0_14px_rgba(138,43,226,0.06)]">
          <div className="font-medium">v1.0.0</div>
        </div>
      </Card>
    </div>
  );
}
