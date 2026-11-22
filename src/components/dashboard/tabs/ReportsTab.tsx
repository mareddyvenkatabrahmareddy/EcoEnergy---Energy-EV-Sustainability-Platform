import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext.tsx';
import {
  FileText,
  Download,
  CheckCircle2,
  Printer,
  Table,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportsTab: React.FC = () => {
  const { solar, carbon, waste, exportDataCSV, user } = useApp();

  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const handleExportCSV = (type: 'all' | 'solar' | 'ev' | 'carbon') => {
    exportDataCSV(type);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setDownloadSuccess(`CSV Report for ${type.toUpperCase()} successfully downloaded.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Export Bar */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">
            Operational Sustainability Reports & Export
          </h3>
          <p className="text-xs text-[#AAB8C5] mt-0.5">
            Export compliant energy audit ledgers, EV fleet logs, and Scope 1 & 2 carbon certificates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Range Filter */}
          <div className="flex items-center p-1 bg-[#101010] border border-[#292929] rounded-xl gap-1">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_15px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] ${
                timeRange === 'daily'
                  ? 'bg-[#00DFA0] text-[#000805] font-bold border-[#00DFA0]'
                  : 'text-[#AAB8C5] border-transparent hover:text-[#00DFA0]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_15px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] ${
                timeRange === 'weekly'
                  ? 'bg-[#00DFA0] text-[#000805] font-bold border-[#00DFA0]'
                  : 'text-[#AAB8C5] border-transparent hover:text-[#00DFA0]'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_15px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] ${
                timeRange === 'monthly'
                  ? 'bg-[#00DFA0] text-[#000805] font-bold border-[#00DFA0]'
                  : 'text-[#AAB8C5] border-transparent hover:text-[#00DFA0]'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Download Action Buttons */}
          <button
            onClick={() => handleExportCSV('all')}
            className="flex items-center gap-2 px-4 py-2 bg-[#101010] hover:bg-[#292929] text-white font-semibold text-xs rounded-xl border border-[#292929] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00E5A0]" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00C781] hover:bg-[#00E5A0] text-[#000000] font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00E5A0] shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Data Matrix Table */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#101010] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-[#00E5A0]" />
            <h4 className="font-heading text-base font-bold text-white">
              {timeRange.toUpperCase()} EXECUTIVE SUMMARY LEDGER (
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              )
            </h4>
          </div>
          <span className="text-xs text-[#AAB8C5]">
            Facility: <strong className="text-white">{user?.organization || 'Apex CleanTech Campus 01'}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#101010] bg-[#101010]/80 text-[#AAB8C5]">
                <th className="py-3 px-6 font-semibold">Subsystem Category</th>
                <th className="py-3 px-6 font-semibold">Primary Metric</th>
                <th className="py-3 px-6 font-semibold">Self-Sufficiency %</th>
                <th className="py-3 px-6 font-semibold">Abatement (CO₂)</th>
                <th className="py-3 px-6 font-semibold">Audited Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101010] font-mono-num text-[#AAB8C5]">
              <tr className="hover:bg-[#101010]/40 transition-colors">
                <td className="py-4 px-6 font-sans font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C781]"></span>
                  <span>Solar Photovoltaic Generation</span>
                </td>
                <td className="py-4 px-6 font-bold text-white">
                  {solar.todayGenerationKwh} kWh
                </td>
                <td className="py-4 px-6 text-[#00E5A0]">95.4% Direct Yield</td>
                <td className="py-4 px-6 text-[#00E5A0]">143.9 kg CO₂</td>
                <td className="py-4 px-6 font-sans">
                  <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/30 text-[#00E5A0] rounded text-[11px]">
                    Verified
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#101010]/40 transition-colors">
                <td className="py-4 px-6 font-sans font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>BESS Lithium Battery Storage</span>
                </td>
                <td className="py-4 px-6 font-bold text-white">
                  84.0 kWh stored
                </td>
                <td className="py-4 px-6 text-white">84% SoC / 98.4% SoH</td>
                <td className="py-4 px-6 text-[#00E5A0]">35.2 kg CO₂</td>
                <td className="py-4 px-6 font-sans">
                  <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/30 text-[#00E5A0] rounded text-[11px]">
                    Optimal
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#101010]/40 transition-colors">
                <td className="py-4 px-6 font-sans font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>EV Fleet Fast Charging</span>
                </td>
                <td className="py-4 px-6 font-bold text-white">184.5 kWh delivered</td>
                <td className="py-4 px-6 text-[#00E5A0]">100% Zero-Grid</td>
                <td className="py-4 px-6 text-[#00E5A0]">77.5 kg CO₂</td>
                <td className="py-4 px-6 font-sans">
                  <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/30 text-[#00E5A0] rounded text-[11px]">
                    Active
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#101010]/40 transition-colors">
                <td className="py-4 px-6 font-sans font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5A0]"></span>
                  <span>Waste Circularity & Biogas</span>
                </td>
                <td className="py-4 px-6 font-bold text-white">
                  {waste.totalRecycledKg} kg recycled
                </td>
                <td className="py-4 px-6 text-[#00E5A0]">88.4% Diverted</td>
                <td className="py-4 px-6 text-[#00E5A0]">54.0 kg CO₂</td>
                <td className="py-4 px-6 font-sans">
                  <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/30 text-[#00E5A0] rounded text-[11px]">
                    Certified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Formatted PDF / Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#101010] border border-[#292929] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#00E5A0]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  EcoEnergy Official Sustainability Report
                </h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-[#AAB8C5] hover:text-white text-xs px-2.5 py-1 bg-[#292929] rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            {/* Printable Document Sheet */}
            <div className="mt-6 p-6 bg-[#101010] text-white border border-[#292929] rounded-xl space-y-6 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-[#292929] pb-4">
                <div>
                  <h1 className="text-xl font-bold text-white font-heading">
                    EcoEnergy Commercial Audit
                  </h1>
                  <p className="text-[#AAB8C5] mt-0.5">Facility: Apex CleanTech Campus 01</p>
                  <p className="text-[#AAB8C5]">Director: {user?.name || 'Authorized Operator'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#AAB8C5]/70 uppercase tracking-widest block">
                    Report Timestamp
                  </span>
                  <span className="font-mono text-[#00E5A0] font-semibold">
                    {new Date().toISOString().slice(0, 10)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-[#101010] border border-[#292929] rounded-lg">
                  <span className="text-[10px] text-[#AAB8C5] uppercase block">Solar Generated</span>
                  <span className="text-lg font-bold text-white">
                    {solar.todayGenerationKwh} kWh
                  </span>
                </div>
                <div className="p-3 bg-[#101010] border border-[#292929] rounded-lg">
                  <span className="text-[10px] text-[#AAB8C5] uppercase block">CO₂ Abated</span>
                  <span className="text-lg font-bold text-[#00E5A0]">
                    {carbon.totalSavedKg} kg
                  </span>
                </div>
                <div className="p-3 bg-[#101010] border border-[#292929] rounded-lg">
                  <span className="text-[10px] text-[#AAB8C5] uppercase block">Landfill Diverted</span>
                  <span className="text-lg font-bold text-white">
                    {waste.divertedLandfillPercent}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white">Compliance Invariant Certifications:</h4>
                <ul className="list-disc list-inside text-[#AAB8C5] space-y-1">
                  <li>ISO 50001:2018 Energy Management Systems Standard compliant.</li>
                  <li>Scope 1 Direct & Scope 2 Indirect emission factors validated.</li>
                  <li>100% of EV charging energy delivered was zero-tariff solar microgrid electricity.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#292929] flex justify-between text-[11px] text-[#AAB8C5]">
                <span>Authorized Signatory: EcoEnergy Automated Telemetry Auditor</span>
                <span className="font-mono text-[#00C781]">Hash: #SHA-256-EC094A2B</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#AAB8C5] hover:text-white bg-[#292929] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-bold text-[#000000] bg-[#00C781] hover:bg-[#00E5A0] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
