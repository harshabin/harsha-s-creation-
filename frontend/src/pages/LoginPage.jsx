import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, UserCheck, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin' && redirectPath === '/') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleDemoCustomer = () => {
    setEmail('customer@ownbrand.com');
    setPassword('Customer@123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#08090C]">
      <div className="max-w-md w-full bg-[#11141B] rounded-3xl border border-[#232A38] p-8 sm:p-10 shadow-2xl space-y-6 text-[#E1E7F0]">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#99EEFF] font-mono">
            Harsha's Creation • Since 2024
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#8B95A5]">
            Access your order tracking, addresses, and wishlist
          </p>
        </div>

        {/* Demo Fast-Login Helper (Customer Only) */}
        <div className="p-3.5 bg-[#161B24] rounded-2xl border border-[#232A38] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8B95A5] text-center font-mono">
            ⚡ Quick Demo Access
          </p>
          <button
            type="button"
            onClick={handleDemoCustomer}
            className="w-full py-2.5 px-3 bg-[#11141B] hover:bg-[#1E2430] text-[#E1E7F0] hover:text-[#99EEFF] border border-[#232A38] hover:border-[#99EEFF]/40 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-[#99EEFF]" />
            <span>Fill Customer Demo Credentials</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-2xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#8B95A5] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#8B95A5] absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 absolute right-3.5 top-2.5 text-[#8B95A5] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#99EEFF] hover:bg-[#B3F2FF] text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-cyan-subtle flex items-center justify-center gap-2 disabled:opacity-50 mt-2 font-display"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#8B95A5] pt-2 border-t border-[#1E2430]">
          <span>New to Harsha's Creation? </span>
          <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="font-bold text-[#99EEFF] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

