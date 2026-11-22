import React from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Trees,
  Fuel,
  Car,
  Award,
} from 'lucide-react';
import { CarbonBarChart } from '../../common/ChartComponents.tsx';

export const CarbonTab: React.FC = () => {
  const { carbon } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Carbon Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Total CO₂ Saved (To Date)</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {carbon.totalSavedKg.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            14.82 Metric Tonnes total abatement
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Daily Carbon Savings</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {carbon.todaySavedKg}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg CO₂</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            +12.4% vs campus average
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Monthly Carbon Savings</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {carbon.monthSavedKg.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg CO₂</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            November 2026 reporting cycle
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Emissions Intensity Factor</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {carbon.siteIntensityKgPerKwh}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg/kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Grid Benchmark: {carbon.gridIntensityKgPerKwh} kg/kWh (90% cleaner)
          </div>
        </div>
      </div>

      {/* Environmental Impact Equivalencies Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="group p-5 bg-[#0A0A0A] border border-[#00C781]/30 rounded-2xl flex items-center gap-4 hover:border-[#10B981]/80 hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center text-[#00E5A0] shrink-0 group-hover:scale-110 group-hover:bg-[#00C781]/20 transition-all duration-300">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
              {carbon.treesEquivalent}{' '}
              <span className="text-xs font-normal text-[#AAB8C5]">Trees</span>
            </div>
            <span className="text-xs text-[#AAB8C5]">
              Equivalent 10-year mature tree carbon sequestration
            </span>
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-emerald-500/30 rounded-2xl flex items-center gap-4 hover:border-[#10B981]/80 hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00E5A0] shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
              {carbon.gasolineGallonsAvoided.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#AAB8C5]">Gallons</span>
            </div>
            <span className="text-xs text-[#AAB8C5]">
              Gasoline avoided through EV fleet & solar displacement
            </span>
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-sky-500/30 rounded-2xl flex items-center gap-4 hover:border-sky-400/80 hover:shadow-[0_0_28px_rgba(56,189,248,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-300">
            <Car className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-num text-white group-hover:text-sky-300 transition-colors">
              {carbon.vehicleMilesOffset.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#AAB8C5]">Miles</span>
            </div>
            <span className="text-xs text-[#AAB8C5]">
              Average gasoline passenger vehicle miles eliminated
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Carbon Reduction Breakdown Stacked Chart */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">
              6-Month Carbon Reduction Trajectory
            </h3>
            <p className="text-xs text-[#AAB8C5] mt-0.5">
              Verified monthly CO₂ abatements categorized by solar generation, EV charging displacement, and circular waste valorization
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-[#121212] text-white border border-[#262626] rounded-lg">
            Scope 1 & 2 Audited
          </span>
        </div>

        <CarbonBarChart data={carbon.monthlyHistory} height={240} />
      </div>

      {/* ESG Compliance Statement */}
      <div className="group p-6 bg-[#0A0A0A] border border-[#222222] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center text-[#00E5A0] shrink-0 group-hover:scale-110 group-hover:bg-[#00C781]/20 transition-all duration-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#6EE7B7] transition-colors">GHG Protocol & ISO 14064 Compliance</h4>
            <p className="text-xs text-[#AAB8C5] mt-0.5">
              All carbon calculations use EPA eGRID 2026 subregion emission factors and are pre-formatted for corporate sustainability filings.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-num text-[#00E5A0] whitespace-nowrap">
          Audit Status: Verified
        </span>
      </div>
    </div>
  );
};
