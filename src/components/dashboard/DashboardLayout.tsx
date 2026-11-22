import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Zap,
  LayoutDashboard,
  Sun,
  BatteryCharging,
  Car,
  Gauge,
  Leaf,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Home,
  ArrowUpRight,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { OverviewTab } from './tabs/OverviewTab.tsx';
import { SolarTab } from './tabs/SolarTab.tsx';
import { BatteryTab } from './tabs/BatteryTab.tsx';
import { EVChargingTab } from './tabs/EVChargingTab.tsx';
import { SmartMeterTab } from './tabs/SmartMeterTab.tsx';
import { CarbonTab } from './tabs/CarbonTab.tsx';
import { WasteTab } from './tabs/WasteTab.tsx';
import { ReportsTab } from './tabs/ReportsTab.tsx';
import { SettingsTab } from './tabs/SettingsTab.tsx';
import { DashboardTab } from '../../types/index.ts';

export const DashboardLayout: React.FC = () => {
  const {
    user,
    firebaseUid,
    isEmailVerified,
    isCloudSynced,
    loginWithGoogle,
    resendVerificationEmail,
    refreshEmailVerification,
    logout,
    dashboardTab,
    setDashboardTab,
    setCurrentPage,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Navigation Items matching EcoEnergy functional tabs with related icons
  const navItems: {
    id: DashboardTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'solar', label: 'Solar Energy', icon: Sun },
    { id: 'battery', label: 'Battery', icon: BatteryCharging },
    { id: 'ev', label: 'EV Charging', icon: Car },
    { id: 'smart-meter', label: 'Smart Meter', icon: Gauge },
    { id: 'carbon', label: 'Carbon', icon: Leaf },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col select-none">
      {/* =========================================================================
          TOP UTILITY HEADER
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-[#1A1A1A] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#047857] to-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Eco<span className="text-[#10B981]">Energy</span>
            </span>
          </button>
          <span className="hidden md:inline-block w-px h-5 bg-[#262626] mx-1" />
          <span className="hidden md:inline-block text-xs text-[#9CA3AF]">
            Microgrid Synchronized · Apex Campus 01
          </span>
        </div>

        {/* Right Controls: Date, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Live Calendar Date */}
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] bg-[#0D0D0D] border border-[#262626] px-3.5 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-white font-medium">{currentDateFormatted}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowProfileDropdown(false);
              }}
              className="relative p-2 text-[#9CA3AF] hover:text-white bg-[#0D0D0D] border border-[#262626] rounded-xl cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] text-black font-bold text-[9px] rounded-full flex items-center justify-center shadow-md">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0D0D0D] border border-[#262626] rounded-2xl shadow-2xl p-4 z-40">
                <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <span className="text-xs font-bold text-white">System Notifications</span>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-[#10B981] hover:text-white cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-[#9CA3AF] text-center py-4">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-black/60 text-[#9CA3AF]'
                            : 'bg-[#064E3B]/30 border border-[#10B981]/30 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-[#9CA3AF]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2 p-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#262626] rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#047857] to-[#10B981] text-black font-bold flex items-center justify-center text-xs shadow-md">
                {user?.avatar || 'US'}
              </div>
              <span className="text-xs font-semibold text-white hidden sm:block pr-1">
                {user?.name.split(' ')[0] || 'User'}
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-[#0D0D0D] border border-[#262626] rounded-2xl shadow-2xl p-3 z-40">
                <div className="pb-3 border-b border-[#262626] px-2">
                  <span className="text-xs font-bold text-white block">{user?.name}</span>
                  <span className="text-[11px] text-[#9CA3AF] truncate block">{user?.email}</span>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold">
                    {isCloudSynced ? (
                      <span className="text-[#10B981] inline-flex items-center gap-1">
                        <Cloud className="w-3 h-3" /> Cloud Firestore Active
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF] inline-flex items-center gap-1">
                        <CloudOff className="w-3 h-3" /> Local Demo Mode
                      </span>
                    )}
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  {!isCloudSynced && (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        void loginWithGoogle();
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-[#00E5A0] hover:text-black hover:bg-[#00E5A0] rounded-lg flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Enable Google Cloud Sync</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#9CA3AF] hover:text-[#6EE7B7] rounded-lg hover:bg-[#1A1A1A] flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Public Website</span>
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#9CA3AF] hover:text-[#6EE7B7] rounded-lg hover:bg-[#1A1A1A] flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab('reports');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#9CA3AF] hover:text-[#6EE7B7] rounded-lg hover:bg-[#1A1A1A] flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Audit Reports</span>
                  </button>
                </div>
                <div className="pt-2 border-t border-[#262626]">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      void logout();
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          EXACT TOP NAVIGATION PILL BAR (Full View Across Entire Width)
         ========================================================================= */}
      <div className="w-full py-4 px-4 sm:px-8 border-b border-[#1A1A1A] bg-[#000000]">
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5 py-1">
          {navItems.map((item) => {
            const isActive = dashboardTab === item.id;
            const isSolar = item.id === 'solar';
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setDashboardTab(item.id)}
                className={`group relative w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981] text-[#000000] border-[#10B981] font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.01]'
                    : isSolar
                    ? 'bg-[#0D0D0D] border-[#262626] text-white hover:-translate-y-0.5 hover:border-yellow-400/80 hover:text-yellow-300 hover:bg-neutral-900 hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:scale-[1.02]'
                    : 'bg-[#0D0D0D] border-[#262626] text-white hover:-translate-y-0.5 hover:border-[#10B981]/70 hover:text-[#6EE7B7] hover:bg-[#141414] hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:scale-[1.02]'
                }`}
              >
                {/* Hover Halo */}
                {isSolar ? (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-[#10B981]/15 to-yellow-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                ) : (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#10B981]/15 via-[#6EE7B7]/10 to-[#10B981]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}

                {/* Icon + Label Group */}
                <span className="relative z-10 flex items-center gap-2 min-w-0">
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                      isSolar
                        ? `duration-500 group-hover:rotate-90 group-hover:scale-125 ${
                            isActive
                              ? 'text-black fill-black'
                              : 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]'
                          }`
                        : `${
                            item.id === 'settings'
                              ? 'duration-500 group-hover:rotate-90 group-hover:scale-110'
                              : item.id === 'battery'
                              ? 'group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                              : item.id === 'ev'
                              ? 'group-hover:translate-x-1 group-hover:scale-110'
                              : item.id === 'smart-meter'
                              ? 'group-hover:rotate-12 group-hover:scale-115'
                              : item.id === 'carbon'
                              ? 'group-hover:-rotate-12 group-hover:scale-125'
                              : 'group-hover:scale-115'
                          } ${
                            isActive
                              ? 'text-black'
                              : 'text-[#10B981] group-hover:text-[#6EE7B7]'
                          }`
                    }`}
                  />
                  <span className="truncate transition-transform duration-300 group-hover:translate-x-0.5">{item.label}</span>
                </span>

                <span
                  className={`relative z-10 w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#000000]/20 text-[#000000]'
                      : isSolar
                      ? 'bg-[#000000] border border-[#262626] text-yellow-400 group-hover:border-yellow-400/60 group-hover:rotate-45 group-hover:scale-110 group-hover:shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                      : 'bg-[#000000] border border-[#262626] text-[#10B981] group-hover:border-[#10B981]/70 group-hover:rotate-45 group-hover:scale-110 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.45)]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Verification Prompt for newly registered Email/Password accounts */}
      {firebaseUid && !isEmailVerified && (
        <div className="w-full px-4 sm:px-8 pt-4">
          <div className="w-full px-4 py-3 rounded-2xl bg-[#09140F] border border-[#10B981]/35 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-[#D1D5DB]">
              <span className="font-semibold text-[#10B981]">Verify your email to enable Cloud Firestore sync:</span>{' '}
              Check <span className="text-white font-medium">{user?.email}</span> for your verification link.
              {verifyNotice && <span className="ml-2 text-[#6EE7B7]">({verifyNotice})</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  const res = await resendVerificationEmail();
                  setVerifyNotice(res.ok ? 'Verification email sent' : res.error || 'Try again shortly');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-white font-medium cursor-pointer"
              >
                Resend Email
              </button>
              <button
                type="button"
                onClick={async () => {
                  const verified = await refreshEmailVerification();
                  setVerifyNotice(verified ? 'Verified & Synced!' : 'Not verified yet — check inbox');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-black font-bold cursor-pointer"
              >
                I&apos;ve Verified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN DASHBOARD VIEWPORT (Full-Width Responsive Canvas)
         ========================================================================= */}
      <main className="flex-1 w-full px-4 sm:px-8 py-6">
        {dashboardTab === 'overview' && <OverviewTab />}
        {dashboardTab === 'solar' && <SolarTab />}
        {dashboardTab === 'battery' && <BatteryTab />}
        {dashboardTab === 'ev' && <EVChargingTab />}
        {dashboardTab === 'smart-meter' && <SmartMeterTab />}
        {dashboardTab === 'carbon' && <CarbonTab />}
        {dashboardTab === 'waste' && <WasteTab />}
        {dashboardTab === 'reports' && <ReportsTab />}
        {dashboardTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
