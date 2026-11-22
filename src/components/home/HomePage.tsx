import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sun,
  BatteryCharging,
  Zap,
  Gauge,
  Leaf,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  ExternalLink,
  Car,
  Cloud,
  BarChart3,
  Activity,
} from 'lucide-react';

const FALLBACK_ENERGY_IMAGE = '/assets/aistudio/image_f6391384.png';

const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = FALLBACK_ENERGY_IMAGE;
};

export const HomePage: React.FC = () => {
  const { setCurrentPage, setDashboardTab, user, solar, battery, evStations, carbon } = useApp();
  const [heroImgSrc, setHeroImgSrc] = useState('/images/hero-solar-ev.jpg');
  const [heroImgFailedAll, setHeroImgFailedAll] = useState(false);

  const activeEVCount = evStations.filter((s) => s.status === 'charging').length;

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* 1. HERO SECTION (Pure Black Canvas, Emerald Radial Glow, Curved Waves & Facility Operational Metrics Card) */}
      <section className="relative min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#000000] border-b border-[#002016]">
        
        {/* Layer 1: Pure Black to Deep Forest-Green Gradient Canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#01140C] to-[#000000] pointer-events-none" />

        {/* Layer 2: Emerald-Green Radial Light Effects behind Hero & Image */}
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-radial from-[#00DFA0]/15 via-[#00C781]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 lg:right-10 w-[500px] h-[500px] bg-radial from-[#00DFA0]/8 via-[#00C781]/3 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[950px] h-[360px] bg-radial from-[#00DFA0]/15 via-[#01140C]/40 to-transparent rounded-full blur-[130px] pointer-events-none" />

        {/* Layer 3: Subtle Animated Green Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-[#00DFA0] blur-[1px] opacity-60 animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#00C781] blur-[1px] opacity-50 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-[#00DFA0] blur-[1px] opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-[#00C781] blur-[1px] opacity-50 animate-ping" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/5 right-12 w-2.5 h-2.5 rounded-full bg-[#00DFA0] blur-[1px] opacity-70 animate-pulse" style={{ animationDuration: '2.5s' }} />
        </div>

        {/* Two-Column Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-6 flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: 50% Text Content */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start text-left">
              {/* Tagline: SOLAR ENERGY • ZERO EMISSION CARBON */}
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00A86B] tracking-[0.2em] mb-4 sm:mb-5 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                <span className="font-mono">
                  SOLAR ENERGY • ZERO EMISSION CARBON
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.08] text-left">
                POWERING A<br className="hidden sm:inline" />{' '}
                <span className="text-[#00A86B]">SMARTER</span>,<br className="hidden sm:inline" />{' '}
                <span className="text-[#00A86B]">GREENER</span> FUTURE
              </h1>

              {/* Short horizontal emerald-green line directly below heading */}
              <div className="w-20 h-1 bg-gradient-to-r from-[#00A86B] via-[#00A86B]/60 to-transparent rounded-full mt-4 mb-5" />

              {/* Description */}
              <p className="text-base sm:text-lg text-[#C6D1D0] max-w-xl leading-relaxed text-left">
                Monitor your energy, manage electric vehicle charging, track carbon emissions, and build a sustainable future with intelligent technology.
              </p>

              {/* Two CTA Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
                {/* Button 1: Solid emerald-green Get Started with black text */}
                <button
                  onClick={() => {
                    if (user) {
                      setCurrentPage('dashboard');
                    } else {
                      setCurrentPage('login');
                    }
                  }}
                  className="group flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-[#000000] bg-[#00A86B] hover:bg-[#00945e] rounded-xl shadow-[0_0_15px_rgba(0,168,107,0.3)] hover:shadow-[0_0_20px_rgba(0,168,107,0.45)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Button 2: Transparent black button with emerald border and white text Explore Features */}
                <button
                  onClick={() => {
                    const el = document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-black/60 hover:bg-[#01140C] border border-[#00A86B]/60 hover:border-[#00A86B] hover:shadow-[0_0_15px_rgba(0,168,107,0.25)] hover:-translate-y-0.5 rounded-xl transition-all duration-300 ease-out cursor-pointer whitespace-nowrap backdrop-blur-md"
                >
                  <span>Explore Features</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Large rectangular photograph of solar EV charging station */}
            <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-none group">
                {/* Refined, Toned-Down Soft Emerald Glow */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#00C781]/12 via-[#00DFA0]/12 to-transparent rounded-[26px] blur-md opacity-35 group-hover:opacity-50 transition-all duration-500 pointer-events-none" />

                {/* Main Image Frame with rounded-[25px] & thin refined emerald border */}
                <div className="relative rounded-[25px] overflow-hidden border border-[#00DFA0]/30 group-hover:border-[#00DFA0]/60 bg-[#04140D] shadow-[0_0_18px_rgba(0,223,160,0.12)] transition-all duration-500">
                  {!heroImgFailedAll ? (
                    <img
                      src={heroImgSrc}
                      alt="EcoEnergy Solar Array and Electric Vehicle Fast-Charging Station"
                      onError={() => {
                        if (heroImgSrc !== FALLBACK_ENERGY_IMAGE) {
                          setHeroImgSrc(FALLBACK_ENERGY_IMAGE);
                        } else {
                          setHeroImgFailedAll(true);
                        }
                      }}
                      className="w-full h-[320px] sm:h-[420px] lg:h-[470px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-[320px] sm:h-[420px] lg:h-[470px] bg-gradient-to-br from-[#021C12] via-[#06291A] to-[#010C08] flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#00A86B]/20 border border-[#00DFA0]/40 flex items-center justify-center text-[#00DFA0] mb-4">
                        <Car className="w-8 h-8" />
                      </div>
                      <p className="font-heading text-lg font-bold text-white">
                        Solar EV Fast-Charging Hub
                      </p>
                      <p className="text-xs text-[#C6D1D0] mt-1 max-w-xs">
                        Clean solar-powered EV charging infrastructure &amp; real-time microgrid telemetry
                      </p>
                    </div>
                  )}
                  {/* Subtle Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/65 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Layered Curved Emerald-Green Wave Shapes directly behind the metrics card */}
        <div className="relative w-full overflow-hidden leading-none pointer-events-none -mb-16 sm:-mb-20 lg:-mb-24 z-0">
          <svg
            className="w-full h-16 sm:h-24 lg:h-32 text-[#01140C] fill-current opacity-90"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,45L48,50C96,55,192,65,288,72C384,79,480,83,576,76C672,69,768,51,864,48C960,45,1056,57,1152,65C1248,73,1344,77,1392,79L1440,81L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
          <svg
            className="w-full h-14 sm:h-20 lg:h-28 text-[#00C781]/15 fill-current -mt-10 sm:-mt-14 lg:-mt-18"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,21.3C960,21,1056,43,1152,53.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
          <svg
            className="w-full h-10 sm:h-16 lg:h-20 text-[#00DFA0]/15 fill-current -mt-8 sm:-mt-12 lg:-mt-14"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z" />
          </svg>
        </div>

        {/* Facility Operational Metrics Card - Positioned directly below hero overlapping slightly with the green waves */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
          <div className="w-full bg-[#000000]/90 border border-[#00A86B]/30 hover:border-[#00A86B]/50 rounded-[25px] p-5 sm:p-7 shadow-[0_0_20px_rgba(0,168,107,0.12)] backdrop-blur-xl transition-all duration-300">
            
            {/* Header: Green Analytics Icon + FACILITY OPERATIONAL METRICS + Green Dot + LIVE MONITORING */}
            <div className="text-[11px] text-[#C6D1D0] uppercase tracking-wider text-left mb-5 px-2 flex items-center justify-between border-b border-[#002016] pb-3.5">
              <div className="flex items-center gap-2.5 text-white font-semibold">
                <div className="w-7 h-7 rounded-lg bg-[#00A86B]/15 border border-[#00A86B]/30 flex items-center justify-center text-[#00A86B]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="tracking-wider">FACILITY OPERATIONAL METRICS</span>
              </div>
              <span className="text-[#00A86B] font-mono flex items-center gap-2 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                <span>LIVE MONITORING</span>
              </span>
            </div>

            {/* 4 Equally Spaced Metric Columns with Vertical Separators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
              
              {/* Column 1: Solar Generation (Yellow Sun Icon) */}
              <div className="text-left px-3 sm:px-5 lg:border-r border-[#002016]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Sun className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs text-[#C6D1D0] font-medium">Solar Generation</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-white mt-1">
                  342.8 <span className="text-xs text-[#C6D1D0] font-normal">kWh</span>
                </div>
                <div className="text-xs text-[#00A86B] font-medium mt-1.5 inline-flex items-center gap-1">
                  <span>↑ +12.5% vs yesterday</span>
                </div>
              </div>

              {/* Column 2: Total Energy Saved (Emerald-Green Leaf Icon) */}
              <div className="text-left px-3 sm:px-5 lg:border-r border-[#002016]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00A86B]/10 border border-[#00A86B]/25 flex items-center justify-center text-[#00A86B]">
                    <Leaf className="w-4.5 h-4.5 fill-[#00A86B]/10" />
                  </div>
                  <span className="text-xs text-[#C6D1D0] font-medium">Total Energy Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#00A86B] mt-1">
                  84%
                </div>
                <div className="text-xs text-[#00A86B] font-medium mt-1.5 inline-flex items-center gap-1">
                  <span>↑ +8.7% vs last month</span>
                </div>
              </div>

              {/* Column 3: EVs Charged (Emerald-Green Electric Car Icon) */}
              <div className="text-left px-3 sm:px-5 lg:border-r border-[#002016]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00A86B]/10 border border-[#00A86B]/25 flex items-center justify-center text-[#00A86B]">
                    <Car className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs text-[#C6D1D0] font-medium">EVs Charged</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-white mt-1">
                  4 / 8 <span className="text-xs text-[#00A86B] font-semibold">Active</span>
                </div>
                <div className="text-xs text-[#00A86B] font-medium mt-1.5 inline-flex items-center gap-1">
                  <span>↑ +10% vs last week</span>
                </div>
              </div>

              {/* Column 4: Net CO2 Avoided (Emerald-Green Cloud with CO2 Icon) */}
              <div className="text-left px-3 sm:px-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00A86B]/10 border border-[#00A86B]/25 flex items-center justify-center text-[#00A86B] relative">
                    <Cloud className="w-4.5 h-4.5" />
                    <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-bold font-mono px-0.5 bg-[#000000] text-[#00A86B] rounded border border-[#00A86B]/30 leading-tight">CO₂</span>
                  </div>
                  <span className="text-xs text-[#C6D1D0] font-medium">Net CO₂ Avoided</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#00A86B] mt-1">
                  14.8 <span className="text-xs text-[#C6D1D0] font-normal">tonnes</span>
                </div>
                <div className="text-xs text-[#00A86B] font-medium mt-1.5 inline-flex items-center gap-1">
                  <span>↑ +15.3% vs previous month</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-24 bg-[#000000] border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold text-[#00C781] uppercase tracking-widest">
                Our Core Mission
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Building a Sustainable Tomorrow
              </h2>
              <p className="text-[#AAB8C5] leading-relaxed text-base">
                EcoEnergy unifies the renewable clean-technology ecosystem into a single synchronized platform. By connecting solar photovoltaic arrays, high-capacity battery storage systems (BMS), electric vehicle fast-charging infrastructure, precision smart metering, and circular waste-to-energy operations, we empower facilities and communities to achieve genuine net-zero resilience.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Full Microgrid Synchronicity</h4>
                    <p className="text-xs text-[#AAB8C5] mt-0.5">
                      Dynamically route rooftop solar photons directly to charging EVs or lithium storage packs to minimize expensive utility grid peak tariffs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Auditable Scope 1, 2 & 3 Compliance</h4>
                    <p className="text-xs text-[#AAB8C5] mt-0.5">
                      Automated greenhouse gas reporting aligned with GHG Protocol, ISO 14064, and global environmental disclosure regulations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#00C781]/10 border border-[#00C781]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Circular Waste Valorization</h4>
                    <p className="text-xs text-[#AAB8C5] mt-0.5">
                      Monitor waste diversion, anaerobic digestion for biogas, and industrial material re-pelletizing in one unified digital ledger.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('solar');
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5A0] hover:text-white transition-colors"
                >
                  <span>Inspect System Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Architecture Interconnectivity Visual */}
            <div className="lg:col-span-6 bg-[#101010] border border-[#292929] hover:border-[#00C781]/70 hover:shadow-[0_0_24px_rgba(0,199,129,0.25)] hover:-translate-y-1 rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ease-out group/ecosystem">
              <div className="text-xs font-mono-num text-[#AAB8C5] group-hover/ecosystem:text-[#00E5A0] uppercase tracking-wider mb-4 transition-colors">
                Integrated Energy Ecosystem (Sample Data)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#000000] border border-[#292929] hover:border-[#00C781]/60 hover:shadow-[0_0_18px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 rounded-xl transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-2 text-[#00E5A0] mb-2">
                    <Sun className="w-5 h-5" />
                    <span className="text-sm font-bold text-white">Solar Generation</span>
                  </div>
                  <div className="text-2xl font-bold font-mono-num text-white">68.4 kW</div>
                  <div className="text-[11px] text-[#AAB8C5] mt-1">Inverter Alpha & Beta Online</div>
                </div>

                <div className="p-4 bg-[#000000] border border-[#292929] hover:border-[#00C781]/60 hover:shadow-[0_0_18px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 rounded-xl transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-2 text-[#00E5A0] mb-2">
                    <BatteryCharging className="w-5 h-5" />
                    <span className="text-sm font-bold text-white">BMS Storage</span>
                  </div>
                  <div className="text-2xl font-bold font-mono-num text-white">84% SoC</div>
                  <div className="text-[11px] text-[#00C781] mt-1">Absorbing 14.2 kW Flow</div>
                </div>

                <div className="p-4 bg-[#000000] border border-[#292929] hover:border-[#00C781]/60 hover:shadow-[0_0_18px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 rounded-xl transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-2 text-[#00E5A0] mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-sm font-bold text-white">EV Charging Hub</span>
                  </div>
                  <div className="text-2xl font-bold font-mono-num text-white">4 Sessions</div>
                  <div className="text-[11px] text-[#AAB8C5] mt-1">Ultra-Fast DC Active</div>
                </div>

                <div className="p-4 bg-[#000000] border border-[#292929] hover:border-[#00C781]/60 hover:shadow-[0_0_18px_rgba(0,199,129,0.2)] hover:-translate-y-0.5 rounded-xl transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-2 text-[#00E5A0] mb-2">
                    <Recycle className="w-5 h-5" />
                    <span className="text-sm font-bold text-white">Circular Waste</span>
                  </div>
                  <div className="text-2xl font-bold font-mono-num text-white">87.1% Eff.</div>
                  <div className="text-[11px] text-[#AAB8C5] mt-1">Biogas Recovered</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#00C781]/10 border border-[#00C781]/30 hover:border-[#00E5A0] hover:shadow-[0_0_18px_rgba(0,229,160,0.3)] rounded-xl flex items-center justify-between transition-all duration-300 ease-out cursor-default">
                <div>
                  <div className="text-xs font-semibold text-[#00E5A0]">Microgrid Self-Sufficiency</div>
                  <div className="text-sm text-[#AAB8C5]">Facility running autonomous on clean power</div>
                </div>
                <div className="text-2xl font-bold font-mono-num text-[#00E5A0]">94.2%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX CORE FEATURES SECTION */}
      <section id="features" className="py-24 bg-[#000000] border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#00C781] uppercase tracking-widest mb-2">
              Comprehensive Platform Capabilities
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Six Pillars of Sustainable Energy
            </h2>
            <p className="mt-4 text-base text-[#AAB8C5]">
              Engineered for commercial sustainability teams, utility managers, and renewable facility operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Solar Energy Management */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/assets/aistudio/image_f6391384.png"
                  alt="Solar panel arrays with wind turbines at sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#000000]/90 backdrop-blur-md rounded text-xs font-mono-num text-[#00E5A0] border border-[#292929]">
                  Solar Telemetry
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Solar Energy Management
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Monitor real-time solar energy production</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Track daily, weekly, and monthly generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>View solar panel performance & efficiency</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('solar');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>View Solar Monitor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Battery Management System (BMS) */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/bms-energy-storage.jpg"
                  alt="Battery energy storage unit"
                  onError={handleImageFallback}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292929] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#000000]/90 backdrop-blur-md rounded text-xs font-mono-num text-[#00E5A0] border border-[#292929]">
                  Lithium BESS
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Battery Management System
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Monitor battery percentage & charge capacity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Track battery charging and discharging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Display battery health and temperature</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('battery');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>View BMS Controls</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. EV Charging Management */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/hero-solar-ev.jpg"
                  alt="EV Fast charging"
                  onError={handleImageFallback}
                  className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292929] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#000000]/90 backdrop-blur-md rounded text-xs font-mono-num text-[#00E5A0] border border-[#292929]">
                  EV Charging
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    EV Charging Management
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Monitor EV charging stations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Display station charging status</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Track charging time & electricity consumption</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('ev');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>Manage EV Ports</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. Smart Meter Monitoring */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/smart-energy-meter.jpg"
                  alt="Smart electrical telemetry meter"
                  onError={handleImageFallback}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292929] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#000000]/90 backdrop-blur-md rounded text-xs font-mono-num text-[#00E5A0] border border-[#292929]">
                  Smart Meter
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Smart Meter Monitoring
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Track facility electricity consumption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Display real-time energy usage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Generate consumption reports & alerts</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('smart-meter');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>View Smart Meter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. Carbon Tracking */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative bg-[#000000] p-6 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold font-mono-num text-[#00E5A0]">
                  14,820 <span className="text-sm font-normal text-[#AAB8C5]">kg CO₂</span>
                </div>
                <div className="text-xs text-[#AAB8C5] mt-2">Cumulative Carbon Emissions Saved</div>
                <div className="text-[11px] text-[#00C781] mt-1">Equivalent to 674 Mature Trees</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Carbon Tracking
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Monitor CO₂ emissions in real time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Calculate carbon savings & offsets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Display tangible environmental impact</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('carbon');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>View Carbon Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 6. Waste-to-Value */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/waste-to-value.jpg"
                  alt="Circular waste-to-energy facility"
                  onError={handleImageFallback}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292929] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#000000]/90 backdrop-blur-md rounded text-xs font-mono-num text-[#00E5A0] border border-[#292929]">
                  Circular Economy
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#00C781]/10 border border-[#00C781]/20 flex items-center justify-center text-[#00E5A0] mb-4">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Waste-to-Value
                  </h3>
                  <ul className="space-y-2 text-xs text-[#AAB8C5] mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Track municipal & industrial waste management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Display circular recycling statistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C781]"></span>
                      <span>Monitor waste conversion into useful resources</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setDashboardTab('waste');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <span>View Circular Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENERGY STATISTICS SECTION */}
      <section className="py-20 bg-[#000000] border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#00C781] uppercase tracking-widest">
              Demonstration Performance Metrics
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1">
              Operational Impact & Energy Statistics
            </h2>
            <p className="text-xs text-[#AAB8C5] mt-1">
              Live aggregated measurements from connected facility sensors (Sample Data)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#101010] border border-[#292929] hover:border-[#00C781]/70 hover:shadow-[0_0_24px_rgba(0,199,129,0.25)] hover:-translate-y-1 rounded-2xl relative overflow-hidden group transition-all duration-300 ease-out cursor-default">
              <div className="text-xs text-[#AAB8C5] group-hover:text-white uppercase tracking-wider mb-1 transition-colors">
                Total Energy Generated
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num text-[#00E5A0]">
                1,452.8 <span className="text-lg text-[#AAB8C5] font-normal">MWh</span>
              </div>
              <p className="text-xs text-[#AAB8C5] mt-2">
                Delivered across commercial solar photovoltaic arrays.
              </p>
              <div className="mt-3 text-[10px] text-[#00C781] font-mono-num">
                ● Status: Nominal Production
              </div>
            </div>

            <div className="p-6 bg-[#101010] border border-[#292929] hover:border-[#00C781]/70 hover:shadow-[0_0_24px_rgba(0,199,129,0.25)] hover:-translate-y-1 rounded-2xl relative overflow-hidden group transition-all duration-300 ease-out cursor-default">
              <div className="text-xs text-[#AAB8C5] group-hover:text-white uppercase tracking-wider mb-1 transition-colors">
                Total EV Charging Sessions
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num text-white">
                18,490+ <span className="text-lg text-[#AAB8C5] font-normal">Sessions</span>
              </div>
              <p className="text-xs text-[#AAB8C5] mt-2">
                Dispenser uptime exceeding 99.8% across ultra-fast ports.
              </p>
              <div className="mt-3 text-[10px] text-[#00C781] font-mono-num">
                ● Status: High Availability
              </div>
            </div>

            <div className="p-6 bg-[#101010] border border-[#292929] hover:border-[#00C781]/70 hover:shadow-[0_0_24px_rgba(0,199,129,0.25)] hover:-translate-y-1 rounded-2xl relative overflow-hidden group transition-all duration-300 ease-out cursor-default">
              <div className="text-xs text-[#AAB8C5] group-hover:text-white uppercase tracking-wider mb-1 transition-colors">
                Carbon Emissions Reduced
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num text-[#00E5A0]">
                420.5 <span className="text-lg text-[#AAB8C5] font-normal">Tonnes CO₂</span>
              </div>
              <p className="text-xs text-[#AAB8C5] mt-2">
                Equivalent to taking 920 gasoline-powered cars off roads.
              </p>
              <div className="mt-3 text-[10px] text-[#00C781] font-mono-num">
                ● Status: Audited Verification
              </div>
            </div>

            <div className="p-6 bg-[#101010] border border-[#292929] hover:border-[#00C781]/70 hover:shadow-[0_0_24px_rgba(0,199,129,0.25)] hover:-translate-y-1 rounded-2xl relative overflow-hidden group transition-all duration-300 ease-out cursor-default">
              <div className="text-xs text-[#AAB8C5] group-hover:text-white uppercase tracking-wider mb-1 transition-colors">
                Energy Cost Saved
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num text-white">
                $284,500 <span className="text-lg text-[#AAB8C5] font-normal">USD</span>
              </div>
              <p className="text-xs text-[#AAB8C5] mt-2">
                Optimized by peak-shaving algorithm and zero-tariff usage.
              </p>
              <div className="mt-3 text-[10px] text-[#00C781] font-mono-num">
                ● Status: ROI On-Target
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT US SECTION (PHONE, INSTAGRAM, FACEBOOK, WHATSAPP) */}
      <section id="contact" className="py-24 bg-[#000000] border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#00C781] uppercase tracking-widest mb-2">
              Get in Touch
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Contact Clean Energy Support
            </h2>
            <p className="mt-4 text-sm text-[#AAB8C5]">
              Reach our systems engineers and clean technology advisors directly through your preferred channel.
            </p>
          </div>

          {/* 4 Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Phone Number */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00C781]/10 border border-[#00C781]/25 flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#AAB8C5] uppercase tracking-wider block">Phone Number</span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">Official Hotline</h3>
                <p className="text-sm font-mono-num text-[#00E5A0] font-semibold mt-2">
                  +1 (800) 492-3260
                </p>
                <p className="text-xs text-[#AAB8C5] mt-1">
                  Monday to Friday, 8am – 6pm EST
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="tel:+18004923260"
                  className="w-full py-2.5 px-4 bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* 2. Instagram */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00C781]/10 border border-[#00C781]/25 flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#AAB8C5] uppercase tracking-wider block">Instagram</span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">Social Community</h3>
                <p className="text-sm font-mono-num text-[#00E5A0] font-semibold mt-2">
                  @ecoenergy.official
                </p>
                <p className="text-xs text-[#AAB8C5] mt-1">
                  Facility photo updates & clean tech news
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://instagram.com/ecoenergy.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Visit Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 3. Facebook */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00C781]/10 border border-[#00C781]/25 flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-105 transition-transform">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#AAB8C5] uppercase tracking-wider block">Facebook</span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">Official Page</h3>
                <p className="text-sm font-mono-num text-[#00E5A0] font-semibold mt-2 truncate">
                  facebook.com/ecoenergy.official
                </p>
                <p className="text-xs text-[#AAB8C5] mt-1">
                  Announcements, webinars & case studies
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://facebook.com/ecoenergy.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Visit Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4. WhatsApp */}
            <div className="bg-[#101010] border border-[#292929] hover:border-[#00C781]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00C781]/10 border border-[#00C781]/25 flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#AAB8C5] uppercase tracking-wider block">WhatsApp</span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">Live Chat Support</h3>
                <p className="text-sm font-mono-num text-[#00E5A0] font-semibold mt-2">
                  +1 (800) 492-3260
                </p>
                <p className="text-xs text-[#AAB8C5] mt-1">
                  Direct telemetry dispatch & support
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://wa.me/18004923260?text=Hello%20EcoEnergy%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20sustainability%20platform."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#101010] hover:bg-[#00C781] hover:text-[#000000] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
