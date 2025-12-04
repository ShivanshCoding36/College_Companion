import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-pink-400 animate-spin" />
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render protected component if authenticated
  return children;
}
