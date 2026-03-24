import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Phone, MessageSquare } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const { firebaseLogin } = useAuth();
  const navigate = useNavigate();

  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) { }
      recaptchaVerifierRef.current = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';
    setRecaptchaReady(false);
  };

  const setupRecaptcha = () => {
    // Always clear before re-initializing
    clearRecaptcha();

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved — user can now submit
        setRecaptchaReady(true);
      },
      'expired-callback': () => {
        // Token expired — reset so user must solve again
        setRecaptchaReady(false);
        setupRecaptcha();
      },
    });

    verifier.render().then(() => {
      recaptchaVerifierRef.current = verifier;
    }).catch((err) => {
      console.error('reCAPTCHA render failed:', err);
      setError('Failed to load reCAPTCHA. Please refresh the page.');
    });
  };

  // Initialize reCAPTCHA once on mount
  useEffect(() => {
    setupRecaptcha();

    // Cleanup on unmount
    return () => {
      clearRecaptcha();
    };
  }, []);

  // Re-initialize when user goes back to phone input step
  useEffect(() => {
    if (!confirmationResult) {
      setupRecaptcha();
    }
  }, [confirmationResult]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !recaptchaVerifierRef.current) return;

    setError('');
    setIsLoading(true);

    try {
      const parsedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      // ✅ Use the ref — do NOT call setupRecaptcha() here
      const confirmation = await signInWithPhoneNumber(auth, parsedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      console.error('OTP send error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      // Reset reCAPTCHA on failure so user can retry
      setupRecaptcha();
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
      console.error('OTP verify error:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-gradient-to-tr from-indigo-300/30 to-violet-300/30 blur-3xl rounded-full -z-10 animate-pulse" />

      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 transform transition-all shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-[#b57bff] mb-4 ring-1 ring-indigo-100 shadow-inner">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="text-slate-400 mt-2 font-medium">
            {confirmationResult ? 'Enter the OTP sent to your phone.' : 'Sign in with your phone number.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center animate-in fade-in zoom-in duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-ping" />
            {error}
          </div>
        )}

        {/* Step 1 — Phone Number */}
        {!confirmationResult && (
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
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Include country code (e.g. +91 for India)</p>
            </div>

            {/* ✅ reCAPTCHA renders here — ABOVE the button */}
            <div id="recaptcha-container" className="flex justify-center" />

            <button
              type="submit"
              disabled={isLoading || !phoneNumber || !recaptchaReady}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
            >
              {isLoading ? 'Sending OTP...' : !recaptchaReady ? 'Complete reCAPTCHA above' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2 — OTP Verification */}
        {confirmationResult && (
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
                  maxLength={6}
                  className="block w-full pl-11 pr-4 py-3 bg-[#151518]/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-[#151518]"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Enter the 6-digit code sent to {phoneNumber}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setConfirmationResult(null);
                setOtp('');
                setError('');
              }}
              className="w-full text-sm text-slate-400 mt-3 text-center hover:text-white transition-colors"
            >
              ← Use a different phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}