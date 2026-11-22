import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Zap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login' }) => {
  const {
    login,
    loginWithGoogle,
    register,
    resetPassword,
    authRedirectError,
    clearAuthRedirectError,
    setCurrentPage,
    setDashboardTab,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (authRedirectError) {
      setErrorMessage(authRedirectError);
      clearAuthRedirectError();
    }
  }, [authRedirectError, clearAuthRedirectError]);

  // Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@company.com).');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.ok) {
      setSuccessMessage('Authentication successful! Initializing clean energy console...');
      setTimeout(() => {
        setCurrentPage('dashboard');
        setDashboardTab('overview');
      }, 600);
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, phone, password);
    setIsSubmitting(false);

    if (res.ok) {
      setSuccessMessage(
        res.verificationSent
          ? 'Account created! A verification email was sent to your inbox. Loading dashboard...'
          : 'Account registered successfully! Welcome to EcoEnergy.'
      );
      setTimeout(() => {
        setCurrentPage('dashboard');
        setDashboardTab('overview');
      }, 800);
    } else {
      setErrorMessage(res.error || 'Registration failed. Please check inputs.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);
    const res = await loginWithGoogle();
    setIsGoogleLoading(false);
    if (res.redirecting) {
      setSuccessMessage('Redirecting to Google Sign-In...');
      return;
    }
    if (res.ok) {
      setSuccessMessage('Google account verified! Syncing Firestore facility hub...');
      setTimeout(() => {
        setCurrentPage('dashboard');
        setDashboardTab('overview');
      }, 500);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setErrorMessage('Please enter a valid email address for reset instructions.');
      return;
    }
    setIsResetting(true);
    const res = await resetPassword(forgotEmail);
    setIsResetting(false);
    if (!res.ok) {
      setErrorMessage(res.error || 'Unable to send password reset email.');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
      setSuccessMessage('Password reset link dispatched to your inbox.');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="w-full max-w-md bg-[#09100D] border border-[#00C781]/25 rounded-[28px] p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand header matching reference */}
        <div className="text-center mb-6">
          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-3 group mb-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00E5A0] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,160,0.35)] group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              EcoEnergy
            </span>
          </button>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to Your Hub' : 'Create Energy Account (Sign Up)'}
          </h2>
          <p className="text-xs text-[#8E9CA8] mt-1.5">
            {mode === 'login'
              ? 'Access real-time telemetry, BESS controls, and EV fleet dispatch'
              : 'Deploy unified monitoring across your campus or enterprise microgrid'}
          </p>
        </div>

        {/* Firebase Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full mb-5 py-3 px-4 bg-[#020503] hover:bg-[#0e1a14] border border-[#1b2b22] hover:border-[#00E5A0]/60 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
            />
          </svg>
          <span>
            {isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google (Cloud Sync)'}
          </span>
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="w-full border-t border-[#1b2b22]" />
          <span className="px-3 bg-[#09100D] text-[10px] uppercase tracking-wider text-[#6A7B87] shrink-0">
            or facility credentials
          </span>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-[#00E5A0] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1.5">Email Address</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Mail className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#8E9CA8]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#00E5A0] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Lock className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none pr-7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#6A7B87] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2.5 cursor-pointer text-xs text-[#8E9CA8] select-none text-left"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-[#00E5A0] text-black' : 'bg-[#020503] border border-[#1b2b22]'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-black stroke-[3.5]" />}
                </div>
                <span>Remember me on this workstation</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full py-3.5 bg-[#00E5A0] hover:bg-[#00c781] text-black font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,160,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>

            <div className="text-center pt-3 text-xs text-[#8E9CA8]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('register');
                }}
                className="font-semibold text-[#00E5A0] hover:underline cursor-pointer ml-1"
              >
                Sign Up here
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION / SIGN UP FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1">Full Name</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <User className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1">Email Address</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Mail className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@cleangrid.com"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1">Phone Number</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Phone className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1">Password</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Lock className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none pr-7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#6A7B87] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8E9CA8] mb-1">Confirm Password</label>
              <div className="relative flex items-center bg-[#020503] border border-[#1b2b22] focus-within:border-[#00E5A0] rounded-xl px-3.5 py-2.5 transition-colors">
                <Lock className="w-4 h-4 text-[#6A7B87] shrink-0 mr-2.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-transparent text-sm text-white placeholder-[#50606D] outline-none pr-7"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-[#6A7B87] hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full mt-2 py-3.5 bg-[#00E5A0] hover:bg-[#00c781] text-black font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,160,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account (Sign Up)'}</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>

            <div className="text-center pt-3 text-xs text-[#8E9CA8]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('login');
                }}
                className="font-semibold text-[#00E5A0] hover:underline cursor-pointer ml-1"
              >
                Login here
              </button>
            </div>
          </form>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 pt-4 border-t border-[#1b2b22]/70 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-[#7E8B95] hover:text-white transition-colors cursor-pointer"
          >
            ← Back to EcoEnergy Home
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#101010] border border-[#292929] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-[#AAB8C5] mb-4">
              Enter your corporate email address to receive an instant recovery code.
            </p>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-[#00E5A0] mx-auto mb-1" />
                <span>Verification link dispatched to {forgotEmail}.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2.5 bg-[#000000] border border-[#292929] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00C781]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-[#AAB8C5] hover:text-white bg-[#292929] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-2 text-xs font-bold text-[#000000] bg-[#00C781] hover:bg-[#00E5A0] rounded-lg disabled:opacity-60 cursor-pointer"
                  >
                    {isResetting ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
