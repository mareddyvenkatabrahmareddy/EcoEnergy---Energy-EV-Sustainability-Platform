import React from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  BatteryCharging,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { CircularGauge } from '../../common/ChartComponents.tsx';

export const BatteryTab: React.FC = () => {
  const { battery, setBatteryMode } = useApp();

  return (
    <div className="space-y-6">
      {/* Top BMS Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span className="group-hover:text-white transition-colors">Battery State of Charge (SoC)</span>
            <span className="text-[#00E5A0] text-[11px] font-mono-num font-semibold">
              {battery.status}
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {battery.socPercent}%
          </div>
          <div className="mt-2 text-xs text-[#AAB8C5]">
            Available: {battery.capacityKwh} / {battery.totalCapacityKwh} kWh
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span className="group-hover:text-white transition-colors">State of Health (SoH)</span>
            <span className="text-[#00E5A0] text-[11px] font-medium">Grade A+</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {battery.sohPercent}%
          </div>
          <div className="mt-2 text-xs text-[#AAB8C5]">
            {battery.cycleCount} lifetime charge cycles
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span className="group-hover:text-white transition-colors">Pack Core Temperature</span>
            <span className="text-[#00E5A0] text-[11px] font-medium">Optimal</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {battery.temperatureC}°C
          </div>
          <div className="mt-2 text-xs text-[#AAB8C5]">
            Liquid thermal loop active (20°C - 30°C target)
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between text-[#AAB8C5] text-xs mb-1">
            <span className="group-hover:text-white transition-colors">Active Power Flow</span>
            <span className="text-[#00E5A0] text-[11px] font-mono-num">Bi-Directional</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {battery.flowKw > 0 ? `+${battery.flowKw}` : battery.flowKw}{' '}
            <span className="text-sm font-normal text-[#AAB8C5]">kW</span>
          </div>
          <div className="mt-2 text-xs text-[#AAB8C5]">
            Cell balance delta: ±0.03V
          </div>
        </div>
      </div>

      {/* BMS Main Centerpiece & Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BMS Dispatch Simulator & Gauge */}
        <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-white">
                BESS Energy Reserve
              </h3>
              <span className="text-xs px-2 py-0.5 bg-[#00C781]/20 text-[#00E5A0] border border-[#00C781]/30 rounded font-medium">
                100 kWh Lithium Iron Phosphate (LFP)
              </span>
            </div>

            <CircularGauge
              value={battery.socPercent}
              max={100}
              unit="%"
              label="Stored Capacity"
              sublabel={`${battery.capacityKwh} kWh Stored Energy`}
              color="#00C781"
              size={180}
            />

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-[#AAB8C5]">
                <span>Cell Voltage Range</span>
                <span className="font-mono-num text-white">
                  {battery.cellVoltageMin}V – {battery.cellVoltageMax}V (Balanced)
                </span>
              </div>
              <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00C781] to-[#00E5A0] h-full rounded-full transition-all duration-500"
                  style={{ width: `${battery.socPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive BMS Mode Controls */}
          <div className="pt-6 border-t border-[#1A1A1A] mt-6">
            <span className="text-xs font-semibold text-[#AAB8C5] block mb-2">
              Dispatch Inverter Override
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBatteryMode('Charging')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  battery.status === 'Charging'
                    ? 'bg-[#00C781] border-[#00C781] text-[#000000] font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                    : 'bg-[#121212] border-[#262626] text-[#AAB8C5] hover:text-white hover:border-[#10B981]/60 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                Charge (Solar)
              </button>
              <button
                onClick={() => setBatteryMode('Discharging')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  battery.status === 'Discharging'
                    ? 'bg-[#00C781] border-[#00C781] text-[#000000] font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                    : 'bg-[#121212] border-[#262626] text-[#AAB8C5] hover:text-white hover:border-[#10B981]/60 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                Discharge (Facility)
              </button>
              <button
                onClick={() => setBatteryMode('Standby')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  battery.status === 'Standby'
                    ? 'bg-[#00C781] border-[#00C781] text-[#000000] font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                    : 'bg-[#121212] border-[#262626] text-[#AAB8C5] hover:text-white hover:border-[#10B981]/60 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                Standby Float
              </button>
            </div>
          </div>
        </div>

        {/* 4 Lithium Modules Telemetry Rack */}
        <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 hover:border-[#10B981]/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Rack Lithium Modules & Cell String Health
              </h3>
              <p className="text-xs text-[#AAB8C5] mt-0.5">
                4× 25kWh modular racks with independent thermal and voltage sensing
              </p>
            </div>
            <span className="text-xs text-[#00E5A0] font-mono-num">All Cells Balanced</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {battery.modules.map((mod) => (
              <div
                key={mod.id}
                className="group/mod p-4 bg-[#121212] border border-[#262626] rounded-xl space-y-3 hover:border-[#10B981]/70 hover:bg-[#101814] hover:shadow-[0_0_22px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00E5A0] group-hover/mod:scale-110 transition-transform duration-300" />
                    <span className="text-xs font-bold text-white group-hover/mod:text-[#6EE7B7] transition-colors">{mod.id}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/30 text-[#00E5A0] rounded font-medium">
                    {mod.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#000000] border border-[#1E1E1E] group-hover/mod:border-[#10B981]/25 rounded-lg transition-colors">
                    <span className="text-[#AAB8C5] block text-[10px]">Bus Voltage</span>
                    <span className="font-mono-num font-bold text-white">{mod.voltage} V</span>
                  </div>
                  <div className="p-2 bg-[#000000] border border-[#1E1E1E] group-hover/mod:border-[#10B981]/25 rounded-lg transition-colors">
                    <span className="text-[#AAB8C5] block text-[10px]">Thermistor</span>
                    <span className="font-mono-num font-bold text-white">{mod.temp} °C</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#AAB8C5] flex justify-between pt-1">
                  <span>Balance Shunt: Inactive</span>
                  <span className="text-[#00E5A0]">100% SOH</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charge / Discharge History Timeline */}
          <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
            <h4 className="text-xs font-bold text-white mb-3">Today&apos;s BESS Telemetry Events</h4>
            <div className="space-y-2 text-xs">
              {battery.history.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#121212] border border-[#262626] rounded-lg flex items-center justify-between hover:border-[#10B981]/60 hover:bg-[#101814] hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-num text-[#AAB8C5]">{h.time}</span>
                    <span className="text-white">
                      {h.power > 0
                        ? `Absorbed solar charge (+${h.power} kW)`
                        : `Peak-shaving facility discharge (${h.power} kW)`}
                    </span>
                  </div>
                  <span className="font-mono-num text-[#00E5A0] font-bold">{h.soc}% SoC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
