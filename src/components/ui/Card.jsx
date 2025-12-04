import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-bgDark3/60 rounded-lg p-1 border border-neonPink/30 ${className}`}
      style={{ boxShadow: "0 6px 20px rgba(138,43,226,0.06)" }}
    >
      {children}
    </div>
  );
}
