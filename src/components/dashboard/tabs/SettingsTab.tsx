import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  Save,
  CheckCircle2,
  Cloud,
  CloudOff,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    user,
    facilitySettings,
    isCloudSynced,
    updateUserProfile,
    isSimulating,
    setIsSimulating,
  } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || 'Apex CleanTech Campus 01',
    solarCapacity: facilitySettings.solarCapacityKw,
    batteryCapacity: facilitySettings.batteryCapacityKwh,
    alertThreshold: facilitySettings.alertThresholdKw,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization: user?.organization || 'Apex CleanTech Campus 01',
      solarCapacity: facilitySettings.solarCapacityKw,
      batteryCapacity: facilitySettings.batteryCapacityKwh,
      alertThreshold: facilitySettings.alertThresholdKw,
    });
  }, [user, facilitySettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(
      {
        name: formData.name,
        phone: formData.phone,
        organization: formData.organization,
      },
      {
        solarCapacityKw: formData.solarCapacity,
        batteryCapacityKwh: formData.batteryCapacity,
        alertThresholdKw: formData.alertThreshold,
      }
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              Campus & User Profile Configuration
            </h3>
            <p className="text-xs text-[#AAB8C5]">
              Manage corporate credentials, on-site hardware capacities, and automated microgrid alerting thresholds
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border ${
              isCloudSynced
                ? 'bg-[#00C781]/10 border-[#00C781]/30 text-[#00E5A0]'
                : 'bg-[#1A1A1A] border-[#292929] text-[#AAB8C5]'
            }`}
          >
            {isCloudSynced ? (
              <>
                <Cloud className="w-3.5 h-3.5" />
                <span>Firestore Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5" />
                <span>Local Demo Session</span>
              </>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E5A0] shrink-0" />
            <span>
              {isCloudSynced
                ? 'Facility configurations updated and persisted to Cloud Firestore.'
                : 'Facility configurations updated for local session.'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Profile Section */}
          <div>
            <h4 className="text-xs font-semibold text-[#00E5A0] uppercase tracking-wider mb-3">
              Operator Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">Email (Corporate SSO)</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-3.5 py-2.5 bg-[#000000] border border-[#292929] rounded-xl text-xs text-[#AAB8C5] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">Campus / Facility Name</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>
            </div>
          </div>

          {/* Hardware & Grid Thresholds */}
          <div className="pt-6 border-t border-[#101010]">
            <h4 className="text-xs font-semibold text-[#00E5A0] uppercase tracking-wider mb-3">
              Hardware Baseline Capacities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  Solar Array Peak (kWp)
                </label>
                <input
                  type="number"
                  value={formData.solarCapacity}
                  onChange={(e) => setFormData({ ...formData, solarCapacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  BESS Bank Capacity (kWh)
                </label>
                <input
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={(e) => setFormData({ ...formData, batteryCapacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAB8C5] mb-1">
                  Peak Draw Alert (kW)
                </label>
                <input
                  type="number"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#101010] border border-[#292929] rounded-xl text-xs text-white focus:outline-none focus:border-[#00C781]"
                />
              </div>
            </div>
          </div>

          {/* IoT Telemetry Simulation Toggle */}
          <div className="pt-6 border-t border-[#101010]">
            <h4 className="text-xs font-semibold text-[#00E5A0] uppercase tracking-wider mb-3">
              Telemetry Simulator Engine
            </h4>
            <div className="p-4 bg-[#101010] border border-[#292929] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Real-Time Data Fluctuations</span>
                <span className="text-[11px] text-[#AAB8C5]">
                  Simulates continuous sub-second inverter and smart meter telemetry
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  isSimulating
                    ? 'bg-[#00C781] text-[#000000]'
                    : 'bg-[#292929] text-[#AAB8C5]'
                }`}
              >
                {isSimulating ? 'Active (Live)' : 'Paused'}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00C781] hover:bg-[#00E5A0] text-[#000000] font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
