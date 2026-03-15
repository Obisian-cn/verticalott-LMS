import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'instructor'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative py-12">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-br from-violet-300/30 to-fuchsia-300/30 blur-3xl rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md glass rounded-[2rem] p-8 sm:p-10 transform transition-all shadow-2xl shadow-violet-500/10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-violet-50 text-violet-600 mb-4 ring-1 ring-violet-100 shadow-inner">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join our learning platform today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-ping" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={twMerge(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                formData.role === 'student' 
                  ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm" 
                  : "border-slate-200 bg-white/50 text-slate-500 hover:border-violet-200 hover:bg-white"
              )}
            >
              <BookOpen className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'instructor' })}
              className={twMerge(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                formData.role === 'instructor' 
                  ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm" 
                  : "border-slate-200 bg-white/50 text-slate-500 hover:border-violet-200 hover:bg-white"
              )}
            >
              <GraduationCap className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Instructor</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm group-hover:bg-white"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm group-hover:bg-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm group-hover:bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/30 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 mt-4"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-600 hover:text-violet-500 transition-colors underline decoration-2 decoration-violet-200 hover:decoration-violet-500 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
