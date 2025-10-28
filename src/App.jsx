import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Payslips from './pages/Payslips';
import './App.css';
import AccountSettings from './pages/AccountSettings';
import Holidays from './pages/Holidays';
import Leaves from './pages/Leaves';
import CompanyProfile from './pages/CompanyProfile';
import Users from './pages/Users';
import TaxConfig from './pages/TaxConfig';
import BenefitsConfig from './pages/BenefitsConfig';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <Layout>
                    <Employees />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <PrivateRoute>
                  <Layout>
                    <Attendance />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <PrivateRoute>
                  <Layout>
                    <Leaves />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/holidays"
              element={
                <PrivateRoute>
                  <Layout>
                    <Holidays />
                  </Layout>
                </PrivateRoute>
              }
            />                        
            <Route
              path="/payroll"
              element={
                <PrivateRoute>
                  <Layout>
                    <Payroll />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/payslips"
              element={
                <PrivateRoute>
                  <Layout>
                    <Payslips />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/account-settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <AccountSettings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/company-profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <CompanyProfile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/benefits-config"
              element={
                <PrivateRoute>
                  <Layout>
                    <BenefitsConfig />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tax-config"
              element={
                <PrivateRoute>
                  <Layout>
                    <TaxConfig />
                  </Layout>
                </PrivateRoute>
              }
            />            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;