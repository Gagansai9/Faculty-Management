import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import CursorFollower from './components/ui/CursorFollower';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-t-neon-blue border-r-transparent border-b-neon-purple border-l-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-t-transparent border-r-neon-blue border-b-transparent border-l-neon-purple rounded-full animate-spin-slow" />
      </div>
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse">
        INITIALIZING SYSTEM...
      </h2>
      <p className="text-gray-500 text-xs mt-2 font-mono tracking-widest">SECURE CONNECTION ESTABLISHED</p>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Or unauthorized page
  }

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['lecturer', 'hod']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};


function App() {
  return (
    <AuthProvider>
      <CursorFollower />
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;