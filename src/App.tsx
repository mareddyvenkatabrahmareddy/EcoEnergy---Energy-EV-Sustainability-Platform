/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { HomePage } from './components/home/HomePage.tsx';
import { AuthPages } from './components/auth/AuthPages.tsx';
import { DashboardLayout } from './components/dashboard/DashboardLayout.tsx';
import { FirebaseErrorBoundary } from './components/common/FirebaseErrorBoundary.tsx';

function MainRouter() {
  const { currentPage, user, setCurrentPage } = useApp();

  // Protect dashboard from unauthenticated access
  if (currentPage === 'dashboard') {
    if (!user) {
      return (
        <div className="min-h-screen bg-[#000000] flex flex-col justify-between">
          <Header />
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center text-[#00E5A0] mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Authentication Required
            </h2>
            <p className="text-xs text-[#AAB8C5] max-w-sm mt-2 mb-6">
              The EcoEnergy IoT Dashboard and telemetry console requires an active authenticated session.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 bg-[#00C781] hover:bg-[#00E5A0] text-[#000000] font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              Sign In to Proceed
            </button>
          </div>
          <Footer />
        </div>
      );
    }
    return <DashboardLayout />;
  }

  if (currentPage === 'login') {
    return <AuthPages initialMode="login" />;
  }

  if (currentPage === 'register') {
    return <AuthPages initialMode="register" />;
  }

  // Default: Home Page
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseErrorBoundary>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </FirebaseErrorBoundary>
  );
}
