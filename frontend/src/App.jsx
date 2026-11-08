import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard Pages
import DashboardOverview from './pages/DashboardOverview';
import BrandsPage from './pages/BrandsPage';
import ContentReviewPage from './pages/ContentReviewPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ReviewHistoryPage from './pages/ReviewHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BrandProvider>
          <Routes>
            {/* Public Landing & Marketing */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Authenticated Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="review" element={<ContentReviewPage />} />
              <Route path="approvals" element={<ApprovalsPage />} />
              <Route path="history" element={<ReviewHistoryPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrandProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
