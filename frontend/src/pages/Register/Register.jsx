import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { IMAGES } from "../../constants/data.js";
import "./Register.css";

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength checker helper
  const getPasswordStrength = () => {
    if (!password)
      return {
        label: "Empty",
        color: "bg-gray-200",
        text: "text-gray-400",
        percent: 0,
      };
    if (password.length < 6)
      return {
        label: "Weak",
        color: "bg-rose-500",
        text: "text-rose-500",
        percent: 30,
      };

    // Check for alphanumeric complexity
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password);

    if (password.length >= 10 && hasNumbers && hasSymbols) {
      return {
        label: "Excellent",
        color: "bg-emerald-500",
        text: "text-emerald-500",
        percent: 100,
      };
    }
    return {
      label: "Good",
      color: "bg-amber-500",
      text: "text-amber-500",
      percent: 65,
    };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms of Syndicate to continue.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Map 'fullName' to 'name' so backend req.body validation passes
      const res = await register({
        name: fullName,
        email,
        phone,
        password,
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social registration flow
  const handleSocialLogin = async (provider) => {
    setError("");
    setIsSubmitting(true);
    const res = await register({
      name: `${provider} Builder`,
      email: `${provider.toLowerCase()}@startupconnect.io`,
      phone: "+1 (555) 0192",
      password: "social_default_pass",
    });

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || `${provider} registration failed.`);
    }
    setIsSubmitting(false);
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
              Create your co-founder identity card and start networking across
              deep-tech listings.
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
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
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm transition-colors bg-gray-50/50 font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
              <label
                htmlFor="terms"
                className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none"
              >
                I agree to the{" "}
                <span className="text-black font-semibold underline">
                  Terms of Syndicate
                </span>{" "}
                and understand my profile will be discoverable by registered
                deep-tech founders.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 duration-150 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating identity...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Register Identity
                </>
              )}
            </button>
          </form>
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
            "We found our Lead Firmware engineer inside 4 days of launching
            SolarisGrid."
          </h3>
          <div>
            <p className="font-bold text-base">&mdash; Elena Thorne</p>
            <p className="text-xs text-white/70 font-mono">
              Founder, SolarisGrid (Series A)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
