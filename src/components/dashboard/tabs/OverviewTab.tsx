import React, { useState } from 'react';
import {
  Sun,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const formattedToday = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // 11 Months data matching the reference image (Feb through Dec)
  const consumptionData = [
    { month: 'Feb', monthly: 240, daily: 90, current: 70 },
    { month: 'Mar', monthly: 300, daily: 110, current: 80 },
    { month: 'Apr', monthly: 380, daily: 130, current: 95 },
    { month: 'May', monthly: 470, daily: 150, current: 110 },
    { month: 'Jun', monthly: 540, daily: 170, current: 130 },
    { month: 'Jul', monthly: 430, daily: 140, current: 90 },
    { month: 'Aug', monthly: 330, daily: 120, current: 85 },
    { month: 'Sep', monthly: 370, daily: 130, current: 95 },
    { month: 'Oct', monthly: 410, daily: 140, current: 105 },
    { month: 'Nov', monthly: 490, daily: 160, current: 120 },
    { month: 'Dec', monthly: 560, daily: 180, current: 135 },
  ];

  // Energy Contribution Bar Chart Data (Solar Power vs Grid Electricity)
  const [contributionView, setContributionView] = useState<'weekly' | 'hourly'>('weekly');
  const [hoveredContribution, setHoveredContribution] = useState<number | null>(null);

  const weeklyContribution = [
    { period: 'Mon', solar: 48, grid: 24, label: 'Mon' },
    { period: 'Tue', solar: 54, grid: 20, label: 'Tue' },
    { period: 'Wed', solar: 58, grid: 18, label: 'Wed' },
    { period: 'Thu', solar: 50, grid: 26, label: 'Thu' },
    { period: 'Fri', solar: 62, grid: 16, label: 'Fri' },
    { period: 'Sat', solar: 56, grid: 22, label: 'Sat' },
    { period: 'Sun', solar: 46, grid: 28, label: 'Sun' },
  ];

  const hourlyContribution = [
    { period: '04:00', solar: 10, grid: 42, label: '4 AM' },
    { period: '08:00', solar: 42, grid: 22, label: '8 AM' },
    { period: '12:00', solar: 64, grid: 12, label: '12 PM' },
    { period: '16:00', solar: 52, grid: 18, label: '4 PM' },
    { period: '20:00', solar: 24, grid: 38, label: '8 PM' },
    { period: '24:00', solar: 8, grid: 44, label: '12 AM' },
  ];

  const contributionData = contributionView === 'weekly' ? weeklyContribution : hourlyContribution;

  return (
    <div className="space-y-6 text-white pb-8 select-none">
      {/* =========================================================================
          TOP ROW:
          1. Large Solar House Illustration Card (Left)
          2. Energy Consumption Chart Card with Segmented Monthly Bars (Right)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. LARGE SOLAR-POWERED HOUSE CARD (6 COLS) */}
        <div className="group lg:col-span-6 bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#10B981]/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.22),inset_0_0_20px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300">
          {/* Subtle Ambient Radial Lighting & Emerald Hover Light */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

          {/* Top Row: Weather Info (Left) & Energy Telemetry (Right) */}
          <div className="relative z-10 flex items-start justify-between mb-2">
            {/* Weather Widget with Yellow Sun Icon & Degree Celsius */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-400/15 border border-yellow-400/35 flex items-center justify-center text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.25)]">
                <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-white tracking-wide block">
                  Sunny · 32°C
                </span>
                <span className="text-xs text-[#9CA3AF] block font-medium">
                  {formattedToday}
                </span>
              </div>
            </div>

            {/* Energy Metric Callout */}
            <div className="text-right">
              <span className="text-xs text-[#9CA3AF] font-medium block">Energy</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono-num flex items-baseline justify-end gap-1">
                <span>10200</span>
                <span className="text-xs font-normal text-[#9CA3AF]">W</span>
              </div>
            </div>
          </div>

          {/* Uploaded Solar Eco-Villa House Photo */}
          <div className="relative z-10 w-full my-2 rounded-2xl overflow-hidden border border-[#222222] shadow-inner">
            <img
              src="/assets/aistudio/image_6fb71f70.png"
              alt="EcoEnergy Modern Solar Eco-Villa"
              className="w-full h-56 sm:h-64 object-cover object-center"
            />
            {/* Ambient vignette and overlay telemetry badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30 pointer-events-none" />

            {/* Overlaid Telemetry Pill on House Photo */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#10B981]/50 flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
                <span className="text-[11px] font-mono-num font-bold text-white">4.8 kW Gen</span>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700/80 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] text-[#D1D5DB] font-medium">Rooftop PV System Active</span>
              </div>
              <div className="hidden sm:flex px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700/80 items-center gap-1.5 shadow-md">
                <span className="text-[11px] text-[#9CA3AF] font-mono-num">Grid: Balanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ENERGY CONSUMPTION CHART CARD (6 COLS) */}
        <div className="group lg:col-span-6 bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-7 relative shadow-2xl flex flex-col justify-between hover:border-[#10B981]/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.22),inset_0_0_20px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300">
          {/* Subtle Ambient Emerald Hover Light */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

          <div className="relative z-10">
            {/* Header: Title and "This Year ↗" Pill Button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Energy Consumption
              </h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000000] border border-[#262626] text-xs font-semibold text-white hover:border-[#10B981] transition-all cursor-pointer">
                <span>This Year</span>
                <span className="w-4 h-4 rounded-full bg-[#141414] flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-[#10B981]" />
                </span>
              </button>
            </div>

            {/* Sub-Legend with stark, high-contrast distinct colors */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium mb-6">
              <span className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-2.5 py-1.5 rounded-xl">
                <span className="w-3.5 h-3.5 rounded-md bg-[#047857] border border-[#065F46]" />
                <span className="text-gray-200 font-medium">Monthly Consumption</span>
              </span>
              <span className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-2.5 py-1.5 rounded-xl">
                <span className="w-3.5 h-3.5 rounded-md bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <span className="text-gray-200 font-medium">Daily Consumption</span>
              </span>
              <span className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-2.5 py-1.5 rounded-xl">
                <span className="w-3.5 h-3.5 rounded-md bg-[#A7F3D0] border border-white/60 shadow-[0_0_6px_rgba(167,243,208,0.6)]" />
                <span className="text-gray-200 font-medium">Current Consumption</span>
              </span>
            </div>

            {/* SVG Definitions for the Hatch Pattern on Top Capsules */}
            <svg className="w-0 h-0 absolute">
              <defs>
                <pattern
                  id="hatchPatternEmerald"
                  width="6"
                  height="6"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.8" />
                  <line x1="0" y1="0" x2="6" y2="0" stroke="#A7F3D0" strokeWidth="4.2" />
                </pattern>
              </defs>
            </svg>

            {/* Segmented Monthly Bar Graph */}
            <div className="relative pt-2">
              {/* Y-Axis Grid Lines & Numbers */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-8">
                {[900, 800, 674, 300, 200].map((val) => (
                  <div key={val} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#9CA3AF] font-mono-num w-6 text-right">
                      {val}
                    </span>
                    <div className="flex-1 border-b border-[#222222]" />
                  </div>
                ))}
              </div>

              {/* 11 Monthly Bars (Feb - Dec) with clear color distinction */}
              <div className="h-48 sm:h-52 flex items-end justify-between pl-10 pr-2 relative z-10">
                {consumptionData.map((d, i) => {
                  const maxH = 900;
                  const monthlyH = Math.round((d.monthly / maxH) * 160);
                  const dailyH = Math.round((d.daily / maxH) * 160);
                  const currentH = Math.round((d.current / maxH) * 160);
                  const isHovered = hoveredMonth === i;

                  return (
                    <div
                      key={d.month}
                      onMouseEnter={() => setHoveredMonth(i)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group/bar cursor-pointer"
                    >
                      {/* Segmented Stacked Pill Bar */}
                      <div className="w-5 sm:w-6 flex flex-col gap-1 items-center justify-end">
                        {/* Top Segment: Current Consumption in Light Mint / Diagonal Stripe */}
                        <div
                          className={`w-full rounded-md border border-[#A7F3D0] shadow-sm transition-all ${
                            isHovered ? 'scale-105 shadow-[0_0_10px_#A7F3D0]' : ''
                          }`}
                          style={{
                            height: `${currentH}px`,
                            backgroundImage: 'url(#hatchPatternEmerald)',
                          }}
                        />

                        {/* Middle Segment: Daily Consumption in Vibrant Bright Emerald */}
                        <div
                          style={{ height: `${dailyH}px` }}
                          className={`w-full rounded-md bg-gradient-to-t from-[#059669] to-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all ${
                            isHovered ? 'scale-105 shadow-[0_0_12px_#10B981]' : ''
                          }`}
                        />

                        {/* Bottom Segment: Monthly Consumption in Deep Forest Pine */}
                        <div
                          style={{ height: `${monthlyH}px` }}
                          className={`w-full rounded-md bg-gradient-to-t from-[#064E3B] to-[#047857] border border-[#065F46]/50 transition-all ${
                            isHovered ? 'scale-105 bg-[#059669]' : ''
                          }`}
                        />
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-[10px] mt-2.5 font-medium transition-colors ${
                          isHovered ? 'text-[#10B981] font-bold' : 'text-[#9CA3AF]'
                        }`}
                      >
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW (3 CARDS):
          3. Bottom-Left: Battery Level card showing 80% with 10 Capsule Indicators
          4. Bottom-Middle: Panel Efficiency card showing 50% with Split Indicator
          5. Bottom-Right: Energy Contribution Dotted Matrix Area Chart
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. BOTTOM-LEFT: BATTERY LEVEL CARD (80%) */}
        <div className="group bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#10B981]/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.22),inset_0_0_20px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          {/* Subtle Ambient Emerald Hover Light */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

          <div className="relative z-10">
            {/* Round Badge Icon */}
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] mb-4">
              <Zap className="w-5 h-5 fill-black text-black" />
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Battery Level
            </h3>

            {/* Big 80% Metric in Emerald */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] font-mono-num mt-1">
              80%
            </div>
          </div>

          {/* EXACT 10 CAPSULE INDICATORS (8 Filled with Lightning Bolt, 2 Dark) */}
          <div className="relative z-10 mt-6 flex items-center justify-between gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => {
              const isFilled = idx <= 8; // 8 of 10 = 80%
              return (
                <div
                  key={idx}
                  className={`flex-1 h-16 sm:h-20 rounded-xl flex items-center justify-center transition-all ${
                    isFilled
                      ? 'bg-gradient-to-t from-[#047857] via-[#10B981] to-[#6EE7B7] shadow-[0_0_10px_rgba(16,185,129,0.35)]'
                      : 'bg-[#141414] border border-[#262626]'
                  }`}
                >
                  {isFilled && (
                    <Zap className="w-4 h-4 text-white fill-white drop-shadow" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. BOTTOM-MIDDLE: PANEL EFFICIENCY CARD (50%) */}
        <div className="group bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#10B981]/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.22),inset_0_0_20px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          {/* Subtle Ambient Emerald Hover Light */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

          <div className="relative z-10">
            {/* Round Badge Icon - Yellow Sun with Rotation & Glow Hover Animation */}
            <div className="w-10 h-10 rounded-full bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.35)] mb-4 group-hover:rotate-90 group-hover:scale-115 group-hover:shadow-[0_0_22px_rgba(250,204,21,0.6)] group-hover:border-yellow-400 transition-all duration-500">
              <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Panel Efficiency
            </h3>

            {/* Big 50% Metric in Emerald */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] font-mono-num mt-1 group-hover:text-[#6EE7B7] transition-colors">
              50%
            </div>
          </div>

          {/* EXACT 50% SPLIT INDICATOR: Left 50% Solid Pill + Right 50% Vertical Ticks */}
          <div className="relative z-10 mt-6">
            <div className="flex items-center gap-1.5 h-12 w-full">
              {/* Left 50% Solid Emerald Block with Centered Lightning Bolt */}
              <div className="flex-1 h-full rounded-xl bg-gradient-to-r from-[#047857] to-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all">
                <Zap className="w-5 h-5 text-white fill-white drop-shadow group-hover:scale-110 transition-transform" />
              </div>

              {/* Right 50% Array of ~24 Vertical Emerald Ticks */}
              <div className="flex-1 h-full flex items-center justify-between gap-1 px-1">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-7 rounded-full bg-[#10B981] opacity-75 group-hover:opacity-100 group-hover:shadow-[0_0_6px_#10B981] transition-all"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM-RIGHT: ENERGY CONTRIBUTION BAR CHART */}
        <div className="group bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#10B981]/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.22),inset_0_0_20px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          {/* Subtle Ambient Emerald Hover Light */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              {/* Header: Title, Period Toggle & Arrow Button */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                  Energy Contribution
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#141414] border border-[#262626] rounded-full p-0.5 text-[11px] font-semibold">
                    <button
                      onClick={() => setContributionView('weekly')}
                      className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        contributionView === 'weekly'
                          ? 'bg-[#10B981] text-black font-bold shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setContributionView('hourly')}
                      className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        contributionView === 'hourly'
                          ? 'bg-[#10B981] text-black font-bold shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Day
                    </button>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-[#000000] border border-[#262626] flex items-center justify-center text-[#10B981] hover:border-[#10B981] transition-colors cursor-pointer">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clear Names & Legend Badges with Solar Hover Effect */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs mb-3">
                <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] hover:border-[#10B981] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] px-3 py-1.5 rounded-xl shadow-sm transition-all duration-300 cursor-pointer group/solarbadge">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] group-hover/solarbadge:scale-125 transition-transform" />
                  <span className="font-semibold text-white tracking-wide group-hover/solarbadge:text-[#10B981]">Solar Power</span>
                  <span className="text-[11px] font-mono-num font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded ml-1">
                    64%
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="w-3 h-3 rounded-md bg-[#6EE7B7] shadow-[0_0_8px_#6EE7B7]" />
                  <span className="font-semibold text-white tracking-wide">Grid Electricity</span>
                  <span className="text-[11px] font-mono-num font-bold text-[#6EE7B7] bg-[#6EE7B7]/15 px-1.5 py-0.5 rounded ml-1">
                    36%
                  </span>
                </div>
              </div>
            </div>

            {/* High-Definition Dual Bar Chart */}
            <div className="relative pt-2">
              {/* Tooltip on Hover */}
              {hoveredContribution !== null && (
                <div className="absolute top-0 right-0 bg-[#161616] border border-[#10B981]/40 px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-2 shadow-lg z-20 pointer-events-none">
                  <span className="font-bold text-white">{contributionData[hoveredContribution].period}:</span>
                  <span className="text-[#10B981] font-semibold">{contributionData[hoveredContribution].solar} kWh Solar</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-[#6EE7B7] font-semibold">{contributionData[hoveredContribution].grid} kWh Grid</span>
                </div>
              )}

              {/* Y-Axis Grid Lines & Numbers */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2 pb-6">
                {[60, 40, 20, 0].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono-num w-5 text-right">
                      {val}
                    </span>
                    <div className="flex-1 border-b border-[#222222]" />
                  </div>
                ))}
              </div>

              {/* Dual Bar Columns Container */}
              <div className="h-36 sm:h-40 flex items-end justify-between pl-8 pr-2 pb-6 relative z-10 gap-2 sm:gap-3">
                {contributionData.map((d, i) => {
                  const maxH = 70;
                  const solarH = Math.round((d.solar / maxH) * 115);
                  const gridH = Math.round((d.grid / maxH) * 115);
                  const isHovered = hoveredContribution === i;

                  return (
                    <div
                      key={d.period}
                      onMouseEnter={() => setHoveredContribution(i)}
                      onMouseLeave={() => setHoveredContribution(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group/col cursor-pointer"
                    >
                      {/* Paired Dual Bars: Solar (Left) & Grid (Right) */}
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-0.5">
                        {/* Solar Power Bar */}
                        <div
                          style={{ height: `${solarH}px` }}
                          className={`w-3 sm:w-3.5 rounded-t-md bg-gradient-to-t from-[#047857] to-[#10B981] transition-all duration-200 ${
                            isHovered
                              ? 'scale-y-105 shadow-[0_0_12px_#10B981] brightness-125'
                              : 'shadow-[0_0_5px_rgba(16,185,129,0.3)]'
                          }`}
                        />

                        {/* Grid Electricity Bar */}
                        <div
                          style={{ height: `${gridH}px` }}
                          className={`w-3 sm:w-3.5 rounded-t-md bg-gradient-to-t from-[#059669] to-[#6EE7B7] transition-all duration-200 ${
                            isHovered
                              ? 'scale-y-105 shadow-[0_0_12px_#6EE7B7] brightness-125'
                              : 'shadow-[0_0_5px_rgba(110,231,183,0.3)]'
                          }`}
                        />
                      </div>

                      {/* Period Label */}
                      <span
                        className={`text-[10px] mt-2 font-medium transition-colors ${
                          isHovered ? 'text-white font-bold' : 'text-gray-400'
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
