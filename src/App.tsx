import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import TestimonialsList from './pages/dashboard/TestimonialsList';
import FormsList from './pages/dashboard/FormsList';
import Analytics from './pages/dashboard/Analytics';
import NewForm from './pages/NewForm';
import TestimonialForm from './pages/TestimonialForm';

// Components
import DashboardLayout from './components/layout/DashboardLayout';
import Responses from './pages/dashboard/Responses';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/testimonial/form/:formId" element={<TestimonialForm />} />
      
      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="testimonials" element={<TestimonialsList />} />
        <Route path="forms" element={<FormsList />} />
        <Route path="forms/:formId/responses" element={<Responses />} />
        <Route path="forms/new" element={<NewForm />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="team" element={<div className="p-6">Team Management Coming Soon</div>} />
        <Route path="settings" element={<div className="p-6">Settings Coming Soon</div>} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;