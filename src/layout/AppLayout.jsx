import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0A0F1F] to-[#0F172A] text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
