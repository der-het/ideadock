import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { motion } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { IMAGES } from '../../constants/data.js';
import './Register.css';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  // Password strength checker helper
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-gray-200', text: 'text-gray-400', percent: 0 };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500', percent: 30 };
    
    // Check for alphanumeric complexity
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password);
    
    if (password.length >= 10 && hasNumbers && hasSymbols) {
      return { label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-500', percent: 100 };
    }
    return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-500', percent: 65 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Syndicate to continue.');
      return;
    }

    try {
      register({ fullName, email, phone });
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  // Mock social login
  const handleSocialLogin = (provider) => {
    register({ fullName: `${provider} Builder`, email: `${provider.toLowerCase()}@startupconnect.io`, phone: '+1 (555) 0192' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-full border border-gray-100 shadow-xs hover:-translate-x-0.5 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Home Base
      </Link>

      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Join the Community
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Create your co-founder identity card and start networking across deep-tech listings.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-rose-800 text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="sarah.jenkins@designers.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 0124"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50"
              />
            </div>

            {/* Password with Strength meter */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                  Password <span className="text-red-500">*</span>
                </label>
                {password && (
                  <span className={`text-xs font-bold ${strength.text}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter bar */}
              {password && (
                <div className="space-y-1 pt-1.5">
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Include numbers and symbols for Excellent security.
                  </p>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 py-1">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-xs border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-black font-semibold underline">Terms of Syndicate</span> and understand my profile will be discoverable by registered deep-tech founders.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 duration-150 mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Register Identity
            </button>
          </form>

          {/* Social login block */}
          <div className="space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs font-mono font-bold uppercase tracking-widest text-gray-400">or register with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="border border-gray-200 hover:border-black py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.14 2.1-.14 2.1l3.22 2.5s.4-2.8.4-6.45z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.22-2.5c-.9.6-2.05.96-3.74.96-3.23 0-5.96-2.18-6.94-5.11L.82 17.51C2.8 21.43 6.88 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.06 14.44c-.25-.75-.39-1.56-.39-2.44s.14-1.69.39-2.44L.82 7.05C0 8.71 0 10.51 0 12s0 3.29.82 4.95l4.24-2.51z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 6.88 0 2.8 2.57.82 6.49l4.24 3.29C6.04 6.93 8.77 4.75 12 4.75z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="border border-gray-200 hover:border-black py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-semibold underline">
              Welcome back
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Illustration (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-50">
        <div className="absolute inset-0">
          <img
            src={IMAGES.registerIllustration}
            alt="Collaboration Workspace illustration"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-black/10 to-transparent" />
        </div>

        {/* Content overlaid on image */}
        <div className="absolute bottom-16 left-16 right-16 text-left space-y-4 text-white">
          <span className="font-mono text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
            Build the Guild
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight leading-snug">
            "We found our Lead Firmware engineer inside 4 days of launching SolarisGrid."
          </h3>
          <div>
            <p className="font-bold text-base">&mdash; Elena Thorne</p>
            <p className="text-xs text-white/70 font-mono">Founder, SolarisGrid (Series A)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
