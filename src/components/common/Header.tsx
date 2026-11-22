import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, currentPage, setCurrentPage, setDashboardTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'features' | 'contact'>('home');

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Scroll spy to detect active section on homepage
  useEffect(() => {
    if (currentPage !== 'home') return;

    const checkActiveSection = () => {
      const scrollPos = window.scrollY + 200;
      const sections = ['contact', 'features', 'about'] as const;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionId);
          return;
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', checkActiveSection, { passive: true });
    checkActiveSection();
    return () => window.removeEventListener('scroll', checkActiveSection);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY.current;

          // Always show at top of page (threshold: 20px)
          if (currentScrollY <= 20) {
            setIsVisible(true);
            setIsAtTop(true);
          } else {
            setIsAtTop(false);

            // If mobile menu is open, keep navbar visible
            if (mobileMenuOpen) {
              setIsVisible(true);
            } else if (diff > 8) {
              // Scrolling down with a meaningful threshold -> slide out of view
              setIsVisible(false);
            } else if (diff < -8) {
              // Scrolling up with a meaningful threshold -> slide smoothly into view
              setIsVisible(true);
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId?: 'home' | 'about' | 'features' | 'contact') => {
    setMobileMenuOpen(false);
    setIsVisible(true);
    if (sectionId) {
      setActiveSection(sectionId);
    } else {
      setActiveSection('home');
    }

    if (currentPage !== 'home') {
      setCurrentPage('home');
      if (sectionId && sectionId !== 'home') {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (sectionId && sectionId !== 'home') {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#000805]/90 backdrop-blur-md border-b border-[#002016] transition-all duration-300 ease-in-out will-change-transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${!isAtTop ? 'shadow-2xl shadow-black/95' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Left: Emerald lightning logo and EcoEnergy brand name */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0] rounded-xl p-1 -m-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C781] to-[#00DFA0] flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-[#000805] fill-[#000805]" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white whitespace-nowrap">
            Eco<span className="text-[#00DFA0]">Energy</span>
          </span>
        </button>

        {/* Center: Home, About, Features, Analytics, Contact */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-medium">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0 hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] hover:text-[#00DFA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0] ${
              currentPage === 'home' && activeSection === 'home'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            <span>Home</span>
          </button>

          {/* About */}
          <button
            onClick={() => handleNavClick('about')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0 hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] hover:text-[#00DFA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0] ${
              currentPage === 'home' && activeSection === 'about'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            <span>About</span>
          </button>

          {/* Features */}
          <button
            onClick={() => handleNavClick('features')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0 hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] hover:text-[#00DFA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0] ${
              currentPage === 'home' && activeSection === 'features'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            <span>Features</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0 hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] hover:text-[#00DFA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0] ${
              currentPage === 'home' && activeSection === 'contact'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            <span>Contact</span>
          </button>
        </nav>

        {/* Right: Dashboard or Login/Sign Up */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                setDashboardTab('overview');
              }}
              className="px-4 py-2 text-xs font-bold text-[#000805] bg-[#00DFA0] rounded-xl border border-[#00DFA0] transition-all duration-300 ease-out cursor-pointer hover:border-[#00E5A0] hover:bg-[#00E5A0] hover:shadow-[0_0_20px_rgba(0,223,160,0.45)] hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Login button with exact same hover animation */}
              <button
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-transparent text-[#C6D1D0] bg-transparent transition-all duration-300 ease-out cursor-pointer whitespace-nowrap hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] hover:text-[#00DFA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0]"
              >
                Login
              </button>

              {/* Sign Up button with exact same hover animation */}
              <button
                onClick={() => setCurrentPage('register')}
                className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-[#00DFA0] text-[#000805] bg-[#00DFA0] transition-all duration-300 ease-out cursor-pointer whitespace-nowrap hover:border-[#00E5A0] hover:bg-[#00E5A0] hover:shadow-[0_0_20px_rgba(0,223,160,0.45)] hover:-translate-y-0.5 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DFA0]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#C6D1D0] hover:text-[#00DFA0] transition-colors rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#00DFA0]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#000805]/95 backdrop-blur-xl border-b border-[#002016] px-4 pt-3 pb-5 space-y-2">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left px-4 py-2 text-sm rounded-xl border border-transparent transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:text-[#00DFA0] hover:-translate-y-0.5 hover:scale-[1.02] ${
              currentPage === 'home' && activeSection === 'home'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left px-4 py-2 text-sm rounded-xl border border-transparent transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:text-[#00DFA0] hover:-translate-y-0.5 hover:scale-[1.02] ${
              currentPage === 'home' && activeSection === 'about'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className={`block w-full text-left px-4 py-2 text-sm rounded-xl border border-transparent transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:text-[#00DFA0] hover:-translate-y-0.5 hover:scale-[1.02] ${
              currentPage === 'home' && activeSection === 'features'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left px-4 py-2 text-sm rounded-xl border border-transparent transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:text-[#00DFA0] hover:-translate-y-0.5 hover:scale-[1.02] ${
              currentPage === 'home' && activeSection === 'contact'
                ? 'text-white font-semibold'
                : 'text-[#C6D1D0]'
            }`}
          >
            Contact
          </button>
          <div className="pt-3 border-t border-[#002016] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPage('dashboard');
                }}
                className="w-full py-2.5 text-center text-sm font-bold bg-[#00DFA0] hover:bg-[#00E5A0] text-[#000805] rounded-xl border border-[#00DFA0] hover:border-[#00E5A0] hover:shadow-[0_0_20px_rgba(0,223,160,0.45)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('login');
                  }}
                  className={`w-full py-2 text-center text-sm rounded-xl border border-transparent transition-all duration-300 ease-out cursor-pointer hover:border-[#00DFA0] hover:shadow-[0_0_18px_rgba(0,223,160,0.35)] hover:text-[#00DFA0] hover:-translate-y-0.5 hover:scale-[1.02] ${
                    currentPage === 'login'
                      ? 'text-white font-bold'
                      : 'text-[#C6D1D0]'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('register');
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold bg-[#00DFA0] hover:bg-[#00E5A0] text-[#000805] rounded-xl border border-[#00DFA0] hover:border-[#00E5A0] transition-all duration-300 ease-out cursor-pointer shadow-[0_0_15px_rgba(0,223,160,0.3)] hover:shadow-[0_0_25px_rgba(0,223,160,0.5)] hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
