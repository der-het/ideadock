import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { IMAGES } from "../../constants/data.js";
import "./Login.css";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic email validation check
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);

      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(
          res.message || "Authentication failed. Check your credentials.",
        );
      }
    } catch (err) {
      setError("Connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setIsSubmitting(true);
    const mockEmail = `${provider.toLowerCase()}@startupconnect.io`;
    const res = await login(mockEmail, "social_auth");

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || `${provider} authentication failed.`);
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
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Unlock your co-founder terminal to audit your requests, explore
              recommended vectors, and bookmark listings.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-rose-800 text-xs font-semibold text-left"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                Email Address
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
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
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-xs border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-gray-500 select-none cursor-pointer"
                >
                  Remember terminal state
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            New to the ecosystem?{" "}
            <Link to="/register" className="text-black font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Image cover (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src={IMAGES.loginCover}
            alt="Dashboard mockup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-black/10 to-transparent" />
        </div>

        {/* Content overlaid on image */}
        <div className="absolute bottom-16 left-16 right-16 text-left space-y-4 text-white">
          <span className="font-mono text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
            Featured Ecosystem
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight leading-snug">
            "We aligned our liquidity routing with real-time builders inside 2
            hours of posting on EtherFlow."
          </h3>
          <div>
            <p className="font-bold text-base">&mdash; Julian Sterling</p>
            <p className="text-xs text-white/70 font-mono">
              Founder, EtherFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
