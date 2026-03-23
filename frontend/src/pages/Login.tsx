import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const { login, firebaseLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setError('');
    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const parsedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, parsedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    setError('');
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();
      await firebaseLogin(token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-gradient-to-tr from-indigo-300/30 to-violet-300/30 blur-3xl rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 transform transition-all shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-[#b57bff] mb-4 ring-1 ring-indigo-100 shadow-inner">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="text-slate-400 mt-2 font-medium">
            {isPhoneLogin ? 'Sign in with your phone number.' : 'Please enter your details to sign in.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center animate-in fade-in zoom-in duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-ping" />
            {error}
          </div>
        )}

        {/* Email/Password Login Disabled
        {!isPhoneLogin && (
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b57bff] transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3 bg-[#151518]/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-[#151518]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-300" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-[#b57bff] hover:text-[#b57bff] transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b57bff] transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="block w-full pl-11 pr-4 py-3 bg-[#151518]/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-[#151518]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-[#b57bff] to-[#e79a6d] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        )}
        */}

        {isPhoneLogin && !confirmationResult && (
        <form onSubmit={handlePhoneSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b57bff] transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <input
                id="phone"
                type="tel"
                required
                className="block w-full pl-11 pr-4 py-3 bg-[#151518]/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-[#151518]"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Include country code (e.g. +1)</p>
          </div>
          <button
            type="submit"
            disabled={isLoading || !phoneNumber}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-2"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
        )}

        {isPhoneLogin && confirmationResult && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="otp">
              Verification Code (OTP)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b57bff] transition-colors">
                <MessageSquare className="h-5 w-5" />
              </div>
              <input
                id="otp"
                type="text"
                required
                className="block w-full pl-11 pr-4 py-3 bg-[#151518]/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-[#151518]"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Enter the 6-digit code sent to your phone</p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-2"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" onClick={() => setConfirmationResult(null)} className="w-full text-sm text-slate-400 mt-3 text-center hover:text-white">
            Use a different phone number
          </button>
        </form>
        )}
        
        <div id="recaptcha-container"></div>
        
        {/* 
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setIsPhoneLogin(!isPhoneLogin);
              setConfirmationResult(null);
            }}
            className="text-sm font-bold text-[#b57bff] hover:text-indigo-400 transition-colors"
          >
            {isPhoneLogin ? 'Login with Email instead' : 'Login with Phone Number'}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#b57bff] hover:text-[#b57bff] transition-colors underline decoration-2 decoration-indigo-200 hover:decoration-indigo-500 underline-offset-4">
            Sign up now
          </Link>
        </p>
        */}
      </div>
    </div>
  );
}
