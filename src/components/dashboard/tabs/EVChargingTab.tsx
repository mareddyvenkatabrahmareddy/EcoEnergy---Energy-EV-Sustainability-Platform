import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Zap,
  Plus,
  Square,
  Car,
} from 'lucide-react';

export const EVChargingTab: React.FC = () => {
  const { evStations, startEVCharging, stopEVCharging } = useApp();

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [vehicleModel, setVehicleModel] = useState('Tesla Model Y Fleet');
  const [targetKwh, setTargetKwh] = useState(40);
  const [showModal, setShowModal] = useState(false);

  const totalStations = evStations.length;
  const occupiedStations = evStations.filter((s) => s.status === 'charging').length;
  const availableStations = totalStations - occupiedStations;
  const totalDeliveredKwh = Number(
    evStations.reduce((acc, s) => acc + s.energyDeliveredKwh, 0).toFixed(1)
  );

  const handleOpenStartModal = (stationId?: string) => {
    const targetId = stationId || evStations.find((s) => s.status === 'available')?.id;
    if (targetId) {
      setSelectedStationId(targetId);
      setShowModal(true);
    }
  };

  const handleStartConfirm = () => {
    if (selectedStationId) {
      startEVCharging(selectedStationId, vehicleModel, targetKwh);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top EV Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Total Charging Stations</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {totalStations} <span className="text-sm font-normal text-[#AAB8C5]">Ports</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            2× 350kW Ultra-Fast · 2× 150kW DC · 4× Level 2
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Available Charging Stations</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00E5A0]">
            {availableStations} <span className="text-sm font-normal text-[#AAB8C5]">Open</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            Instant connection ready
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Currently Occupied Stations</span>
          <div className="text-3xl font-extrabold font-mono-num text-[#00C781]">
            {occupiedStations} <span className="text-sm font-normal text-[#AAB8C5]">Active</span>
          </div>
          <div className="text-[11px] text-[#AAB8C5] mt-2">
            50% Station Utilization Rate
          </div>
        </div>

        <div className="group p-5 bg-[#0A0A0A] border border-[#222222] rounded-2xl hover:border-[#10B981]/70 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <span className="text-xs text-[#AAB8C5] group-hover:text-white transition-colors block mb-1">Electricity Delivered (Today)</span>
          <div className="text-3xl font-extrabold font-mono-num text-white group-hover:text-[#6EE7B7] transition-colors">
            {totalDeliveredKwh} <span className="text-sm font-normal text-[#AAB8C5]">kWh</span>
          </div>
          <div className="text-[11px] text-[#00E5A0] mt-2">
            100% Sourced from on-site Solar & BMS
          </div>
        </div>
      </div>

      {/* Action Header & Quick Plug Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">
            Fleet Charging Dispensers Matrix
          </h3>
          <p className="text-xs text-[#AAB8C5]">
            Click on any dispenser to inspect telemetry or dispatch a new charging vehicle
          </p>
        </div>
        <button
          onClick={() => handleOpenStartModal()}
          disabled={availableStations === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00C781] hover:bg-[#00E5A0] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-[#000000] font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all duration-300 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Vehicle</span>
        </button>
      </div>

      {/* 8 STATIONS INTERACTIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {evStations.map((station) => (
          <div
            key={station.id}
            className={`group p-5 bg-[#0A0A0A] border rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#10B981]/75 hover:shadow-[0_0_28px_rgba(16,185,129,0.22),inset_0_0_16px_rgba(16,185,129,0.05)] cursor-pointer ${
              station.status === 'charging'
                ? 'border-[#00C781]/50 shadow-lg shadow-emerald-500/5'
                : 'border-[#222222]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono-num text-[#AAB8C5] group-hover:text-white transition-colors">
                Port #{station.portNumber}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  station.status === 'charging'
                    ? 'bg-[#00C781]/20 text-[#00E5A0] border border-[#00C781]/40'
                    : 'bg-emerald-950/70 text-[#00E5A0] border border-emerald-500/30'
                }`}
              >
                {station.status === 'charging' ? '⚡ Charging' : '● Available'}
              </span>
            </div>

            <h4 className="font-heading text-sm font-bold text-white group-hover:text-[#6EE7B7] transition-colors mb-1">
              {station.name}
            </h4>
            <span className="text-[11px] text-[#AAB8C5] block mb-4">
              {station.type}
            </span>

            {station.status === 'charging' ? (
              <div className="space-y-3 pt-3 border-t border-[#1A1A1A]">
                <div className="flex items-center gap-2 text-xs text-white">
                  <Car className="w-4 h-4 text-[#00E5A0] shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="truncate">{station.currentVehicle}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#121212] border border-[#1E1E1E] group-hover:border-[#10B981]/30 rounded-lg transition-colors">
                    <span className="text-[#AAB8C5] block text-[10px]">Power Rate</span>
                    <span className="font-mono-num font-bold text-[#00E5A0]">
                      {station.currentPowerKw} kW
                    </span>
                  </div>
                  <div className="p-2 bg-[#121212] border border-[#1E1E1E] group-hover:border-[#10B981]/30 rounded-lg transition-colors">
                    <span className="text-[#AAB8C5] block text-[10px]">Delivered</span>
                    <span className="font-mono-num font-bold text-white">
                      {station.energyDeliveredKwh} kWh
                    </span>
                  </div>
                </div>

                {station.socPercent && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#AAB8C5]">
                      <span>Vehicle Battery</span>
                      <span className="font-mono-num text-white">{station.socPercent}%</span>
                    </div>
                    <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00C781] h-full rounded-full transition-all"
                        style={{ width: `${station.socPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => stopEVCharging(station.id)}
                    className="w-full py-2 bg-[#141414] border border-[#262626] hover:bg-red-950 hover:border-red-500/40 hover:text-red-300 text-[#AAB8C5] text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 text-red-400" />
                    <span>Stop Charging</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#1A1A1A] text-center">
                <div className="text-xs text-[#AAB8C5] mb-3">No vehicle connected</div>
                <button
                  onClick={() => handleOpenStartModal(station.id)}
                  className="w-full py-2 bg-[#141414] border border-[#262626] hover:bg-[#00C781] hover:border-[#00C781] hover:text-[#000000] hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] text-white text-xs rounded-lg transition-all duration-200 cursor-pointer font-bold"
                >
                  Plug In Vehicle
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#101010] border border-[#292929] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              Start EV Charging Session
            </h3>
            <p className="text-xs text-[#AAB8C5] mb-4">
              Select vehicle model and target charging energy for Port #{selectedStationId}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  Select Port Dispenser
                </label>
                <select
                  value={selectedStationId || ''}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#000000] border border-[#292929] rounded-lg text-xs text-white"
                >
                  {evStations
                    .filter((s) => s.status === 'available')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#000000] border border-[#292929] rounded-lg text-xs text-white"
                  placeholder="e.g. Ford F-150 Lightning Fleet"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  Target Energy (kWh)
                </label>
                <input
                  type="number"
                  value={targetKwh}
                  onChange={(e) => setTargetKwh(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#000000] border border-[#292929] rounded-lg text-xs text-white"
                  min="10"
                  max="150"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#AAB8C5] bg-[#292929] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartConfirm}
                  className="flex-1 py-2 text-xs font-bold text-[#000000] bg-[#00C781] hover:bg-[#00E5A0] rounded-lg"
                >
                  Initiate Charging
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
