import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    const res = await register({ name, email, phone, password });
    if (res.success) {
      navigate(redirectPath);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#08090C]">
      <div className="max-w-md w-full bg-[#11141B] rounded-3xl border border-[#232A38] p-8 sm:p-10 shadow-2xl space-y-6 text-[#E1E7F0]">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#99EEFF] font-mono">
            Harsha's Creation • Since 2024
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Create Your Account
          </h1>
          <p className="text-xs text-[#8B95A5]">
            Join the exclusive own-brand clothing experience
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-2xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
              <User className="w-4 h-4 text-[#8B95A5] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Email Address *
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
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-[#8B95A5] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Password (Min 6 Characters) *
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#8B95A5] absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#99EEFF] hover:bg-[#B3F2FF] text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-cyan-subtle flex items-center justify-center gap-2 disabled:opacity-50 mt-4 font-display"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#8B95A5] pt-2 border-t border-[#1E2430]">
          <span>Already registered? </span>
          <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="font-bold text-[#99EEFF] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

