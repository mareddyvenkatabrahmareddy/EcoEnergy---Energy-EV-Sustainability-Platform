import React from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Gauge,
  AlertTriangle,
  Bell,
} from 'lucide-react';
import { DoubleAreaChart } from '../../common/ChartComponents.tsx';

export const SmartMeterTab: React.FC = () => {
  const { smartMeter, solar } = useApp();

  return (
    <div className="space-y-6">
      {/* Vital Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Real-Time Electricity Demand</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {smartMeter.currentDemandKw} <span className="text-sm font-normal text-[#AAB8C5]">kW</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            Peak Today: {smartMeter.peakDemandTodayKw} kW
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Daily Facility Usage</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {smartMeter.todayConsumptionKwh}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Solar Self-Consumption: {smartMeter.solarSelfConsumptionKwh} kWh
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Monthly Electricity Usage</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {smartMeter.monthlyConsumptionKwh.toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            -8.4% vs previous billing cycle
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Grid Power Quality</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {smartMeter.powerFactor} <span className="text-sm font-normal text-[#AAB8C5]">PF</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Frequency: {smartMeter.gridFrequencyHz} Hz (Nominal)
          </div>
        </div>
      </div>

      {/* Main Graph & Subsystem Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Load Profile Chart */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Campus Power Consumption & Load Curve
              </h3>
              <p className="text-xs text-[#AAB8C5] mt-0.5">
                Real-time sub-metering comparing HVAC, EV charging hubs, and general building load
              </p>
            </div>
            <span className="text-xs font-mono-num text-[#00E5A0] px-2.5 py-1 bg-[#121212] border border-[#262626] rounded-lg">
              Grid Import: {smartMeter.gridImportKwh} kWh
            </span>
          </div>

          <DoubleAreaChart data={solar.hourlyGeneration} height={260} />
        </div>

        {/* Subsystem Breakdown */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4">
              Subsystem Demand Breakdown
            </h3>
            <div className="space-y-3">
              {smartMeter.breakdown.map((item, i) => {
                const barColor =
                  i === 0 ? '#00C781' : i === 1 ? '#00E5A0' : i === 2 ? '#38BDF8' : '#818CF8';
                return (
                  <div
                    key={i}
                    className="group/sub space-y-1.5 p-2 -mx-2 rounded-xl hover:bg-[#121212] hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="text-[#AAB8C5] group-hover/sub:text-white font-medium transition-colors">{item.category}</span>
                      <span className="font-mono-num text-white">
                        {item.kwh} kWh ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover/sub:brightness-125"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A] mt-6 text-xs text-[#AAB8C5]">
            <span className="text-[#00E5A0] font-bold">95.6%</span> of all electricity consumed today was generated directly on-site via solar & battery storage.
          </div>
        </div>
      </div>

      {/* High-Consumption Spikes & Real-Time Alerts Log */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00E5A0]" />
            <h3 className="font-heading text-base font-bold text-white">
              High-Consumption Threshold Alerts & Spike Log
            </h3>
          </div>
          <span className="text-xs text-[#AAB8C5]">
            Alert Threshold Configured at: <strong className="text-white">40.0 kW</strong>
          </span>
        </div>

        <div className="space-y-3">
          {smartMeter.alerts.map((alert) => (
            <div
              key={alert.id}
              className="group/alert p-4 bg-[#121212] border border-[#262626] rounded-xl flex items-start gap-4 hover:border-[#10B981]/60 hover:bg-[#101814] hover:shadow-[0_0_18px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover/alert:scale-110 transition-transform duration-300 ${
                  alert.level === 'warning'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-[#00C781]/10 text-[#00E5A0]'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-num text-[#AAB8C5]">{alert.time}</span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      alert.level === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-[#00E5A0] border border-emerald-500/30'
                    }`}
                  >
                    {alert.level}
                  </span>
                </div>
                <p className="text-xs text-white mt-1 group-hover/alert:text-[#6EE7B7] transition-colors">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
