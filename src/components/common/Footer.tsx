import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Zap,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  ExternalLink,
  Shield,
  FileText,
  X,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setDashboardTab } = useApp();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleNavClick = (sectionId?: string) => {
    setCurrentPage('home');
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#000000] border-t border-[#292929] text-[#AAB8C5] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & About Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C781] to-[#00E5A0] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#000000] fill-[#000000]" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Eco<span className="text-[#00E5A0]">Energy</span>
              </span>
            </div>
            <p className="text-[#AAB8C5] text-xs leading-relaxed">
              Leading the global transition to decarbonized infrastructure through intelligent solar telemetry, lithium battery management, fleet EV charging, and circular zero-waste systems.
            </p>
            <div className="pt-1">
              <button
                onClick={() => handleNavClick('about')}
                className="text-xs font-semibold text-[#00E5A0] hover:text-white transition-colors cursor-pointer"
              >
                About Our Mission →
              </button>
            </div>
          </div>

          {/* Col 2: Core Features */}
          <div>
            <h4 className="font-heading text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Core Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('solar');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Solar Energy Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('battery');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Battery Management System (BMS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('ev');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  EV Charging Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('smart-meter');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Smart Meter Monitoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('carbon');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Carbon Tracking & Offsets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('waste');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Waste-to-Value Circularity
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Contact Channels */}
          <div>
            <h4 className="font-heading text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="tel:+18004923260"
                  className="flex items-center gap-2 hover:text-[#00E5A0] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#00E5A0] shrink-0" />
                  <span>+1 (800) 492-3260 (Call)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/18004923260?text=Hello%20EcoEnergy%20Team"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#00E5A0] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#00E5A0] shrink-0" />
                  <span>+1 (800) 492-3260 (WhatsApp)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ecoenergy.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#00E5A0] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#00E5A0] shrink-0" />
                  <span>@ecoenergy.official</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/ecoenergy.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#00E5A0] transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#00E5A0] shrink-0" />
                  <span>facebook.com/ecoenergy.official</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Compliance & Access */}
          <div>
            <h4 className="font-heading text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Operations & Security
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('overview');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Telemetry Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('reports');
                  }}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Audit Reports & CSV Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-[#00E5A0] transition-colors cursor-pointer text-left"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB8C5]">
          <div>
            © {new Date().getFullYear()} EcoEnergy Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms and Conditions
            </button>
            <span aria-hidden="true">·</span>
            <span>ISO 50001 & SOC 2 Compliant</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#101010] border border-[#292929] rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
              <h3 className="font-heading text-lg font-bold text-white">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 text-[#AAB8C5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-[#AAB8C5] space-y-3 leading-relaxed">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    EcoEnergy is committed to protecting operational and telemetry data collected through our smart metering, solar inverter interfaces, and EV charging controllers.
                  </p>
                  <p>
                    All high-frequency electrical telemetry is encrypted in transit using TLS 1.3 and stored in compliant facility silos adhering to ISO 27001 and SOC 2 Type II data governance standards.
                  </p>
                  <p>
                    We do not sell, rent, or distribute energy metrics or corporate credentials to third parties. Telemetry data is utilized solely for grid optimization, automated reporting, and peak-shaving dispatch.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    By accessing the EcoEnergy platform and dashboard consoles, facility operators agree to adhere to standardized microgrid dispatch safety invariants and manufacturer hardware operating bounds.
                  </p>
                  <p>
                    Inverter overrides, BESS discharge commands, and EV charger load allocations should be configured in compliance with regional electrical safety codes and local utility interconnection agreements.
                  </p>
                  <p>
                    Calculated carbon offsets and greenhouse gas reduction ledgers follow standardized GHG Protocol methodologies and are certified for official sustainability filings.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-[#292929] flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-[#00C781] hover:bg-[#00E5A0] text-[#000000] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
