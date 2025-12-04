import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoomProvider } from "./contexts/RoomContext";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Auth/Onboarding";
import AttendanceAdvisor from "./pages/AttendanceAdvisor";
import SemesterSurvival from "./pages/SemesterSurvival";
import StudyArenaHub from "./pages/StudyArena";
import RoomPage from "./pages/StudyArena/RoomPage.jsx";
import PrivateRoute from "./components/PrivateRoute";

function Profile() {
  return <div className="text-2xl">Profile</div>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            } />

            {/* Protected Routes */}
            <Route element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance-advisor" element={<AttendanceAdvisor />} />
              <Route path="/semester-survival" element={<SemesterSurvival />} />
              <Route path="/study-arena" element={<StudyArenaHub />} />
              <Route path="/study-arena/room/:roomCode" element={<RoomPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
