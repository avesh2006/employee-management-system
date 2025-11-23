import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { UserRole } from './types';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Assistant from './pages/Assistant';
import Leave from './pages/Leave';
import Salary from './pages/Salary';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles?: UserRole[] }>) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/attendance" element={
        <ProtectedRoute>
          <Attendance />
        </ProtectedRoute>
      } />
      
      <Route path="/leave" element={
        <ProtectedRoute>
          <Leave />
        </ProtectedRoute>
      } />
      
      <Route path="/salary" element={
        <ProtectedRoute>
          <Salary />
        </ProtectedRoute>
      } />
      
      <Route path="/assistant" element={
        <ProtectedRoute>
          <Assistant />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/audit-logs" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <AuditLogs />
        </ProtectedRoute>
      } />

    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;