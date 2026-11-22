import React from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Recycle,
  ArrowRight,
} from 'lucide-react';
import { CircularGauge } from '../../common/ChartComponents.tsx';

export const WasteTab: React.FC = () => {
  const { waste, setDashboardTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Waste Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl">
          <span className="text-xs text-[#AAB8C5] block mb-1">Total Waste Collected</span>
          <div className="text-3xl font-extrabold font-mono-num text-white">
            {waste.totalCollectedKg.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Campus-wide collection cycle
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl">
          <span className="text-xs text-[#AAB8C5] block mb-1">Total Waste Recycled & Reused</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {waste.totalRecycledKg.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            87.1% Circular Efficiency
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl">
          <span className="text-xs text-[#AAB8C5] block mb-1">Energy Recovered (Biogas)</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00C781]">
            {waste.energyRecoveryKwh.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Fed to campus microgrid
          </div>
        </div>

        <div className="p-5 bg-[#101010] border border-[#292929] rounded-2xl">
          <span className="text-xs text-[#AAB8C5] block mb-1">Compost Produced</span>
          <div className="text-3xl font-extrabold font-mono-num text-white">
            {waste.compostedKg.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kg</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Organic nutrient-dense soil amendment
          </div>
        </div>
      </div>

      {/* Circular Efficiency Gauge & Visual Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#101010] border border-[#292929] rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full text-center">
            <h3 className="font-heading text-base font-bold text-white mb-2">
              Circular Economy Index
            </h3>
            <CircularGauge
              value={waste.circularEfficiencyPercent}
              max={100}
              unit="%"
              label="Efficiency"
              sublabel="Landfill Diversion: 88.4%"
              color="#00C781"
              size={170}
            />
          </div>

          <div className="w-full mt-4 pt-4 border-t border-[#101010] space-y-2 text-xs">
            <div className="flex justify-between text-[#AAB8C5]">
              <span>Landfill Avoided</span>
              <span className="text-[#00E5A0] font-mono-num font-bold">11,005 kg</span>
            </div>
            <div className="flex justify-between text-[#AAB8C5]">
              <span>Residual Non-Recyclable</span>
              <span className="text-white font-mono-num">1,445 kg</span>
            </div>
          </div>
        </div>

        {/* Circular Stream Categories */}
        <div className="lg:col-span-8 bg-[#101010] border border-[#292929] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Material Streams & Value Conversion
              </h3>
              <p className="text-xs text-[#AAB8C5] mt-0.5">
                Segregation streams and secondary value-added recycling pathways
              </p>
            </div>
            <span className="text-xs text-[#00E5A0] font-mono-num">Zero-Waste Standard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {waste.categories.map((cat, i) => (
              <div
                key={i}
                className="p-4 bg-[#101010] border border-[#292929] rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{cat.type}</span>
                  <span className="text-[10px] text-[#00E5A0] font-mono-num">
                    {Math.round((cat.recycledKg / cat.collectedKg) * 100)}% Recycled
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#000000] rounded-lg">
                    <span className="text-[#AAB8C5] block text-[10px]">Collected</span>
                    <span className="font-mono-num font-bold text-white">{cat.collectedKg} kg</span>
                  </div>
                  <div className="p-2 bg-[#000000] rounded-lg">
                    <span className="text-[#AAB8C5] block text-[10px]">Processed</span>
                    <span className="font-mono-num font-bold text-[#00E5A0]">{cat.recycledKg} kg</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#AAB8C5] pt-1">
                  Pathway: <span className="text-white">{cat.conversionType}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#101010] flex items-center justify-between">
            <span className="text-xs text-[#AAB8C5]">
              Weekly Waste-to-Value verification certificate #W2V-2026-881
            </span>
            <button
              onClick={() => setDashboardTab('reports')}
              className="text-xs font-semibold text-[#00E5A0] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Download Waste Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
