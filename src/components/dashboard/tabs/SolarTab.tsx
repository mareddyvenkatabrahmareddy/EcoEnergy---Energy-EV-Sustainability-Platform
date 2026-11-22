import React from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Sun,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { DoubleAreaChart, CircularGauge } from '../../common/ChartComponents.tsx';

export const SolarTab: React.FC = () => {
  const { solar } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl hover:border-[#00C781]/60 hover:shadow-[0_0_20px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span>Daily Solar Generation</span>
            <span className="text-[#00E5A0] text-[11px] font-medium">+14.2%</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-white">
            {solar.todayGenerationKwh} <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Peak output: {solar.currentPowerKw} kW at 12:45 PM
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl hover:border-[#00C781]/60 hover:shadow-[0_0_20px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span>Weekly Solar Generation</span>
            <span className="text-[#00E5A0] text-[11px] font-medium">+8.7%</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-white">
            {solar.weeklyGenerationKwh.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            7-day campus solar total
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl hover:border-[#00C781]/60 hover:shadow-[0_0_20px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span>Monthly Solar Generation</span>
            <span className="text-[#00C781] text-[11px] font-medium">Nov 2026</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-white">
            {solar.monthlyGenerationKwh.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Target: 12,000 kWh (87% achieved)
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl hover:border-[#00C781]/60 hover:shadow-[0_0_20px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span>Solar Irradiance</span>
            <span className="text-[#00E5A0] text-[11px] font-mono-num">Optimal</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {solar.irradianceWm2} <span className="text-sm font-normal text-[#AAB8C5]">W/m²</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Clear sky with direct sunlight incidence
          </div>
        </div>
      </div>

      {/* Main Charts & Inverter Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photovoltaic Generation Curve */}
        <div className="lg:col-span-8 bg-[#101010] border border-[#292929] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Solar Photovoltaic Generation Profile
              </h3>
              <p className="text-xs text-[#AAB8C5] mt-0.5">
                Real-time inverter telemetry tracking generation vs local campus consumption
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-[#101010] text-white border border-[#292929] rounded-lg font-medium">
              12-Hour Timeline
            </span>
          </div>

          <DoubleAreaChart data={solar.hourlyGeneration} height={280} />
        </div>

        {/* Efficiency & Inverter Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Circular Efficiency Gauge */}
          <div className="bg-[#101010] border border-[#292929] rounded-2xl p-6 flex flex-col items-center">
            <h4 className="font-heading text-sm font-bold text-white mb-2">
              Solar Panel Photovoltaic Efficiency
            </h4>
            <CircularGauge
              value={solar.efficiencyPercent}
              max={30}
              unit="%"
              label="Efficiency"
              sublabel="High-Efficiency Monocrystalline Bifacial Array"
              color="#00C781"
              size={170}
            />
            <div className="w-full mt-4 pt-4 border-t border-[#101010] grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-[#101010] rounded-lg">
                <span className="text-[#AAB8C5] block text-[10px]">Cell Temperature</span>
                <span className="font-mono-num font-bold text-white">{solar.cellTemperatureC}°C</span>
              </div>
              <div className="p-2 bg-[#101010] rounded-lg">
                <span className="text-[#AAB8C5] block text-[10px]">Thermal Loss</span>
                <span className="font-mono-num font-bold text-[#00E5A0]">-0.24%</span>
              </div>
            </div>
          </div>

          {/* String Inverter Health Status */}
          <div className="bg-[#101010] border border-[#292929] rounded-2xl p-5">
            <h4 className="font-heading text-sm font-bold text-white mb-3">
              Dual String Inverters Telemetry
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-[#101010] border border-[#292929] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                    <span className="text-xs font-bold text-white">Inverter Alpha (SMA 50kW)</span>
                  </div>
                  <span className="text-[11px] text-[#AAB8C5]">Rooftop Canopy String 01–06</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono-num font-bold text-[#00E5A0]">
                    {solar.inverterAPowerKw} kW
                  </span>
                  <span className="text-[10px] text-[#00C781] block">Nominal</span>
                </div>
              </div>

              <div className="p-3 bg-[#101010] border border-[#292929] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                    <span className="text-xs font-bold text-white">Inverter Beta (SMA 50kW)</span>
                  </div>
                  <span className="text-[11px] text-[#AAB8C5]">Carport Array String 07–12</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono-num font-bold text-[#00E5A0]">
                    {solar.inverterBPowerKw} kW
                  </span>
                  <span className="text-[10px] text-[#00C781] block">Nominal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
