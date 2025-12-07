import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#050505' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0" style={{ background: '#050505' }}>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
